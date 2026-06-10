This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Deploy on Cloudflare Pages

### Why deploys keep failing on `30d1fe2`

If your log shows `HEAD is now at 30d1fe2` and `video/ZV.mp4 is 25.5 MiB`, Cloudflare is **retrying an old deployment**, not building latest `main`. That commit still contains the oversized source files and has no build step.

**Do not click Retry** on failed deployments. Either:

1. **GitHub Actions (recommended)** — set secrets below and push to `main`; the workflow builds `out/` and deploys the latest commit.
2. **Cloudflare dashboard** — Deployments → **Create deployment** on branch `main` (latest commit), with build settings below.

### GitHub Actions setup (one time)

In GitHub → **Settings → Secrets and variables → Actions**, add:

| Secret | Where to get it |
|--------|-----------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → Create Token → **Edit Cloudflare Workers** template (include Pages) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → Workers & Pages → right sidebar **Account ID** |

Then push to `main`. Check the **Actions** tab for the deploy workflow.

### Cloudflare dashboard build settings

If you use Git integration instead of GitHub Actions:

| Setting | Value |
|---------|-------|
| **Framework preset** | Next.js (Static HTML Export) |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |
| **Root directory** | `/` |
| **Node.js version** | `20` |

Production videos live in `public/video/` only. The local `video/` folder is gitignored and never deployed.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
