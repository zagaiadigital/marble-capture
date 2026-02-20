import { generateInpaintPano } from './src/services/worldLabs.js';

// Mock session storage for API key
global.sessionStorage = {
    getItem: () => 'fake_api_key'
};

// Mock fetch to intercept the request and validate the payload
global.fetch = async (url, options) => {
    console.log(`Intercepted fetch to: ${url}`);

    try {
        const body = JSON.parse(options.body);
        console.log("Validating payload...");

        // 1. Check base64 mask string cleaning
        const mask = body.world_prompt?.pano_mask?.data_base64;
        if (!mask) throw new Error("Mask not found in payload");
        if (mask.startsWith('data:image')) {
            throw new Error("Mask still contains data URI prefix!");
        }
        console.log("✅ Mask string is clean");

        // 2. Check inpaint-pano structure
        if (body.world_prompt?.type !== 'inpaint-pano') {
            throw new Error("world_prompt type is not inpaint-pano");
        }
        if (!body.world_prompt?.pano_image?.uri) {
            throw new Error("pano_image uri is missing");
        }
        if (body.world_prompt?.text_prompt !== 'test prompt') {
            throw new Error("text_prompt does not match");
        }
        console.log("✅ world_prompt structure is perfectly aligned with docs");

        // Return a mock operation ID
        return {
            ok: true,
            json: async () => ({ operation_id: 'mock_op_id' })
        };
    } catch (e) {
        console.error("Payload validation failed:");
        console.error(e.message);
        return {
            ok: false,
            text: async () => 'Error validation'
        };
    }
};

async function test() {
    console.log("Running fetch interception test for generateInpaintPano...");
    const base64Mask = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/';
    const panoUrl = 'http://example.com/pano.jpg';
    const prompt = 'test prompt';

    try {
        const opId = await generateInpaintPano(panoUrl, base64Mask, prompt);
        console.log("✅ Test successful. Operation ID:", opId);
    } catch (e) {
        console.error("Test failed:", e);
    }
}

test();
