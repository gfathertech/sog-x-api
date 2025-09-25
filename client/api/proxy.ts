import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const REAL_API = process.env.REAL_API_URL;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = `${REAL_API}${req.url}`;

    // Convert headers to string-only format
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (value === undefined) continue;
      headers[key] = Array.isArray(value) ? value.join(',') : value;
    }

    const options: any = {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
    };

    const response = await fetch(url, options);
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Proxy failed', details: err.message });
  }
}