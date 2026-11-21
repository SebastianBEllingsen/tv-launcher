// Seed list of apps. The launcher also asks the TV for its installed apps at
// runtime (tizen.application.getAppsInfo) and merges anything missing.
//
// These Samsung app IDs are from memory and NOT verified on your TV. If a tile
// toasts "Could not open ...", press YELLOW in the launcher: it lists every real
// app ID the TV reports, and you can correct the ID here.
window.TV_APPS = [
  { appId: "111299001912",   name: "YouTube" },
  { appId: "3201907018807",  name: "Netflix" },
  { appId: "3201901017640",  name: "Disney+" },
  { appId: "3201910019365",  name: "Prime Video" },
  { appId: "3201807016597",  name: "Apple TV" },
  { appId: "3201606009684",  name: "Spotify" },
  { appId: "3201512006963",  name: "Plex" }
];
