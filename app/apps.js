// Seed list of apps. The launcher also asks the TV for its installed apps at
// runtime (tizen.application.getAppsInfo) and merges anything missing.
//
// IDs below were checked against the TV's own API (it returned each app's name). If a tile
// toasts "Could not open ...", check the ID with:
//   curl http://<tv-ip>:8001/api/v2/applications/<id>   (404 = not installed)
window.TV_APPS = [
  { appId: "111299001912",   name: "YouTube" },
  { appId: "3201907018807",  name: "Netflix" },
  { appId: "3201901017640",  name: "Disney+" },
  { appId: "3201910019365",  name: "Prime Video" },
  { appId: "3201807016597",  name: "Apple TV" },
  { appId: "3201606009684",  name: "Spotify" },
  { appId: "3201512006963",  name: "Plex" },
  { appId: "3202301029760",  name: "Max" },
  // Opens TizenBrew; pick TizenTube there (it is a TizenBrew module, not its own app).
  { appId: "xvvl3S1bvH.TizenBrewStandalone", name: "TizenTube (TizenBrew)" }
];
