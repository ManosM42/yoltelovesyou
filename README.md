# Yolte: Day One

Lovable Prompt — Yolte Official Website

Build a premium, street-urban artist website for Yolte, a Greek rapper. The site tells his story from day 1 to today and doubles as a community hub for fans.

Visual Identity

Aesthetic: Premium streetwear meets urban nightlife. Think high-end trap label site — luxurious but raw.

Color palette:

Primary: deep purple (#6B2FA0), near-black background (#0D0D0F), darker purple accent (#3D1A5B)

Accent/metallic: chrome/silver gradients (#C0C0C0 to #E8E8E8) for borders, dividers, and title accents

Highlight (sparingly, on CTAs/hover/badges only): neon magenta (#FF2E9F) or gold (#D4AF37)

Typography: Bold, condensed sans-serif for headlines (streetwear/graffiti-adjacent but clean, not cheesy). Clean, readable sans-serif for body text.

Texture/mood: Subtle grain/noise overlay, soft glow effects around key elements, smooth gradients from black to purple. Avoid flat corporate look — go for depth and moodiness (like a concert poster or album cover).

Motion: Subtle micro-animations on scroll (fade/slide-in), hover glow effects on buttons and cards, smooth transitions. Nothing distracting from content.

Site Structure & Features

1. Hero Section

Full-screen hero with Yolte's image/portrait, name in bold chrome/purple gradient text, tagline, and a scroll-down cue

Background: subtle animated gradient or particle/glow effect in purple/black

2. His Story — "Day 1 → Σήμερα" (Interactive Timeline)

Vertical or horizontal scrolling timeline of key milestones (first track, first show, first viral moment, collaborations, achievements)

Each milestone: image/video, date, short description

Smooth scroll-triggered animations as user progresses through the timeline

3. Discography

Grid/wall of releases (album art, title, release date)

Embedded players/links to Spotify, YouTube, Apple Music

Filter by year or type (single/EP/feature)

4. Gallery / Behind the Scenes

Photo and video gallery from studio sessions, backstage, live shows

Masonry or carousel layout

5. Tour / Events

Upcoming shows calendar with dates, cities, venues

RSVP or ticket links

6. Fan Community Hub

Fan wall/feed: fans can post photos, videos, fan art (with moderation)

Comments/reactions on releases and posts

Polls: e.g. vote on next single, merch designs, setlist choices

Top fans / leaderboard: engagement-based recognition with badges

"Ask Yolte" Q&A section: periodic community questions

User accounts: sign up/login, profile with avatar and fan badges

7. Merch Shop (basic structure, expandable later)

Product grid, product detail pages, simple cart flow

8. Newsletter / Notifications

Email signup for new releases and tour announcements

9. Footer

Social links (Instagram, TikTok, Spotify, YouTube), contact/booking info

Technical Requirements

Fully responsive (mobile-first, since most fans will visit via phone)

Fast-loading image/video handling (lazy load galleries)

Authentication system for fan accounts (sign up, log in, profile)

Database-backed content: releases, tour dates, fan posts, comments, polls, votes (structured so it can later connect to Supabase)

Admin-manageable content where possible (timeline entries, releases, tour dates) so the manager can update the site without code changes

Clean component structure, since this will be extended after initial build

Tone of Copy

Confident, authentic, a little raw — not corporate. Greek and English copy can mix naturally where appropriate (Greeklish/urban slang tone where fitting), but keep structure and headings clear.

Please generate the full site with this structure, using the color palette and aesthetic described above as the foundation for all pages.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b34308f7-e43c-47f5-9030-bdba396f45ce).

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
