import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
    // Vercel Serverless Functions use req.method to check HTTP methods
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { prompt, base64Image, pitch, yaw } = req.body;

        if (!prompt || !base64Image) {
            return res.status(400).json({ message: 'Missing prompt or image' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: 'GEMINI_API_KEY is not set' });
        }

        const ai = new GoogleGenAI({ apiKey });

        // Strip the Base64 Data URI prefix ("data:image/jpeg;base64,...")
        const pureBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

        const response = await ai.models.editImage({
            model: 'gemini-3.1-nano-banana-pro',
            prompt: prompt,
            referenceImage: {
                inlineData: {
                    data: pureBase64,
                    mimeType: 'image/jpeg'
                }
            },
            editMode: 'INPAINT_INSERT',
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            return res.status(500).json({ message: 'Failed to extract edited image from AI payload.' });
        }

        const editedBase64 = response.generatedImages[0].image.imageBytes;

        if (!editedBase64) {
            return res.status(500).json({ message: 'Failed to extract edited image from AI payload.' });
        }

        // Return pure base64 as requested, allow frontend to format
        return res.status(200).json({ editedImage: editedBase64 });
    } catch (error) {
        console.error('AI Edit Error:', error);
        return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
};
