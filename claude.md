# CLAUDE.md (Hack the North 2026 Frontend Challenge)

## Project goal
Build a visually polished events web app for Hackathon Global Inc. with:
- Public users can browse public events
- Logged-in users can browse public + private events
- Events sorted by start time
- Each event has a detail view
- Related events are linkable and easy to navigate

Also build a small marketing-style site shell with pages:
Landing (scrolling), About, Team, Events, Sponsors, FAQ.

## Non-negotiable requirements
1) Fetch and display all events
2) Sort by `start_time` ascending
3) Auth gating:
   - Not logged in: show ONLY events where `permission === "public"` (treat missing permission as public)
   - Logged in: show both public + private
4) Related events:
   - In detail view, show links to related events (by id)
   - Users can click through and navigate between related events

## Data source
GraphQL endpoint given

GraphQL query shape (use this exact field set for list):
- sampleEvents {
  id, name, event_type, permission, start_time, end_time, description,
  speakers { name }, public_url, private_url, related_events
}

Optional detail query:
- sampleEvent(id: Int) { ... }

Notes:
- start_time/end_time are Unix timestamp in milliseconds
- permission can be "public" or "private" and may be undefined

## Auth model (Firebase + hardcoded login)
Use Firebase Auth for real login.
Also support the challenge-provided hardcoded credentials.

Hardcoded login:
- Username: hacker
- Password: htn2026

Implementation rule:
- On login submit:
  - If username === "hacker" AND password === "htn2026", set `isAuthed = true` locally (localStorage/session)
  - Else attempt Firebase Auth (treat username as email OR offer a separate email field)
- Logout clears local session and signs out of Firebase.
- Persist login across refresh with localStorage.

Security note:
- Do not block access to private_url in the UI when logged out.
- Only show private_url and private event cards when isAuthed === true.

## Tech stack recommendation (keep it simple)
- React + Vite
- TypeScript preferred
- react-router for routing
- graphql-request for GraphQL calls (lightweight)
- Optional: TanStack Query for caching/loading/error state (nice but not required)
- Tailwind for styling (or plain CSS modules if preferred)

Avoid using any library that effectively solves the whole challenge (no heavy auth UI kits, no full calendar/event platforms).

## Pages and routes
Route map:
- /            Landing (scrolling sections with constellation spine)
- /about       About
- /team        Team
- /events      Events list (main challenge view)
- /events/:id  Event detail (includes related events)
- /sponsors    Sponsors
- /faq         FAQ
- /login       Login screen

Global layout:
- Minimal top nav with the routes above
- Mobile nav should be usable and not janky
- Footer with basic links

## Events UI requirements
Events list:
- Always sorted by start_time
- Each card shows:
  - name
  - type (workshop/activity/tech_talk)
  - time range (formatted)
  - permission badge (only show "Private" badge when logged in)
- Click card -> /events/:id
- Search input (nice-to-have, client-side)
- Filter chips for event_type (nice-to-have)

Event detail:
- name, type, time range, speakers, description
- Link section:
  - If logged out: show only public_url if present
  - If logged in: show private_url + public_url if present
- Related events:
  - Render list of related event cards/links
  - If related event is private and user not authed, hide it (or show disabled with a lock icon)

Empty/error states:
- Loading skeleton or spinner
- Network error message with retry
- “No events found” state for search/filter

## Constellation theme and design rules
High-level vibe:
- Black and white base, with 1–2 subtle accent tones (NO purple, NO purple gradients)
- Constellation / star-map feel
- “Tree branch” navigation spine on Landing, connecting sections as you scroll

Design constraints:
- Background: near-black, not pure #000 everywhere (reduce eye strain)
- Text: off-white, not pure white everywhere
- Accent tones allowed: cool gray, muted cyan/teal, muted amber, muted green
- Avoid:
  - purple anything
  - neon gradients
  - over-glow everywhere
  - cluttered particle effects that hurt performance

Constellation implementation ideas (pick one):
1) SVG overlay: static star points + connecting lines, responsive scaling
2) Canvas starfield: subtle, low density, no heavy animation
3) CSS: background dots + a few SVG “branch” lines per section

Landing page structure:
- Hero section with title + short subtitle + CTA button to /events
- Scroll sections: About, Team, Sponsors, FAQ previews
- A “constellation spine” down the page connecting section anchors

Accessibility:
- Maintain contrast ratios
- Keyboard focus visible
- No motion-reliant UI; if animating, respect prefers-reduced-motion

## Folder structure (target)
src/
  api/
    gqlClient.ts
    queries.ts
    events.ts
  auth/
    AuthContext.tsx
    useAuth.ts
  components/
    layout/
      AppShell.tsx
      Navbar.tsx
      Footer.tsx
    events/
      EventCard.tsx
      EventList.tsx
      EventDetail.tsx
      RelatedEvents.tsx
      Filters.tsx
    ui/
      Button.tsx
      Badge.tsx
      Input.tsx
  pages/
    Landing.tsx
    About.tsx
    Team.tsx
    Sponsors.tsx
    FAQ.tsx
    Events.tsx
    EventPage.tsx
    Login.tsx
  styles/
    globals.css
    constellation.css (or svg helpers)
  utils/
    datetime.ts
    classNames.ts
  main.tsx
  router.tsx

## Firebase setup
- Put firebase config in .env (Vite format: VITE_FIREBASE_*)
- Provide a small README snippet describing how to add env vars
- Auth methods: Email/Password is enough
- Keep rules simple, this is frontend-only

## Code quality rules
- Prefer small, readable components over giant files
- No magic numbers for spacing/tokens, define a small set of design tokens
- Centralize date formatting in utils/datetime.ts
- Centralize filtering/sorting logic in one place (Events page or a hook)
- Add brief comments where logic is non-obvious

## Acceptance checklist (what “done” means)
- App loads and fetches events successfully
- Public users see only public events
- Login works with:
  - hardcoded hacker/htn2026
  - Firebase auth (email/password)
- Logged-in users see private events and private_url
- Events are sorted by start_time
- Event detail page works and related events are clickable
- App is responsive and accessible
- Constellation theme is consistent and not slow

## Nice-to-have (only if time)
- Search + filter + clear filters
- Persist filters in query params
- Prefetch event detail on hover
- Light instrumentation (basic performance notes in writeup)

## How I want you (Claude) to work in this repo
When implementing:
- Start by scaffolding routing + app shell + events fetching
- Keep UI clean and consistent with the theme rules above
- If you need to make assumptions, write them down in README or as comments
- Do not introduce unnecessary libraries
- Prioritize correctness + clarity over cleverness

If asked to generate code, generate complete files with correct imports and minimal placeholders.
