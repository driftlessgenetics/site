import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { PUBLIC_MEDUSA_URL } from '$env/static/public';
import { site } from '$lib/site';
import type { RequestHandler } from './$types';

// The same email always maps to the same code, so repeat signups cannot mint extra codes.
async function codeFor(email: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(env.CODE_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(email)));
  return 'WELCOME-' + [...sig.slice(0, 4)].map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}
const resend = (path: string, body: unknown) => fetch(`https://api.resend.com${path}`, {
  method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

export const POST: RequestHandler = async ({ request }) => {
  const email = String((await request.json()).email ?? '').trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) error(400, 'Invalid email');
  const code = await codeFor(email);

  // One-use 15% promotion in Medusa. An "already exists" reply on repeat signups is fine.
  const promo = await fetch(`${PUBLIC_MEDUSA_URL}/admin/promotions`, {
    method: 'POST',
    headers: { Authorization: `Basic ${btoa(env.MEDUSA_ADMIN_SECRET + ':')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code, type: 'standard', status: 'active', is_automatic: false,
      application_method: { type: 'percentage', target_type: 'order', allocation: 'across', value: 15, currency_code: 'usd' },
      campaign: { name: code, campaign_identifier: code, budget: { type: 'usage', limit: 1 } }
    })
  });
  if (!promo.ok && !(await promo.text()).toLowerCase().includes('exist')) error(502, 'Could not create code');

  await resend(`/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, { email });
  const sent = await resend('/emails', {
    from: env.RESEND_FROM, to: email, reply_to: site.email, subject: `Your ${site.discount} off code`,
    html: `<p>Use <strong>${code}</strong> at checkout for ${site.discount} off your first order.</p><p><a href="${site.url}">${site.name}</a></p>`
  });
  if (!sent.ok) error(502, 'Email failed');
  return json({ ok: true });
};
