# Orange Nelumbo — Full Website Figma Import

This local Figma development plugin generates the complete Orange Nelumbo website as editable Figma layers. It does not make network requests.

## Import from the manifest

1. Open the Figma Desktop app and create or open a Design file.
2. Choose **Plugins → Development → Import plugin from manifest…**.
3. Select `figma-plugin/manifest.json` from this project.
4. Run **Plugins → Development → Orange Nelumbo — Full Website Import**.

The plugin creates one Figma page named **Orange Nelumbo · Full Website**, containing 28 separate top-level frames arranged in a three-column canvas. The two additional frames are the new public demo destinations:

- One import-index frame with the full route map and legacy redirects.
- Public pages: Home, About, Pricing, Free Simulations, Sample Notes, Help, Contact, Privacy, Terms, and 404.
- Account pages: Student Login, Educator Login, Signup, Forgot Password, and Onboarding.
- Learning pages: Learning Home, Visual Notes, Subject, Chapter, Simulations, Simulation Detail, Video Lectures, Bookmarks, Notifications, Profile, Settings, and the Protected Note Reader.

Each route is a separate 1440px-wide top-level frame. Every website section inside it is also a named frame. Cards, rows, forms, FAQ items, navigation, headers, footers, reader content, and simulation visuals are editable layers.

Dynamic routes are created once as reusable templates, such as `/learn/[subject]`, `/simulations/[slug]`, and `/notes/[subject]/[chapter]/[topic]`. Routes retired by the website are listed on the Import Index with their current redirect destinations.

The importer uses Fraunces for marketing pages and DM Sans for learning surfaces when those fonts are available in Figma, with safe fallbacks.

If Figma reports that the manifest ID is already in use, create a new development plugin once in Figma, copy its numeric `id` into `manifest.json`, and import again.
