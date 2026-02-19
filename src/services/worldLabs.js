/**
 * World Labs API Service
 * Handles the multi-step async flow: upload images → generate world → poll for result
 *
 * Base URL: https://api.worldlabs.ai/marble/v1
 *
 * CORS Note: If the browser blocks direct calls, configure a Vite proxy in vite.config.js:
 *   server: { proxy: { '/api': { target: 'https://api.worldlabs.ai', changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') } } }
 *   Then change BASE_URL to '/api/marble/v1'
 */

const BASE_URL = '/api';

function getApiKey() {
    const key = sessionStorage.getItem('wl_api_key');
    if (!key) throw new Error('API Key not found. Please go back and enter your key.');
    return key;
}

function apiHeaders() {
    return {
        'Content-Type': 'application/json',
        'WLT-Api-Key': getApiKey(),
    };
}

/**
 * Step A: Upload a single image blob to World Labs.
 * 1. POST /media-assets:prepare_upload → get upload_url + media_asset_id
 * 2. PUT upload_url with the binary blob (respecting required_headers)
 * Returns: media_asset_id
 */
export async function uploadImage(blob, index = 0) {
    // A1: Prepare upload
    const prepareRes = await fetch(`${BASE_URL}/media-assets:prepare_upload`, {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify({
            file_name: `capture_${index}.jpg`,
            kind: 'image',
            extension: 'jpg',
        }),
    });

    if (!prepareRes.ok) {
        const errorBody = await prepareRes.text();
        throw new Error(`Prepare upload failed (${prepareRes.status}): ${errorBody}`);
    }

    const prepareData = await prepareRes.json();
    const { media_asset, upload_info } = prepareData;
    const mediaAssetId = media_asset.id;
    const uploadUrl = upload_info.upload_url;
    const requiredHeaders = upload_info.required_headers || {};

    // 1. NÃO vamos forçar o Content-Type. O Google Cloud é super chato com a "assinatura" do link.
    // Vamos enviar EXATAMENTE e APENAS os headers que a World Labs pediu.
    const uploadHeaders = { ...requiredHeaders };

    // 2. O Pulo do Gato: Envolvemos a URL do Google Cloud em um Proxy Público de CORS
    const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(uploadUrl)}`;

    // 3. Fazemos o upload através do proxy
    const uploadRes = await fetch(proxiedUrl, {
        method: upload_info.upload_method || 'PUT',
        headers: uploadHeaders,
        body: blob,
    });

    if (!uploadRes.ok) {
        const errorBody = await uploadRes.text();
        throw new Error(`Image upload failed (${uploadRes.status}): ${errorBody}`);
    }

    return mediaAssetId;
}

/**
 * Upload all images with controlled concurrency.
 * Returns array of { id, azimuth }.
 * onProgress(uploaded, total) called after each upload completes.
 */
export async function uploadAllImages(capturedImages, onProgress) {
    const CONCURRENCY = 3;
    const results = [];
    let completed = 0;

    // Process in batches of CONCURRENCY
    for (let i = 0; i < capturedImages.length; i += CONCURRENCY) {
        const batch = capturedImages.slice(i, i + CONCURRENCY);
        const batchResults = await Promise.all(
            batch.map(async (img, batchIndex) => {
                const globalIndex = i + batchIndex;
                const mediaAssetId = await uploadImage(img.blob, globalIndex);
                completed++;
                if (onProgress) onProgress(completed, capturedImages.length);
                return { id: mediaAssetId, azimuth: img.azimuth };
            })
        );
        results.push(...batchResults);
    }

    return results;
}

/**
 * Step B: Trigger world generation with 8 uploaded media assets.
 * Returns: operation_id
 */
export async function generateWorld(assetIds, model = 'Marble 0.1-mini') {
    const multiImagePrompt = assetIds.map(({ id, azimuth }) => ({
        azimuth,
        content: {
            source: 'media_asset',
            media_asset_id: id,
        },
    }));

    const body = {
        display_name: '360 Capture',
        world_prompt: {
            type: 'multi-image',
            reconstruct_images: true,
            multi_image_prompt: multiImagePrompt,
            text_prompt: 'A 360 capture of a space',
        },
        model,
    };

    const res = await fetch(`${BASE_URL}/worlds:generate`, {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`World generation failed (${res.status}): ${errorBody}`);
    }

    const data = await res.json();
    return data.operation_id;
}

/**
 * Step C: Poll an operation until done.
 * Returns the full response object from the completed operation.
 * onStatus(description) called on each poll with the progress description.
 */
export async function pollOperation(operationId, onStatus) {
    const POLL_INTERVAL = 5000; // 5 seconds
    const MAX_POLLS = 120; // 10 minutes max

    for (let attempt = 0; attempt < MAX_POLLS; attempt++) {
        const res = await fetch(`${BASE_URL}/operations/${operationId}`, {
            method: 'GET',
            headers: {
                'WLT-Api-Key': getApiKey(),
            },
        });

        if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(`Poll failed (${res.status}): ${errorBody}`);
        }

        const data = await res.json();

        // Report current status
        if (data.metadata?.progress?.description && onStatus) {
            onStatus(data.metadata.progress.description);
        }

        // Check if operation errored
        if (data.error) {
            throw new Error(`Generation error: ${JSON.stringify(data.error)}`);
        }

        // Check if done
        if (data.done) {
            return data;
        }

        // Wait before next poll
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    }

    throw new Error('Operation timed out after 10 minutes.');
}

/**
 * Full orchestration: upload all images → generate → poll → return result.
 * onProgress({ phase, detail, uploaded, total }) for UI updates.
 */
export async function uploadAndGenerate(capturedImages, onProgress) {
    // Phase 1: Upload images
    onProgress({ phase: 'upload', detail: 'Preparing uploads...', uploaded: 0, total: capturedImages.length });

    const assetIds = await uploadAllImages(capturedImages, (uploaded, total) => {
        onProgress({
            phase: 'upload',
            detail: `Uploading image ${uploaded} of ${total}...`,
            uploaded,
            total,
        });
    });

    // Phase 2: Trigger generation
    onProgress({ phase: 'generate', detail: 'Starting world generation...' });
    const operationId = await generateWorld(assetIds);

    // Phase 3: Poll for result
    onProgress({ phase: 'poll', detail: 'World generation in progress...' });

    const result = await pollOperation(operationId, (description) => {
        onProgress({ phase: 'poll', detail: description });
    });

    // Extract result data
    const response = result.response || {};
    const worldId = result.metadata?.world_id || response.id;

    return {
        panoUrl: response.assets?.imagery?.pano_url || null,
        thumbnailUrl: response.assets?.thumbnail_url || null,
        caption: response.assets?.caption || '',
        worldMarbleUrl: response.world_marble_url || `https://marble.worldlabs.ai/world/${worldId}`,
        worldId,
        splats: response.assets?.splats?.spz_urls || null,
    };
}
