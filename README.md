# Home

A quiet, ad-free home screen for Samsung Tizen TVs, as a
[TizenBrew](https://github.com/reisxd/TizenBrew) app module. Written for
Tizen 5.5 (Chromium 69): no frosted-glass blur, no modern CSS.

- Makes **no network requests**. A content-security rule limits the page to
  loading itself.
- Tiles are coloured wordmarks (no logos or artwork are bundled).
- Favourites row is matched by app name (`FAVS` in `app/index.html`).

## Keys
Arrows move, OK opens, Back exits, **Yellow** lists every installed app with its
real app ID.

## App IDs
`app/apps.js` seeds the list with Samsung app IDs that are NOT verified on your
TV. The launcher also asks the TV for its installed apps at runtime and merges
anything missing. If a tile shows "Could not open ...", press Yellow, read the
real ID, and correct it in `app/apps.js`.

## Install (on the TV)
1. Put this folder in a GitHub repo of your own.
2. TizenBrew -> green button (Module Manager) -> Add GitHub module ->
   `<your-user>/tv-launcher`.
3. Launch **Home**.

Modules are served from jsDelivr, which caches branch content for up to ~12 h.
