# Setup

Two apps: this storefront and a Medusa v2 backend (`npx create-medusa-app@latest`, separate folder).
Copy `.env.example` to `.env` in the storefront, then `npm install && npm run dev`.

## Keys

| Key | Get it | Put it |
|---|---|---|
| `PUBLIC_MEDUSA_URL` | Your Medusa server URL (`http://localhost:9000` locally) | storefront `.env` |
| `PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Medusa Admin → Settings → Publishable API Keys → create, add your sales channel | storefront `.env` |
| `PUBLIC_STRIPE_PUBLISHABLE_KEY` | dashboard.stripe.com → Developers → API keys (`pk_…`) | storefront `.env` |
| `STRIPE_API_KEY` | Same page (`sk_…`) | Medusa `.env` |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → endpoint `https://<medusa>/hooks/payment/stripe_stripe`, events `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.amount_capturable_updated` (`whsec_…`) | Medusa `.env` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | console.cloud.google.com → APIs & Services → Credentials → OAuth client ID (Web). Authorized redirect URI: `http://localhost:5173/auth/callback` (plus your production URL) | Medusa `.env` |
| `GOOGLE_CALLBACK_URL` | `http://localhost:5173/auth/callback` | Medusa `.env` |
| `RESEND_API_KEY` | resend.com → API Keys | storefront `.env` |
| `RESEND_AUDIENCE_ID` | resend.com → Audiences → create a list → copy its ID | storefront `.env` |
| `RESEND_FROM` | A sender on a domain verified in Resend | storefront `.env` |

## Medusa `medusa-config.ts`

```ts
modules: [
  { resolve: '@medusajs/medusa/payment', options: { providers: [
    { resolve: '@medusajs/medusa/payment-stripe', id: 'stripe',
      options: { apiKey: process.env.STRIPE_API_KEY, webhookSecret: process.env.STRIPE_WEBHOOK_SECRET } } ] } },
  { resolve: '@medusajs/medusa/auth', dependencies: ['cache'], options: { providers: [
    { resolve: '@medusajs/medusa/auth-google', id: 'google', options: {
      clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL } } ] } }
]
```
Set `STORE_CORS` and `AUTH_CORS` to include `http://localhost:5173`.

## Medusa Admin

1. Region: enable the Stripe payment provider; add a shipping option.
2. Products: create Lion's Mane, Reishi, Chaga with variants (e.g. 10ml, 30ml), a thumbnail, and prices.
3. Settings → Secret API Keys: create one and use it as `MEDUSA_ADMIN_SECRET`. Welcome codes are created automatically, one use each.
4. Auth: the email/password (`emailpass`) provider is on by default in Medusa v2.

## Brand

- Colors and fonts: `src/app.css`. The font is a stand-in for the logo's wobbly display face; set `--font-display` to your licensed font.
- Copy, nav links, hero photo: `src/lib/site.ts` and `static/hero.jpg`.

## Notes

- Uses the official `@medusajs/js-sdk` instead of `sveltekit-medusa-sdk`, so the code tracks Medusa v2 directly.
- Not built: account and order-history pages, product galleries.
- Untested: written without network access, so run `npm install && npm run check` first.

## Deploy to Cloudflare Pages

Medusa is a Node server and cannot run on Pages. Host it elsewhere (Medusa Cloud, Railway, Render) first.

1. Push this folder to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build command `npm run build`, output directory `.svelte-kit/cloudflare`.
4. Settings → Variables and Secrets: add every storefront key from the table above. Set `RESEND_API_KEY` as a secret.
5. In Medusa, add your Pages domain to `STORE_CORS` and `AUTH_CORS`, and set `GOOGLE_CALLBACK_URL` to `https://<domain>/auth/callback`. Add the same URL as an authorized redirect URI in Google Cloud.
6. Set `PUBLIC_MEDUSA_URL` to your hosted Medusa URL, and use live Stripe keys and webhook.

Local preview of the Cloudflare build: `npm run build && npm run preview`.

## Content

- Blog: add a `.md` file to `src/posts/` with `title`, `date`, `summary` frontmatter. It appears on `/blog` and is prerendered at build.
- Shipping, privacy, and terms live in `src/routes/*/+page.md`. These are drafts: replace `[your email]` and `[state]`, and confirm the shipping and returns terms and the legal wording with a lawyer.

## Email list and sign-in keys

| Key | Get it | Put it |
|---|---|---|
| `MEDUSA_ADMIN_SECRET` | Medusa Admin → Settings → Secret API Keys | storefront `.env` (server only) |
| `CODE_SECRET` | `openssl rand -hex 32` | storefront `.env` (server only) |

Signup emails get a code like `WELCOME-1A2B3C4D`: same email, same code, valid once. The popup appears after `popupDelayMs` in `src/lib/site.ts`. Add a Cloudflare rate-limit rule on `/api/subscribe` so nobody can use it to spam addresses. Resend adds unsubscribe handling for list broadcasts.

Signed-in customers keep their cart through checkout: a guest cart is attached to the account on sign-in.

## SEO checklist

- Every public page has a title, description, canonical URL, OpenGraph and Twitter tags. Products emit Product and breadcrumb JSON-LD, posts emit BlogPosting JSON-LD, and the site emits Organization and WebSite JSON-LD.
- `/sitemap.xml` (products update hourly, posts and legal pages included), `/robots.txt`, and `/rss.xml` are generated. Private pages are `noindex` and disallowed.
- Set `static/og.png` (1200x630) to your preferred share image, and add `image:` frontmatter to posts for a per-post image.
- Cloudflare: add a redirect rule from `www.driftlessgenetics.co` to the apex, enable HTTPS redirect, then submit `https://driftlessgenetics.co/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- Not included: password reset (needs a Medusa notification provider).
