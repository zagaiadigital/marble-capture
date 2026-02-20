import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { prompt, base64Image, base64Mask } = req.body;

        if (!prompt || !base64Image) {
            return res.status(400).json({ message: 'Missing prompt or image' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: 'GEMINI_API_KEY is not set' });
        }

        const ai = new GoogleGenAI({ apiKey });

        // Strip data URI prefix if present
        const strip = (b64) => b64?.includes(',') ? b64.split(',')[1] : b64;
        const imageBytes = strip(base64Image);
        const maskBytes = strip(base64Mask) ?? null;

        // Build referenceImages array for Imagen 3
        const referenceImages = [
            {
                referenceType: 'REFERENCE_TYPE_RAW',
                referenceImage: { imageBytes, mimeType: 'image/jpeg' },
            },
        ];

        // Include mask if provided (tells Imagen WHERE to edit)
        if (maskBytes) {
            referenceImages.push({
                referenceType: 'REFERENCE_TYPE_MASK',
                referenceImage: { imageBytes: maskBytes, mimeType: 'image/jpeg' },
                maskImageConfig: { maskMode: 'MASK_MODE_USER_PROVIDED' },
            });
        }

        const response = await ai.models.editImage({
            model: 'imagen-3.0-capability-001',
            prompt,
            referenceImages,
            editConfig: { editMode: 'EDIT_MODE_INPAINT_INSERTION' },
        });

        const editedBase64 = response?.generatedImages?.[0]?.image?.imageBytes;
        if (!editedBase64) {
            return res.status(500).json({ message: 'AI returned no image. Check your GEMINI_API_KEY and quota.' });
        }

        return res.status(200).json({ editedImage: editedBase64 });
    } catch (error) {
        console.error('AI Edit Error:', error?.message ?? error);
        return res.status(500).json({ message: error?.message || 'Internal Server Error' });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
};
