# Neelveda Storefront: Codebase Architecture & Structural Details

This document provides a comprehensive blueprint of the Neelveda codebase architecture, mapping out the new optimized root-level directory tree, individual folder/file responsibilities, search engine crawlers roadmap, and cross-file connection boundaries.

---

## 📂 Directory Tree Overview

Below is the complete physical organization of the Neelveda storefront codebase:

```txt
neelveda/
│
├── index.html                       # Direct E-Commerce Landing Page (Vedic theme, dynamic features)
├── robots.txt                       # Search crawler directives (disallows secure admin panel)
├── sitemap.xml                      # Complete extensionless search engine crawler roadmap
├── .htaccess                        # Apache 301 SEO redirects for old .html paths
├── structure_details.md             # Developer architecture blueprint (this file)
│
├── 🎨 assets/                       # Global Storefront Static Assets
│   ├── css/
│   │   ├── style.css                # Primary storefront CSS (dark glassmorphism, responsive elements)
│   │   └── checkout.css             # Checkout page overlay layouts
│   ├── js/
│   │   ├── script.js                # Core JS logic (sliders, active navbar, FAQ accordion triggers)
│   │   ├── checkout.js              # E-commerce shipping/coupon engine, WhatsApp dispatcher
│   │   └── alert.js                 # Premium alert modal animation triggers
│   ├── fonts/                       # Custom local brand typography
│   └── images/                      # Premium e-commerce renders & ingredient assets
│
├── 📂 Core Pages (Depth 2 - Root-Level Folders)
│   ├── about/index.html             # Brand heritage, Kerala slow-cook roots, Vedic history
│   ├── ingredients/index.html       # Botanical spotlight dictionary
│   ├── benefits/index.html          # Comparison before-after slider, hair transformation facts
│   ├── reviews/index.html           # Star rating aggregate reviews database panel
│   ├── faq/index.html               # FAQ Q&As mapped to structural search snippets
│   ├── shipping/index.html          # Indian shipping terms, COD and logistics policies
│   ├── privacy-policy/index.html    # Privacy and security guidelines
│   ├── terms/index.html             # Terms of service and usage conditions
│   └── checkout/index.html          # Secured billing, discount coupon calculations
│
├── ✍️ blog/                         # Topical Authority & Organic Search Journal
│   ├── index.html                   # Educational Blog Dashboard
│   ├── bhringraj-benefits/
│   │   └── index.html               # Article: Vasodilation follicular recovery
│   ├── reduce-hair-fall-naturally/
│   │   └── index.html               # Article: Freeing scalp pores and botanical cooling
│   ├── ayurvedic-hair-care-routine/
│   │   └── index.html               # Article: Dinacharya daily and Shiro Abhyanga weekly rituals
│   └── coconut-oil-for-hair-growth/
│       └── index.html               # Article: Molecular lauric acid keratin penetrative shield
│
├── 🛒 products/                     # Secure Product Catalog Layouts
│   └── herbal-oil/index.html        # Detailed presentation page, size selections, whatsapp CTA
│
└── 🔒 admin/                        # Secure Private Brand Control
    └── index.html                   # Mock management and sales operations dashboard (Strictly noindexed)
```

---

## 🗄️ File Catalog & Responsibilities

| Directory Path | Depth | Technical Role | Integration & Downstream Connections |
| :--- | :---: | :--- | :--- |
| **`index.html`** | 1 | Primary landing page, offers display, and brand introduction. | Root landing page. Links to `/about/`, `/ingredients/`, `/benefits/`, etc. Uses `assets/js/script.js`. |
| **`about/`** | 2 | Brand heritage, story, Kerala organic slow-cook history. | Enforces brand trust. Links relative back via `../` to assets. |
| **`ingredients/`** | 2 | Interactive ingredient spotlight dictionary. | Integrates with GSAP ScrollTriggers. Links back relative to root. |
| **`benefits/`** | 2 | Comparison before-after slider, hair biological transformation facts. | Handles active comparison slider clip-paths. |
| **`reviews/`** | 2 | Verified customer rating reviews panel. | Displays mock statistics and aggregates rating score charts. |
| **`faq/`** | 2 | Customer FAQ accordion center. | Mapped to FAQPage JSON-LD schemas inside search snippets. |
| **`shipping/`** | 2 | COD and Indian shipping guidelines. | Legal policies compliance for merchant account approval. |
| **`privacy-policy/`** | 2 | Customer privacy rights. | Standards compliance page. |
| **`terms/`** | 2 | Legal terms of service. | Standards compliance page. |
| **`checkout/`** | 2 | Secular checkout and shipping cost calculator. | Leverages `assets/css/checkout.css` and `assets/js/checkout.js`. |
| **`products/herbal-oil/`** | 3 | Premium single/combo product selector and WhatsApp checkout triggers. | Links up relative via `../../` to assets. Launches custom client triggers. |
| **`blog/`** | 2 | Main journal dashboard, indexing natural remedies articles. | High organic search driver. Links to nested article folders. |
| **`blog/bhringraj-benefits/`** | 3 | Deep article on vasodilation follicular recovery. | Individual reading template with structured Breadcrumbs list schema. |
| **`blog/reduce-hair-fall-naturally/`** | 3 | Deep article on scalp pores and anti-inflammatory cooling. | Individual reading template with structured Breadcrumbs list schema. |
| **`blog/ayurvedic-hair-care-routine/`** | 3 | Deep article on daily Dinacharya & weekly massages. | Individual reading template with structured Breadcrumbs list schema. |
| **`blog/coconut-oil-for-hair-growth/`** | 3 | Deep article on lauric acid and keratin protein affinity. | Individual reading template with structured Breadcrumbs list schema. |
| **`admin/`** | 2 | Private sales and orders simulator dashboard. | **Strictly noindexed** via `robots.txt` disallow `/admin/` and head meta tags. |

---

## 📜 Link Routing & Case-Sensitivity Policies

To maintain the high SEO standard achieved across this project, developers must strictly adhere to the following routing rules:

1. **Lowercase Casing Enforced**: All physical filenames and directories must remain strictly lowercase (e.g., `about/`, not `About/`).
2. **Remove `.html` Suffixes**: Internal anchor links must link directly to the folders with trailing slashes (e.g. `href="about/"` or `href="../blog/"`) rather than referencing `.html` extensions. This maintains clean, extensionless, high-ranking search URLs.
3. **Relative Path Depth Awareness**: When editing nested templates, always adjust references to assets and other pages relative to the file's directory depth:
   *   Depth 1 (Root): `assets/css/...`, `about/`, `blog/`
   *   Depth 2 (Root folders): `../assets/css/...`, `../about/`, `../blog/`
   *   Depth 3 (Subfolders): `../../assets/css/...`, `../../about/`, `../../blog/`
4. **Apache Redirect Rules**: All old `.html` paths are 301 redirected inside `.htaccess` to point to their corresponding root-level trailing slash folders.
5. **Disallow Admin from Crawling**: Maintain the `Disallow: /admin/` rule inside `robots.txt` to keep the private panel isolated from search engines.
