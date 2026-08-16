# Still Waters Verse

Build a photorealistic Bible verse app called "Still Waters" (or let me suggest a name) using the King James Version (KJV) translation exclusively.

Core Concept: A calm, visually immersive app that displays a Bible verse of the day (or on-demand) layered over a photorealistic, high-resolution nature or landscape photograph — think stillness, light, open skies, water, mountains, forests. The mood should feel reverent, quiet, and grounding rather than flashy or "churchy."

Core Features:

Verse of the Day — Landing screen shows a full-bleed photorealistic background image with a KJV verse elegantly overlaid in a serif typeface, with soft gradient scrims for text legibility.

Verse Categories/Moods — Let users filter by theme: Comfort, Strength, Peace, Guidance, Gratitude, Hope, Faith, Love. Each category maps to a curated pool of KJV verses.

Random Verse Generator — A button to pull a new verse + matching background image.

Favorites — Users can save verses to a personal collection (local storage or Supabase if backend is enabled).

Share as Image — Export the current verse + background as a shareable image (for Instagram/social use), rendered client-side via canvas.

Search — Simple search by keyword, book, or reference (e.g., "Psalm 23").

Daily Reminder (optional) — A gentle prompt/notification setting for a daily verse.

Reading Streak / Journal (optional stretch feature) — Track days engaged, with a minimal, non-gamified visual indicator.

Design Direction:

Photorealistic full-screen imagery — no illustrations, no cartoon icons, no gradients that look "AI-generated stock art."

Serif typography for verse text (something like Playfair Display, Lora, or Cormorant) paired with a clean sans-serif for UI chrome (Inter or similar).

Muted, natural color palette: dawn/dusk light, muted greens, warm neutrals, soft blues.

Generous whitespace, minimal UI chrome, no clutter — let the verse and image breathe.

Subtle animations: soft fade transitions between verses/images, no bouncy or playful motion.

Mobile-first responsive layout.

Data Source Requirements:

Use the King James Version (public domain) text only — no other translations.

Structure verse data as JSON: { book, chapter, verse, text, reference }.

Include a reasonably sized curated dataset (200–500 popular/foundational verses) rather than the entire Bible, unless I specify I want the full KJV text loaded.

Tag each verse with 1–3 relevant categories/moods for filtering.

Images:

Since true photorealistic images can't be AI-generated reliably inside Lovable, use a curated set of high-quality royalty-free photography (e.g., from Unsplash API or a static curated image set) matched thematically to each verse category — landscapes, skies, water, forests, sunrises.

Technical Notes:

Build as a responsive web app (React + Tailwind).

Use Supabase if you want persistent favorites/streaks across devices/logins; otherwise local storage is fine for an MVP.

Keep verse-fetching logic modular so the verse dataset can be swapped or expanded later.

A couple of things worth deciding before you paste this in:

Full KJV vs. curated set — the entire KJV is ~31,000 verses. For a smooth MVP, a curated set (a few hundred key verses) is much more practical; you can always expand later.

Images — true photorealistic AI image generation isn't something Lovable does natively, so the prompt steers it toward real photography (Unsplash-style) rather than generated art, which will look far more "photorealistic" than an AI illustration would anyway.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://still-waters-kjv.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a961c693-66b8-4292-8f54-0bd179ee3337).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
