import { app } from '../backend/src/server.js';
import type { IncomingMessage, ServerResponse } from 'http';

// Disable Vercel's default body parsing so we can handle the stream/buffer directly
export const config = {
    runtime: 'nodejs', // Explicitly force Node.js runtime
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    try {
        // 1. Reconstruct the full URL
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        const url = `${protocol}://${host}${req.url}`;

        // 2. Convert headers
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
            if (Array.isArray(value)) {
                value.forEach(v => headers.append(key, v));
            } else if (typeof value === 'string') {
                headers.set(key, value);
            }
        }

        // 3. Read body into a buffer (simplest reliable way for Node -> Web req in Serverless)
        const method = req.method || 'GET';
        let body: any = null;

        if (method !== 'GET' && method !== 'HEAD') {
            const chunks = [];
            for await (const chunk of req) {
                chunks.push(chunk);
            }
            body = Buffer.concat(chunks);
        }

        // 4. Create proper Web Request
        const webReq = new Request(url, {
            method,
            headers,
            body,
        });

        // 5. Let Elysia handle it
        const webRes = await app.handle(webReq);

        // 6. Bridge Response back to Node
        res.statusCode = webRes.status;
        webRes.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        const arrayBuffer = await webRes.arrayBuffer();
        res.end(Buffer.from(arrayBuffer));

    } catch (error) {
        console.error('Vercel Adapter Error:', error);
        res.statusCode = 500;
        res.end('Internal Server Error');
    }
}
