/**
 * Post-build step: publish a 404.html that is a copy of the SPA shell.
 *
 * Static hosts serve /404.html for any path that does not match a real file.
 * Because that copy IS the React app, a direct visit to a client-side route
 * (/login, /admin-login, /dashboard, ...) boots the app and React Router
 * renders the right screen, instead of the host's plain "page not found".
 *
 * `vercel.json` rewrites already handle this when Vercel reads the config;
 * this keeps deep links working even when a project's Root Directory setting
 * makes that file invisible to the platform.
 */
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const shell = join(dist, 'index.html');
const notFound = join(dist, '404.html');

if (!existsSync(shell)) {
  console.error('[postbuild] dist/index.html not found - skipping 404.html copy');
  process.exit(0);
}

copyFileSync(shell, notFound);
console.log('[postbuild] dist/404.html created (SPA deep links: /login, /admin-login, /dashboard)');