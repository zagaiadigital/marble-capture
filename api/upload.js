// api/upload.js

// Aumenta o limite de upload do servidor da Vercel para 10MB
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { fileBase64, uploadUrl, headers } = req.body;

        // Converte Base64 de volta para Binário (Buffer)
        const buffer = Buffer.from(fileBase64, 'base64');

        // Adiciona Content-Type
        const uploadHeaders = { ...headers };
        if (!uploadHeaders['Content-Type']) {
            uploadHeaders['Content-Type'] = 'image/jpeg';
        }

        // O Servidor faz a chamada pro Google Cloud (Sem CORS aqui!)
        const gcpRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: uploadHeaders,
            body: buffer,
        });

        if (!gcpRes.ok) {
            const errorText = await gcpRes.text();
            return res.status(gcpRes.status).json({ error: errorText });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Server side upload error:', error);
        return res.status(500).json({ error: error.message });
    }
}
