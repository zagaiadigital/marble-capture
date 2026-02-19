/**
 * World Labs API Service
 * Handles the multi-step async flow: upload video → generate world → poll for result
 *
 * Base URL: https://api.worldlabs.ai/marble/v1
 */

const BASE_URL = '/wl-proxy';

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
 * Step A: Prepare Upload
 */
export async function prepareUpload(fileName = 'capture.mp4') {
    const prepareRes = await fetch(`${BASE_URL}/media-assets:prepare_upload`, {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify({
            file_name: fileName,
            kind: 'video',
            extension: 'mp4',
        }),
    });

    if (!prepareRes.ok) {
        const errorBody = await prepareRes.text();
        throw new Error(`Prepare upload failed (${prepareRes.status}): ${errorBody}`);
    }

    const prepareData = await prepareRes.json();
    return prepareData; // { media_asset: {...}, upload_info: {...} }
}

/**
 * Step B: Direct Video Upload via XMLHttpRequest
 */
export function uploadVideoDirect(file, uploadUrl, requiredHeaders, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // CRITICAL FIX: Route the upload through the Vercel rewrite proxy to bypass CORS
        const proxiedUploadUrl = uploadUrl.replace('https://storage.googleapis.com/', '/gcs-proxy/');

        xhr.open('PUT', proxiedUploadUrl, true);

        // Set required headers from World Labs API
        for (const [key, value] of Object.entries(requiredHeaders)) {
            xhr.setRequestHeader(key, String(value));
        }

        // Set content type
        xhr.setRequestHeader('Content-Type', 'video/mp4');

        // Progress listener
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentage = Math.round((event.loaded / event.total) * 100);
                if (onProgress) onProgress(percentage);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
            } else {
                reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
            }
        };

        xhr.onerror = () => reject(new Error('Network error during video upload.'));
        xhr.send(file);
    });
}

/**
 * Step C: Trigger world generation with the uploaded video asset.
 */
export async function generateWorld(mediaAssetId, model = 'Marble 0.1-plus') {
    const body = {
        display_name: 'Video World',
        world_prompt: {
            type: 'video',
            video_prompt: {
                source: 'media_asset',
                media_asset_id: mediaAssetId,
            }
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
 * Step D: Poll an operation until done.
 */
export async function pollOperation(operationId, onStatus) {
    const POLL_INTERVAL = 10000; // 10 seconds
    const MAX_POLLS = 180; // 30 minutes max

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

    throw new Error('Operation timed out after 30 minutes.');
}

/**
 * Full orchestration: upload video → generate → poll → return result.
 * onProgress({ phase, detail, percentage }) for UI updates.
 */
export async function uploadAndGenerate(videoFile, onProgress) {
    // Phase 1 A: Prepare
    onProgress({ phase: 'upload', detail: 'Preparing upload url...', percentage: 0 });
    const authAndUploadInfo = await prepareUpload(videoFile.name || 'capture.mp4');

    const mediaAssetId = authAndUploadInfo.media_asset.media_asset_id || authAndUploadInfo.media_asset.id;
    const uploadUrl = authAndUploadInfo.upload_info.upload_url;
    const requiredHeaders = authAndUploadInfo.upload_info.required_headers || {};

    // Phase 1 B: Direct Upload
    await uploadVideoDirect(videoFile, uploadUrl, requiredHeaders, (percentage) => {
        onProgress({ phase: 'upload', detail: `Uploading Video (${percentage}%)...`, percentage });
    });

    // Phase 2: Trigger generation
    onProgress({ phase: 'generate', detail: 'Processing in Cloud...', percentage: 100 });
    const operationId = await generateWorld(mediaAssetId);

    // Phase 3: Poll for result
    onProgress({ phase: 'poll', detail: 'Generating 3D World (takes ~5 mins)...' });
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
