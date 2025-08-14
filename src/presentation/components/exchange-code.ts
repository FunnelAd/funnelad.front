// pages/api/facebook/exchange-code.ts (pages router) - o app/api/... en app-router
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Missing code' });

  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID!,
    client_secret: process.env.FACEBOOK_APP_SECRET!,
    code,
    redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
  });

  const r = await fetch(`https://graph.facebook.com/v23.0/oauth/access_token?${params.toString()}`);
  const data = await r.json();

  if (!r.ok) return res.status(500).json({ error: data });

  // data contains access_token, token_type, expires_in
  return res.status(200).json(data);
}
