# SEO Setup — Darwin Geospatial

This document explains every SEO tag added to the site, what it does, and how to maintain it when adding new pages.

---

## Table of Contents

1. [What Was Added](#1-what-was-added)
2. [Tag-by-Tag Explanation](#2-tag-by-tag-explanation)
3. [Files Created](#3-files-created)
4. [How to Add SEO to a New Page](#4-how-to-add-seo-to-a-new-page)
5. [Google Search Console Setup](#5-google-search-console-setup)
6. [Testing & Validation Tools](#6-testing--validation-tools)
7. [Quick Reference Template](#7-quick-reference-template)

---

## 1. What Was Added

SEO meta tags were added to the `<head>` of all 9 HTML pages:

| Page | URL |
|------|-----|
| Home | `https://darwingeospatial.com/` |
| Services | `https://darwingeospatial.com/services.html` |
| Soil SaveR | `https://darwingeospatial.com/projects/soil_saver/` |
| Darwin Maps | `https://darwingeospatial.com/projects/darwin_maps/` |
| Darwin Visor | `https://darwingeospatial.com/projects/darwin_visor/` |
| Crops & Land Use | `https://darwingeospatial.com/projects/darwin_crops_landuse/` |
| GuadarramaSKI | `https://darwingeospatial.com/projects/guadarramaski/` |
| Gabriel Portfolio | `https://darwingeospatial.com/projects/team/gabriel-diaz-ireland-research-engineering-portfolio.html` |
| Mario Portfolio | `https://darwingeospatial.com/projects/team/mario-garcia-peces-engineering-portfolio.html` |

Two new files were also created at the root: `sitemap.xml` and `robots.txt`.

---

## 2. Tag-by-Tag Explanation

### 2.1 `<meta name="description">`

```html
<meta name="description" content="Soil SaveR: the first public, multi-region, multi-modal labeled dataset for soil erosion detection from satellite imagery."/>
```

**What it does:** This is the text Google displays as the **snippet** below your page title in search results. It's the single most important tag for click-through rate.

**Rules:**
- Keep it between **120–160 characters** (Google truncates longer ones)
- Include the main keywords someone would search for
- Make it read like a compelling summary, not a keyword dump
- Each page must have a **unique** description

**What happens without it:** Google auto-generates a snippet from random text on the page — usually ugly and irrelevant.

---

### 2.2 `<meta name="keywords">`

```html
<meta name="keywords" content="soil erosion detection, satellite imagery, RUSLE, Sentinel-2, deep learning, dataset"/>
```

**What it does:** Historically told search engines what the page is about. Google has officially stated they **don't use this for ranking** since 2009, but some other search engines (Bing, Yandex) may still consider it.

**Rules:**
- Optional — included only on key pages (Soil SaveR, homepage)
- Keep to 5–10 relevant terms
- Don't stuff irrelevant keywords

---

### 2.3 `<link rel="canonical">`

```html
<link rel="canonical" href="https://darwingeospatial.com/projects/soil_saver/"/>
```

**What it does:** Tells Google "this is the **official URL** for this page." Prevents duplicate content issues if the same page is accessible via multiple URLs (e.g., with/without `www`, with/without trailing slash, with query parameters).

**Rules:**
- Must be an **absolute URL** (full `https://...`), not relative
- Must point to the page itself (not a different page)
- One per page

**What happens without it:** If Google finds the same content at `darwingeospatial.com/projects/soil_saver/` and `darwingeospatial.com/projects/soil_saver/index.html`, it may split the ranking between both or pick the wrong one.

---

### 2.4 Open Graph Tags (`og:*`)

```html
<meta property="og:type" content="website"/>
<meta property="og:title" content="Soil SaveR — Public Erosion Detection Dataset | Darwin Geospatial"/>
<meta property="og:description" content="The first public, multi-region labeled dataset for soil erosion detection from satellite imagery."/>
<meta property="og:url" content="https://darwingeospatial.com/projects/soil_saver/"/>
<meta property="og:site_name" content="Darwin Geospatial"/>
```

**What they do:** Control how your link looks when shared on **social media** (LinkedIn, Facebook, WhatsApp, Telegram, Slack, etc.). Without these, shared links show a blank or random preview.

| Tag | Purpose |
|-----|---------|
| `og:type` | Type of content. Use `website` for pages, `profile` for people |
| `og:title` | The bold title shown in the link preview card |
| `og:description` | The subtitle/description shown in the link preview card |
| `og:url` | The canonical URL shown in the preview |
| `og:site_name` | The site name shown above the title (e.g., "Darwin Geospatial") |
| `og:image` | *(not yet added)* URL to a preview image (1200x630px recommended). See section 2.6 |

**Rules:**
- `og:title` can be different from `<title>` — optimize for social context
- `og:description` can be different from `meta description` — optimize for social shares
- These tags **do not directly affect Google ranking**, but more social shares = more backlinks = better ranking indirectly

---

### 2.5 Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="Soil SaveR — Public Erosion Detection Dataset"/>
<meta name="twitter:description" content="The first public, multi-region labeled dataset for soil erosion detection from satellite imagery."/>
```

**What they do:** Same as Open Graph but specifically for **Twitter/X**. Twitter reads these first; if absent, falls back to `og:*` tags.

| Tag | Purpose |
|-----|---------|
| `twitter:card` | Layout style: `summary` (small thumbnail) or `summary_large_image` (big image banner) |
| `twitter:title` | Title on the Twitter card |
| `twitter:description` | Description on the Twitter card |

---

### 2.6 `og:image` / `twitter:image` (NOT YET ADDED — Recommended)

These tags control the **preview image** shown when someone shares your link. Without them, social platforms show either nothing or a random image from the page.

```html
<!-- Example — add this when you have a preview image -->
<meta property="og:image" content="https://darwingeospatial.com/projects/soil_saver/assets/og-preview.jpg"/>
<meta name="twitter:image" content="https://darwingeospatial.com/projects/soil_saver/assets/og-preview.jpg"/>
```

**Recommended image specs:**
- Size: **1200 x 630 pixels** (works across all platforms)
- Format: JPG or PNG
- File size: under 1 MB
- Content: A branded screenshot or graphic summarizing the page

**To add these:** Create a preview image for each project, place it in the project's assets folder, and add the two meta tags above.

---

## 3. Files Created

### 3.1 `sitemap.xml`

Located at: `/sitemap.xml` → `https://darwingeospatial.com/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://darwingeospatial.com/</loc>
    <priority>1.0</priority>
  </url>
  <!-- ... more URLs ... -->
</urlset>
```

**What it does:** A machine-readable list of all pages on your site. Google and other search engines read this to discover what pages exist and how important they are.

| Field | Purpose |
|-------|---------|
| `<loc>` | The full URL of the page |
| `<priority>` | A hint (0.0 to 1.0) about how important this page is relative to others. `1.0` = most important. Google uses this as a **suggestion**, not a rule |
| `<lastmod>` | *(optional)* Last modification date in `YYYY-MM-DD` format. Helps Google know when to re-crawl |

**Maintenance rule:** When you add a new page to the site, **add a new `<url>` entry** to `sitemap.xml`. Example:

```xml
<url>
  <loc>https://darwingeospatial.com/projects/new_project/</loc>
  <priority>0.8</priority>
</url>
```

---

### 3.2 `robots.txt`

Located at: `/robots.txt` → `https://darwingeospatial.com/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://darwingeospatial.com/sitemap.xml
```

**What it does:** The first file search engine bots look for when visiting a site. It tells them:
- `User-agent: *` → These rules apply to **all** bots (Google, Bing, etc.)
- `Allow: /` → You're allowed to crawl **everything**
- `Sitemap:` → Here's where to find the sitemap

**When to modify:** Only if you want to **block** certain pages from being indexed. Example:

```
# Block a staging area
Disallow: /staging/
```

In most cases, you'll never need to change `robots.txt`.

---

## 4. How to Add SEO to a New Page

When creating a new HTML page, add this block inside `<head>`, right after `<title>`:

```html
<!-- SEO Meta Tags -->
<meta name="description" content="YOUR DESCRIPTION HERE (120-160 chars)"/>
<link rel="canonical" href="https://darwingeospatial.com/YOUR/PAGE/URL/"/>

<!-- Open Graph / Social -->
<meta property="og:type" content="website"/>
<meta property="og:title" content="YOUR PAGE TITLE — Darwin Geospatial"/>
<meta property="og:description" content="YOUR DESCRIPTION HERE"/>
<meta property="og:url" content="https://darwingeospatial.com/YOUR/PAGE/URL/"/>
<meta property="og:site_name" content="Darwin Geospatial"/>
<!-- <meta property="og:image" content="https://darwingeospatial.com/path/to/preview.jpg"/> -->

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="YOUR PAGE TITLE"/>
<meta name="twitter:description" content="YOUR DESCRIPTION HERE"/>
<!-- <meta name="twitter:image" content="https://darwingeospatial.com/path/to/preview.jpg"/> -->
```

Then add the page to `sitemap.xml`:

```xml
<url>
  <loc>https://darwingeospatial.com/your/page/url/</loc>
  <priority>0.8</priority>
</url>
```

---

## 5. Google Search Console Setup

> **Status: COMPLETED on 2026-03-20**
> - Property added: `https://darwingeospatial.com`
> - Verification method: **DNS record** (auto-verified via domain name provider)
> - Sitemap `sitemap.xml` submitted successfully
> - `lang="en"` set on all pages

### How It Was Set Up

1. Went to [Google Search Console](https://search.google.com/search-console)
2. Clicked **"Add property"** → chose **"URL prefix"** → entered `https://darwingeospatial.com`
3. Ownership was **auto-verified** via DNS record from the domain name provider
4. Went to **"Sitemaps"** → submitted `sitemap.xml` → confirmed success
5. Google will now periodically crawl all 9 pages listed in the sitemap

### Why Search Queries Like "gabriel diaz ireland" Now Work

Google matches search queries against multiple signals on a page:

| Signal | Example |
|--------|---------|
| `<title>` tag | `Gabriel Díaz-Ireland \| Researcher & Engineer Portfolio` |
| `<meta description>` | `Gabriel Díaz-Ireland: researcher and engineer at Darwin Geospatial...` |
| `og:title` | `Gabriel Díaz-Ireland \| Researcher & Engineer` |
| Page body content | Name appears throughout the page |
| URL slug | `gabriel-diaz-ireland-research-engineering-portfolio.html` |
| Sitemap | Told Google the page exists |
| Search Console | Requested indexing directly |

Google normalizes accents and hyphens, so `gabriel diaz ireland` matches `Gabriel Díaz-Ireland`.

### After setup, Search Console lets you:
- See which **search queries** bring people to your site
- See which pages are **indexed** and which have errors
- Request **manual re-indexing** of specific pages (useful after updates)
- Get alerts about crawl errors or mobile usability issues

### Bing Webmaster Tools (Optional — Not Done)

Bing powers DuckDuckGo, Yahoo, and Ecosia (~8% of searches). To set up:
1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
2. Choose **"Import from Google Search Console"** (one-click setup)
3. Done

---

## 6. Testing & Validation Tools

| Tool | URL | What it tests |
|------|-----|---------------|
| Google Rich Results Test | https://search.google.com/test/rich-results | Tests if Google can read your page and structured data |
| Facebook Sharing Debugger | https://developers.facebook.com/tools/debug/ | Tests how your link looks when shared on Facebook/LinkedIn |
| Twitter Card Validator | https://cards-dev.twitter.com/validator | Tests how your link looks when shared on Twitter |
| Metatags.io | https://metatags.io | Preview how your link looks across all platforms at once |
| Google PageSpeed Insights | https://pagespeed.web.dev | Page speed analysis (speed affects ranking) |

### Quick test after deploying:

1. Open `https://darwingeospatial.com/projects/soil_saver/` in an incognito browser
2. Right-click → View Source → search for `<meta name="description"` to confirm tags are there
3. Paste the URL into the Facebook Sharing Debugger to see the social preview
4. In Google Search Console, paste the URL and click "Request Indexing"

---

## 7. Quick Reference Template

Copy-paste this for any new page. Replace all `UPPERCASE` placeholders:

```html
<!-- SEO Meta Tags -->
<meta name="description" content="PAGE_DESCRIPTION_120_TO_160_CHARS"/>
<link rel="canonical" href="https://darwingeospatial.com/PAGE_PATH/"/>

<!-- Open Graph / Social -->
<meta property="og:type" content="website"/>
<meta property="og:title" content="PAGE_TITLE — Darwin Geospatial"/>
<meta property="og:description" content="PAGE_DESCRIPTION"/>
<meta property="og:url" content="https://darwingeospatial.com/PAGE_PATH/"/>
<meta property="og:site_name" content="Darwin Geospatial"/>

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="PAGE_TITLE"/>
<meta name="twitter:description" content="PAGE_DESCRIPTION"/>
```

And add to `sitemap.xml`:

```xml
<url>
  <loc>https://darwingeospatial.com/PAGE_PATH/</loc>
  <priority>0.8</priority>
</url>
```

---

## Summary of Current Priority Assignments

| Priority | Pages |
|----------|-------|
| `1.0` | Homepage |
| `0.9` | Soil SaveR (flagship project) |
| `0.8` | All other projects + Services |
| `0.6` | Team portfolio pages |

Adjust priorities if a project becomes more or less important. Higher priority = stronger hint to Google to crawl more frequently.
