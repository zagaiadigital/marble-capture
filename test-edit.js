import { GoogleGenAI } from '@google/genai';

async function test() {
    if (!process.env.GEMINI_API_KEY) {
        console.log('No API key in env. Add GEMINI_API_KEY=...');
        return;
    }
    const ai = new GoogleGenAI({});
    try {
        const response = await ai.models.editImage({
            model: 'imagen-3.0-capability-001',
            prompt: 'a red apple',
            referenceImages: [{
                image: {
                    imageBytes: Buffer.from('test', 'utf-8').toString('base64')
                }
            }],
            config: {
                editMode: 'INPAINT_INSERT'
            }
        });
        console.log('Success');
    } catch (e) {
        console.error('Error:', e.message);
    }
}
test();
