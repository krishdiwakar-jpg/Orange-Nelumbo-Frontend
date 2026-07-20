# Orange Nelumbo — front-end demo

Orange Nelumbo is a browser-local JEE preparation product demo built with Next.js, React, TypeScript, and Tailwind CSS. It includes marketing pages, dummy authentication, onboarding, learning notes, simulations, practice, mock tests, results, analytics, planner, profile, notifications, settings, and a simulated checkout.

There is no application API, database, payment gateway, email service, or authentication backend. Fonts and the logo are bundled locally. Browser state is stored on the device when possible and falls back to memory for the current visit if browser storage is blocked.

## Quick start

### Requirements

- Node.js 20.9 or newer
- pnpm 11.9 (the repository's package manager)

Enable the matching pnpm version through Corepack:

```powershell
corepack enable
corepack prepare pnpm@11.9.0 --activate
```

Install dependencies and start development:

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Dummy login

Use fake credentials only:

```text
Email:    aarav@orangenelumbo.com
Password: orange2027
```

You can also select **Open the student demo** on `/login`. Links containing `?demo=1` open the Aarav demo automatically.

Never enter a real password. Dummy-account passwords are stored as plain text in browser storage because this is a front-end prototype, not a secure authentication system.

## Available commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the local development server on port 3000. |
| `pnpm lint` | Run ESLint across the project. |
| `pnpm typecheck` | Run TypeScript without emitting files. |
| `pnpm build` | Create an optimized production build. |
| `pnpm start` | Serve the completed production build. Run `pnpm build` first. |

Recommended pre-handoff check:

```powershell
pnpm lint
pnpm typecheck
pnpm build
```

## How to use the demo

### Fastest route

1. Open `/login`.
2. Select **Open the student demo**, or use the dummy credentials above.
3. Explore `/dashboard`, `/learn`, `/planner`, `/practice`, `/mocks`, `/simulations`, `/analytics`, and `/rank-map`.
4. Use **Settings → Reset demo** to restore Aarav's seeded sample state.

### Create a local dummy account

1. Open `/signup`.
2. Enter a made-up name, email, and password of at least eight characters.
3. Accept the front-end-demo notice.
4. Complete the three onboarding steps.
5. The profile and progress remain in this browser when storage is available.

Custom dummy accounts are device-local. Resetting their preview data keeps the dummy identity and onboarding profile while clearing that user's progress, attempts, bookmarks, inbox preferences, and route-local actions.

### Password recovery

`/forgot-password` validates an email and displays a dummy success message. It does not send email or change a password.

### Learning and bookmarks

- Browse subjects at `/learn`.
- Open a subject, chapter, and topic.
- Mark topic progress, bookmark a topic, print a lesson, or open an available simulation.
- Bookmarks and progress are scoped to the current dummy user.

### Practice

- `/practice` shows topic practice, sample mock listings, the All India Mock preview, and a static 12-week analytics sample.
- `/practice/session` runs the browser-local question flow.
- Answers are not sent anywhere.

### Mock tests

1. Open `/mocks` and choose a test that offers a demo paper.
2. Answer, mark, and navigate questions.
3. The attempt is autosaved for the current user when browser storage is available.
4. The countdown uses an absolute end time, so returning from a background tab does not pause the clock.
5. Submit from either desktop or mobile.
6. Review the result and question explanations.

Submitting clears the in-progress attempt but keeps the latest result, so **Reattempt demo** starts a fresh paper.

### Simulations

- `/simulations/vertical-throw` is the live interactive lab.
- Coming-soon simulation pages can save a browser-local notification preference.
- No real notification is scheduled or sent.

### Checkout

The pricing and checkout pages are a UI simulation. Validation and coupon handling run locally. No card, identity, receipt, order, entitlement, or payment information is transmitted or stored. A successful simulated checkout links to the standard Aarav demo; it does not activate a purchased plan.

## Data and persistence

The app uses browser storage for:

- active dummy session and per-user progress;
- local dummy accounts;
- bookmarks and planner checks;
- practice and mock answers;
- the latest mock result;
- settings and sample-notification preferences;
- mock registration and coming-soon action states.

Storage access is wrapped in a safe adapter. If `localStorage` is disabled, restricted, corrupt, or full, the app remains usable with an in-memory fallback for the current visit. That fallback is lost when the page is fully reloaded or closed.

The app also reconciles sign-in and sign-out state between tabs through browser storage events when persistent storage is available.

## Network and deployment model

The source contains no `fetch`, Axios, XMLHttpRequest, WebSocket, API route, server action, remote font, or remote image dependency. Product data is defined in `src/data/platform.ts`.

Although the product logic is front-end-only, this repository currently uses the Next.js server for development, production page delivery, dynamic routes, and image optimization. Therefore:

- `pnpm dev` or `pnpm start` must be running locally;
- a deployed copy needs a Node-compatible Next.js host;
- stopping the server makes route navigation unavailable;
- this is not yet a static-export/PWA bundle for offline file browsing.

No environment variables are required.

## Troubleshooting

### Port 3000 responds slowly or never returns a page

An old Next development process can keep the port and `.next/dev` lock. Stop that exact process, then restart the project.

Find the process on Windows:

```powershell
netstat -ano | Select-String ':3000\s'
```

Use the PID from the `LISTENING` row:

```powershell
Stop-Process -Id <PID> -Force
pnpm dev
```

Do not stop an unrelated PID.

### “Another next dev server is already running”

Use the same port/PID instructions above. The error also reports the blocking PID and project directory.

### A copied `node_modules` folder points to an old project path

`node_modules` is not portable, especially with pnpm's linked store metadata. From this project directory, close running development servers, remove generated dependencies, and reinstall:

```powershell
Remove-Item -Recurse -Force -LiteralPath .\node_modules
Remove-Item -Recurse -Force -LiteralPath .\.next -ErrorAction SilentlyContinue
pnpm install --frozen-lockfile
```

Only run those commands from the Orange Nelumbo repository root.

### Login buttons remain disabled during initial paint

The server-rendered form starts disabled until React hydrates it, normally for only a moment. If it remains disabled:

1. Confirm the local Next server is still responding.
2. Reload once after the server reports `Ready`.
3. Check the browser console for blocked JavaScript or extension errors.
4. Try a normal browser window if an extension is preventing scripts from running.

Browser-storage restrictions alone should no longer block hydration; the app falls back to memory.

### Local state looks stale

- Demo user: use **Settings → Reset demo**.
- Custom dummy user: use **Settings → Reset local sample progress**.
- To test a completely new custom account, sign out and create another made-up email.

## Project structure

```text
src/app/                         Next.js routes and layouts
src/components/account/          Profile, settings, notifications, bookmarks
src/components/layout/           Marketing and authenticated shells
src/components/learning/         Dashboard, catalog, lessons, learning lab
src/components/platform/         Practice, mocks, planner, simulations, analytics
src/components/providers/        Dummy auth and shared browser-local app state
src/components/ui/               Reusable UI primitives
src/data/platform.ts             Seeded curriculum and product data
src/lib/device-storage.ts        Resilient localStorage + memory fallback
src/lib/navigation.ts            Safe post-auth route validation
src/types/platform.ts            Shared domain types
public/                           Local static assets
```

## Prototype limitations

- Authentication guards are client-side navigation helpers, not security boundaries.
- Dummy passwords are not encrypted or hashed.
- Data does not sync across browsers or devices.
- The visual preview currently supports the tested dark theme only.
- Analytics, ranks, dates, testimonials, outcomes, and recommendations are illustrative sample data.
- Notification, registration, checkout, coupon, and recovery flows do not contact external services.
- Projected AIR and percentile are model illustrations, not predictions or guarantees.
- Orange Nelumbo is independent and is not affiliated with NTA, the JEE Apex Board, or the IITs.
