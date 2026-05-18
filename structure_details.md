# Neelveda Storefront: Codebase Architecture & Structural Details

This document provides a comprehensive blueprint of the Neelveda codebase architecture, mapping out the directory tree, individual file responsibilities, search engine crawlers roadmap, and cross-file connection boundaries.

---

## 📂 Directory Tree Overview

Below is the complete physical organization of the Neelveda storefront codebase:

```txt
neelveda5/
│
├── ⚙️ Search Engine Optimization (SEO)
│   ├── robots.txt                   # Crawler access controls (disallows admin panel)
│   └── sitemap.xml                  # Dynamic XML site crawl index with priorities
│
├── 📄 Public Storefront Pages
│   ├── index.html                   # Interactive Home Landing Page (Hero, Bundles, Heritage)
│   ├── product-detail.html          # Dynamic E-commerce Product Page (Galleries, Qty, WhatsApp)
│   ├── ingredients.html             # Detailed Botanical ingredients spotlight
│   ├── benefits.html                # Transformed hair-care benefits & comparison slider
│   ├── story.html                   # Brand origins, Kerala legacy, & Vedic philosophy
│   ├── review.html                  # Elite customer feedback panel (GSAP animated stars filter)
│   ├── checkout.html                # Cart checkout form & Indian shipping calculations
│   ├── faq.html                     # Customer FAQ accordion center (structured for search results)
│   └── blog.html                    # Search-intent rich blog and educational resources
│
├── 🔒 Protected Panels
│   └── admin.html                   # Private Brand Control Panel (securely noindexed)
│
├── ⚖️ Legal & Compliance Pages
│   ├── privacy-policy.html          # Brand privacy commitments
│   ├── shipping-returns.html        # Indian shipping methods & return guidelines
│   └── terms-of-service.html        # Site use terms & conditions
│
├── 🎨 Styling Framework (css/)
│   ├── style.css                    # Main storefront framework (Vedic theme, dark glassmorphism)
│   └── checkout.css                 # Checkout page structural overrides
│
├── ⚡ Storefront Logic (js/)
│   ├── script.js                    # Core interface events, overlays, sliders, and GSAP triggers
│   ├── checkout.js                  # Checkout calculations, validation, and WhatsApp order generator
│   └── alert.js                     # Elite, premium micro-animations alerts
│
├── 🖼️ Media & Brand Assets (images/)
│   ├── logo.png                     # Primary high-res brand crest
│   ├── 100ml-main.jpg               # Standard product presentation render
│   ├── clean-combo-3.png            # 3-Pack Bundle Render
│   ├── clean-combo-5.png            # 5-Pack Bundle Render
│   ├── clean-combo-10.png           # 10-Pack Bundle Render
│   ├── bhringraj.png                # Key Botanical ingredient: Bhringraj
│   ├── amla.png                     # Key Botanical ingredient: Amla (Gooseberry)
│   ├── coconut_oil.png              # Key Botanical ingredient: Virgin Coconut Oil
│   ├── aloevera.png                 # Key Botanical ingredient: Aloe Vera
│   ├── hibiscus.png                 # Key Botanical ingredient: Hibiscus
│   ├── before_hair.png              # Transformative social proof: Before
│   ├── after_hair.png               # Transformative social proof: After
│   └── [mobile-assets, etc.]       # Optimized mobile specific ratios
│
└── 🛠️ Dev Utilities
    ├── cleanup.bat                  # Temp clearing batch utility
    ├── copy_images.bat              # Image asset transfer script
    └── seo_standardization_report.md # Detail optimization report
```

---

## 🗄️ File Catalog & Responsibilities

| File Path | Primary Technology | Technical Role | Integration & Downstream Connections |
| :--- | :---: | :--- | :--- |
| **`index.html`** | HTML5 | Primary landing page, offers display, and brand introduction. | Links to `product-detail.html`, `ingredients.html`, `benefits.html`, `story.html`. Uses `js/script.js`. |
| **`product-detail.html`** | HTML5 | Product detail view, photo gallery controls, package pricing. | Redirects checkout events to `checkout.html`. Integrates with WhatsApp ordering. |
| **`checkout.html`** | HTML5 | Indian shipping inputs and order dispatch configuration. | Loads `css/checkout.css` and `js/checkout.js`. |
| **`ingredients.html`** | HTML5 | Interactive ingredient dictionary. | Links back to home `index.html#order`. Uses GSAP ScrollTriggers. |
| **`benefits.html`** | HTML5 | Hair transformation details & before-after slider. | Handles image compare clip-paths natively. Links to order pathways. |
| **`story.html`** | HTML5 | Neelveda heritage, philosophy, and sourcing. | Enforces brand trust for conversion. |
| **`review.html`** | HTML5 | Interactive verified review portal. | Supports rating score filtering natively via custom datasets. |
| **`faq.html`** | HTML5 | Accordion interface answering common product concerns. | Matches schema `FAQPage` rules for search engine snippets. |
| **`blog.html`** | HTML5 | Content hub containing detailed search-intent hair care articles. | Boosts topical authority and acts as organic traffic driver. |
| **`admin.html`** | HTML5 | Brand control and mock data generator. | **Strictly noindexed** (`robots.txt` + meta). Protected from indexing. |
| **`css/style.css`** | CSS3 | Global custom stylesheet (Vedic deep forest theme, gold highlights). | Declares styling custom tokens (colors, font layers, shadows). |
| **`js/script.js`** | Vanilla JS | Controls mobile navbar overlays, slider animations, and GSAP scroll actions. | Initializes GSAP timeline controllers. |
| **`js/checkout.js`** | Vanilla JS | Handles price calculations, coupon values, validation, and WhatsApp order format strings. | Generates direct links to `api.whatsapp.com/send` containing checkout contents. |

---

## 📜 Link Routing & Case-Sensitivity Policies

To maintain the high SEO standard achieved across this project, developers must strictly adhere to the following routing rules:

1. **Lowercase Casing Enforced**: All physical filenames and directories must remain strictly lowercase (e.g., `ingredients.html`, not `Ingredients.html`).
2. **Absolute Lowercase References**: All navigation and footer link values must be lowercase:
   ```html
   <!-- CORRECT -->
   <a href="story.html">Our Story</a>
   
   <!-- INCORRECT (Will break on case-sensitive servers) -->
   <a href="Story.html">Our Story</a>
   ```
3. **Disallow Admin from Crawling**: Never link to `admin.html` with standard anchor tags. Keep the panel unreachable from the normal storefront links, maintaining the `noindex, nofollow` rules.
