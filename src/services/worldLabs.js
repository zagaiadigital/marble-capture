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
 * Base function to call the generation API
 */
async function _generateWorldBase(body) {
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
 * Mode A: Trigger draft panorama generation from a video asset.
 */
export async function generateDraftPano(mediaAssetId) {
    return _generateWorldBase({
        display_name: 'Draft Pano',
        world_prompt: {
            type: 'video',
            video_prompt: {
                source: 'media_asset',
                media_asset_id: mediaAssetId,
            }
        },
        model: 'Marble 0.1-mini',
    });
}

/**
 * Mode B: Trigger an AI edit on an existing panorama using a mask and prompt.
 */
export async function generateInpaintPano(panoUrl, base64Mask, prompt) {
    // CRITICAL FIX: Strip the 'data:image/jpeg;base64,' prefix before sending
    const cleanMask = base64Mask.includes(',') ? base64Mask.split(',')[1] : base64Mask;

    return _generateWorldBase({
        display_name: 'Inpainted Pano',
        world_prompt: {
            type: 'inpaint-pano',
            pano_image: { source: 'uri', uri: panoUrl },
            pano_mask: { source: 'data_base64', data_base64: cleanMask, extension: 'jpg' },
            text_prompt: prompt,
        },
        model: 'Marble 0.1-mini',
    });
}

/**
 * Mode C: Generate the final 3D world from a panorama image.
 */
export async function generateFinalWorld(finalPanoUrl) {
    return _generateWorldBase({
        display_name: 'Final Plus World',
        world_prompt: {
            type: 'image',
            is_pano: true, // CRITICAL FIX: Ensure AI treats it as a 360 panorama, not a flat photo
            image_prompt: { source: 'uri', uri: finalPanoUrl },
        },
        model: 'Marble 0.1-plus',
    });
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
 * Utility to extract structured result data from a completed operation.
 */
export function extractWorldResult(pollResponse) {
    const response = pollResponse.response || {};
    const worldId = pollResponse.metadata?.world_id || response.id;

    return {
        panoUrl: response.assets?.imagery?.pano_url || null,
        thumbnailUrl: response.assets?.thumbnail_url || null,
        caption: response.assets?.caption || '',
        worldMarbleUrl: response.world_marble_url || `https://marble.worldlabs.ai/world/${worldId}`,
        worldId,
        splats: response.assets?.splats?.spz_urls || null,
    };
}
