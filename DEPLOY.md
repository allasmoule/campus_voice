# Deploying TheCampusVoice to Namecheap (cPanel) shared hosting

This project has two parts that deploy differently:

- **Frontend** — Next.js static export (`npm run build` → `out/`). Pure HTML/CSS/JS, goes in `public_html/`.
- **Backend + Admin** — plain PHP + MySQL. No Node.js needed. Goes in `public_html/backend/` and `public_html/admin/`.

## 1. Create the database

1. cPanel → **MySQL Databases** → create a database (e.g. `campusvoice`) → note the full name cPanel gives it (usually `cpaneluser_campusvoice`).
2. Create a database user + strong password, note both.
3. Add the user to the database with **ALL PRIVILEGES**.
4. cPanel → **phpMyAdmin** → select the new database → **Import** → upload [database/schema.sql](database/schema.sql).

## 2. Configure the backend

Edit [backend/config.php](backend/config.php) and fill in:

```php
define('DB_NAME', 'cpaneluser_campusvoice');
define('DB_USER', 'cpaneluser_cvuser');
define('DB_PASS', 'the-password-you-set');
define('IP_HASH_SALT', 'any-random-string-you-make-up');
```

## 3. Upload files

Via cPanel File Manager or FTP, upload into `public_html/`:

- `out/*` (the built static site — run `npm run build` locally first, then upload the **contents** of the `out/` folder)
- `backend/` folder as-is
- `admin/` folder as-is
- `uploads/` folder as-is (must be writable by PHP — cPanel's default permissions are fine; only needed if you'll upload image/video ad files rather than linking to external URLs)

Resulting layout on the server:

```
public_html/
  index.html, _next/, stories/, submit/, ...   ← from out/
  backend/
    config.php, submissions.php, survey.php, newsletter.php, stories.php, ads.php, media.php, ...
  admin/
    index.php, 1100.php, submissions.php, ads.php, ...
  uploads/
    ads/   ← uploaded ad images/videos land here
```

## 4. Create your admin account and log in

`schema.sql` no longer seeds an account — credentials never belong in a version-controlled file, especially once a repo is public. Instead:

1. Visit `https://yourdomain.com/admin/setup.php` once. Choose your own username and a password (10+ characters).
2. **Delete `admin/setup.php` from the server immediately after** — it refuses to run again once an account exists, but there's no reason to leave it reachable.
3. Log in at `https://yourdomain.com/admin/1100`.

The login itself is a 3-step gate, reached only at that URL (there is no `/admin/login` — that path doesn't exist):
1. **Access Code** — default `1103` (change the `GATE_CODE` constant in `backend/config.php` any time)
2. **Verify Your Name** — the admin username you chose in setup.php
3. **Password** — the password you chose in setup.php

Each step is rate-limited independently and the whole flow expires after 10 minutes if not completed, restarting from step 1. Five wrong passwords locks the account for 15 minutes.

To change your password later, there's no in-panel flow yet — do it via phpMyAdmin: run `UPDATE admin_users SET password_hash = '...' WHERE username = 'yourusername'` with a new bcrypt hash (generate one with `php -r "echo password_hash('your-new-password', PASSWORD_DEFAULT);"` if you have local PHP, or ask for one to be generated).

## 5. Verify HTTPS

Make sure your domain has an SSL certificate active (Namecheap/cPanel → **AutoSSL**, usually automatic and free). The admin login cookie is marked `secure`, so the admin panel requires HTTPS to work correctly.

## 6. Ongoing content flow

- Visitors submit stories/surveys/newsletter signups → land in MySQL as `pending`/`flagged`.
- You review them at `/admin/submissions.php`, edit if needed, and **Approve & Publish**.
- Approved stories immediately appear on the live site's Stories page and get their own shareable URL at `/stories/view?slug=...` — **no rebuild or redeploy needed**, since that page fetches from the backend at runtime.
- If you ever redesign and want approved stories to get "real" clean URLs (`/stories/my-story-title` instead of `/stories/view?slug=...`) baked into the static export, that requires rebuilding the Next.js site (`npm run build`) after publishing and re-uploading `out/` — only worth doing if you get shell/cron access on your hosting plan later.

## Managing ads

At `/admin/ads.php`, every ad targets one specific **Placeholder** — an exact ad slot on the site (e.g. "Submit Page — Top", "Homepage — Middle"), picked from a dropdown grouped by page. The full list of placeholders and the format (banner/rectangle/leaderboard) each one renders at is defined once in [backend/placeholders.php](backend/placeholders.php) — if a new `<AdSlot>` is ever added to the frontend, add a matching entry there or it won't show up as selectable.

Each ad is one of three types:
- **Image** — upload a file (jpg/png/gif/webp, max 5MB) or paste an external image URL
- **Video** — upload a file (mp4/webm/ogg, max 30MB) or paste an external video URL
- **Custom Code** — paste a raw HTML/JS embed snippet (e.g. an ad-network tag); it runs on the live site exactly as pasted for every visitor, so only use code from networks you trust

Multiple ads can target the same placeholder — one is picked at random each time a visitor loads that page. Toggle any ad to "Paused" to take it out of rotation without deleting it.

Two things depend on your hosting plan's PHP configuration (`php.ini`), not on this code: the actual max upload size is also capped by `upload_max_filesize` / `post_max_size` on the server — if a large video upload fails, ask Namecheap support (or check cPanel → **MultiPHP INI Editor**) to raise those values.

## Advertising contact

At `/admin/advertising.php` ("Advertising Contact" in the sidebar) you can set a contact name, email, phone, and short message. Once an email is saved, a "Contact for Advertising" button (or your custom message) automatically appears in the site footer — leave the email blank to hide it.

Clicking that button opens a popup form (name, email, preferred payment method — BTC/ETH/USDT/other crypto, number of days they want the ad to run, and an optional message) instead of just opening an email client. The advertiser can also optionally attach their actual ad creative right there — an image or video (upload or URL) or a custom HTML/JS code snippet — the same three types available in `/admin/ads.php`. Submissions land in the **Advertising Inquiries** table on the same admin page, with a preview of whatever creative was attached (code is always shown as escaped text, never executed, since it comes from an anonymous visitor). Nothing is ever charged automatically; the payment method is just what the advertiser says they'd prefer, and you follow up by email to actually arrange payment and, if you want to run their ad, recreate it manually in `/admin/ads.php`. Mark each inquiry New / Contacted / Closed as you work through it.

## Sharing a story with a cover image and formatting

The Share Your Experience form has a rich-text editor (bold, italic, underline, headings, bullet/numbered lists, quotes, inline code, code blocks, links, images, text color) plus an optional cover image upload. Content is sanitized server-side against a strict allowlist ([backend/sanitize.php](backend/sanitize.php)) before it's stored or published — scripts, event handlers, and anything outside that allowlist are stripped, regardless of what the editor sends.

## Testing everything locally before you deploy

Since the live site is static PHP+MySQL, `npm run dev` alone can't exercise `/backend` or `/admin` — but the project is set up so it can, for local testing only:

1. Install a local MySQL/MariaDB (e.g. via XAMPP) and PHP.
2. Create a `backend/config.local.php` (gitignored, never uploaded) pointing at a local dev database — see the shape in [backend/config.php](backend/config.php)'s override check at the top.
3. Import `database/schema.sql` into that local database.
4. From the project root: `php -S localhost:8090 router.php` (the router makes `/admin/1100` work locally the same way `admin/.htaccess` makes it work on Apache).
5. Run `npm run dev` as usual — `next.config.ts` proxies `/backend`, `/admin`, and `/uploads` to `localhost:8090` automatically whenever `NODE_ENV` isn't `production`, so `http://localhost:3000/admin/1100` and the submit/survey/ads forms all work end-to-end against the local PHP server. None of this proxying exists in the production build — `next build` never defines it.

## Redeploying frontend changes

Any time you edit the Next.js source:

```bash
npm run build
```

Then re-upload the contents of `out/` to `public_html/`, overwriting the old files (leave `backend/` and `admin/` untouched — they don't change with frontend rebuilds).
