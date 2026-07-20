# Orange Nelumbo — Figma generator

This is a local Figma development plugin. It recreates the JEE dashboard as editable Figma layers and does not use MCP or make network requests.

## Run it

1. Open the **Figma Desktop** app and create or open a Design file.
2. Open **Plugins → Development → Import plugin from manifest…**.
3. Select `manifest.json` from this folder.
4. Run **Plugins → Development → Orange Nelumbo — JEE Dashboard**.

The plugin creates a 1440 × 1360 desktop frame with named groups for the rail, header, hero, stats, continuation card, subjects, and reading lists.

If Figma reports that the manifest ID is already in use, create a new development plugin once in Figma, copy the generated numeric `id` into this `manifest.json`, and import it again.
