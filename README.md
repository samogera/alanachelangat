# Alana Chelangat · official portfolio

The website of **Alana Chelangat**, Kenyan climate justice advocate, author and podcaster: founder of Dunia Endelevu, host of *Climate Gumzo with Alana* and Little Miss Environment Kenya 2025.

**Live site:** https://samogera.github.io/alanachelangat/

## What's inside

| Page | File | What it covers |
| --- | --- | --- |
| Home | `index.html` | Hero, featured media logos, impact, what she does, book, latest media |
| About | `about.html` | Story, photo timeline, Kiswahili names, honours and affiliations |
| Work | `work.html` | Dunia Endelevu, the podcast (Spotify player), tree nursery, YOUTHTOPIA talk |
| Speaking | `speaking.html` | Child Protection keynote, COP28, COP29, youth assembly, talk topics |
| Media | `media.html` | Podcast, TV videos (play in a pop-up), press, guest features, media kit |
| Writing | `writing.html` | *Alana's Magical Adventure at Mazingira Park* and articles |
| Contact | `contact.html` | Booking form (opens the visitor's email app) and all links |

Plain HTML, CSS and JavaScript. No build step and nothing to install.

- `assets/css/style.css`: all styles. Colours and fonts are at the top in `:root`.
- `assets/js/main.js`: mobile menu, video pop-up, media kit bio tabs, contact form.
- `assets/img/`: photos (`.jpg` plus `.webp` copies for speed).
- `assets/logos/`, `assets/icons/`: media logos, social icons, favicon set.
- `assets/docs/Alana-Chelangat-Media-Kit.pdf`: the downloadable media kit.

## Search engines and AI assistants

- Every page has its own title, description, keywords, canonical URL, Open Graph and Twitter card tags (`assets/og-image.jpg` is the share image).
- Structured data (JSON-LD) describes Alana as a `Person`, plus her `PodcastSeries`, `Book`, organisation (`Dunia Endelevu`), press coverage and the TV47 `VideoObject`.
- `sitemap.xml` lists every page with images and video. `robots.txt` welcomes search engines and AI crawlers.
- `llms.txt` and `llms-full.txt` give AI assistants a clean summary and full profile.

After the site is live, submit `https://samogera.github.io/alanachelangat/sitemap.xml` in [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters) to get indexed faster.

## Publishing

The site is served by **GitHub Pages** from the `main` branch (root folder): *Settings → Pages → Deploy from a branch → main / (root)*.

### Using a custom domain later (for example `alanachelangat.com`)
1. Add the domain in *Settings → Pages → Custom domain* (GitHub creates a `CNAME` file).
2. Find and replace `https://samogera.github.io/alanachelangat/` with `https://alanachelangat.com/` in all `.html`, `sitemap.xml`, `robots.txt`, `llms.txt` and `llms-full.txt` files.
3. In `404.html`, change `<base href="/alanachelangat/">` to `<base href="/">`.

## Editing tips

- **Add a video:** copy one of the cards in `media.html`. For YouTube use `data-embed="youtube" data-src="VIDEO_ID"`; for Facebook or Instagram use `data-embed="facebook"` or `data-embed="instagram"` with the full video URL in `data-src`. The video then plays in the pop-up.
- **Contact form:** it opens the visitor's email app with the message ready to send to `alanachelangat@gmail.com`. To receive messages without email apps, create a free form at [Formspree](https://formspree.io) and send the form there instead.
- **Privacy:** Alana is a minor. Keep her school, home location and family phone numbers off the site. All requests go through her parent.
