# Cloudflare Deployment Guide

## Overview

**Website:** https://darwingeospatial.com
**Repository:** https://github.com/gabrielireland/darwinlabsweb
**Hosting:** Cloudflare Pages
**DNS:** Cloudflare

---

## Architecture

```
GitHub Repo (gabrielireland/darwinlabsweb)
         │
         ▼ (auto-deploy on push to main)
Cloudflare Pages (darwinweb.pages.dev)
         │
         ▼ (CNAME record)
darwingeospatial.com (via Cloudflare DNS)
```

---

## Cloudflare Pages Configuration

**Project name:** `darwinweb`
**Pages URL:** `darwinweb.pages.dev`

### Build Settings
| Setting | Value |
|---------|-------|
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `/` |
| Root directory | *(empty)* |
| Production branch | `main` |

### How Deploys Work
- Push to `main` branch triggers automatic deployment
- No build step needed (static HTML/CSS/JS)
- Deployments typically complete in under a minute

---

## Cloudflare DNS Configuration

**Domain:** `darwingeospatial.com`
**Registrar:** Cloudflare (expires July 23, 2026)

### Key DNS Records

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | `darwingeospatial.com` | `darwinweb.pages.dev` | Proxied |
| CNAME | `www` | `darwingeospatial.com` | Proxied |

### Email (Google Workspace)
MX records point to Google:
- `aspmx.l.google.com` (priority 1)
- `alt1.aspmx.l.google.com` (priority 5)
- `alt2.aspmx.l.google.com` (priority 5)
- `alt3.aspmx.l.google.com` (priority 10)
- `alt4.aspmx.l.google.com` (priority 10)

---

## How to Deploy Changes

### Standard Workflow
```bash
# Make changes locally
git add .
git commit -m "Your commit message"
git push origin main
```

Cloudflare Pages will automatically detect the push and deploy.

### Verify Deployment
1. Go to Cloudflare dashboard → Workers & Pages → `darwinweb`
2. Check "Deployments" tab for status
3. Visit https://darwingeospatial.com (may need hard refresh: Cmd+Shift+R)

---

## Cloudflare Account Access

**Account:** `Cloudflare.factoid955@passmail.net`
**Dashboard:** https://dash.cloudflare.com

### Navigation
- **DNS Settings:** Domains → darwingeospatial.com → DNS
- **Pages Project:** Workers & Pages → darwinweb
- **Domain Registration:** Domain Registration → darwingeospatial.com

---

## Troubleshooting

### Site not updating after push
1. Check Cloudflare Pages deployment status
2. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
3. Try incognito/private window
4. Check if deployment failed in Pages dashboard

### Deployment failed
1. Check build logs in Cloudflare Pages
2. Ensure no syntax errors in HTML/CSS/JS
3. Verify the repo is accessible

### Custom domain not working
1. Verify CNAME record points to `darwinweb.pages.dev`
2. Check custom domain is added in Pages project settings
3. SSL certificate may take a few minutes to provision

---

## Related Files

- `CNAME` - Contains custom domain for GitHub Pages fallback
- `PENDING.md` - Website restructure proposal
- `index.html` - Main website file

---

## Historical Notes

- **Previous repo:** `irishdevops/darwinlabsweb` (no longer exists)
- **Previous Pages project:** `darwinlabsweb` (deleted)
- **Migrated:** February 3, 2026
- **New repo:** `gabrielireland/darwinlabsweb`
- **New Pages project:** `darwinweb`
