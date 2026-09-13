# Printkart24

Printkart24 is a Next.js storefront for personalized products, business printing, packaging, corporate gifts, and promotional products.

## Run locally

Requirements: Node.js 20+ and npm, pnpm, or another compatible package manager.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Useful commands

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Run the production build
npm run lint      # Check code quality, if configured
```

## Project structure

```text
app/                  Pages, layouts, API routes, and admin routes
components/           Reusable storefront and dashboard UI
hooks/                Shared React hooks and client state
lib/                  Catalog, database, authentication, and server utilities
public/               Static images and public assets
app/globals.css       Global design tokens and responsive styles
package.json          Scripts and dependencies
```

## Important routes

- `/` — storefront homepage
- `/category/[category]` — product category pages
- `/product/[slug]` — product detail pages
- `/cart` — shopping cart
- `/checkout` — checkout flow
- `/admin/orders` — admin order dashboard

## Environment variables

Copy the required variables into a local `.env.local` file. Never commit secrets. The hosted project provides its environment variables through Vercel; local development may require database, email, and admin configuration.

Common variables include:

- `DATABASE_URL` — database connection
- `ADMIN_PASSWORD` — admin panel authentication
- `RESEND_API_KEY` and `RESEND_EMAIL_DOMAIN` — email delivery

## Editing the project

Start the development server, edit files in VS Code, and refresh the browser. Most visual changes live in `components/` and `app/globals.css`; routes live under `app/`; server-side logic lives under `app/api/` and `lib/`.

## Git workflow

Create a feature branch before making changes:

```bash
git checkout -b feature/your-change
git add .
git commit -m "Describe your change"
git push -u origin feature/your-change
```

Open a pull request instead of pushing directly to `main`. Review `.gitignore` before committing and never add `.env` files, passwords, tokens, or generated build folders.
