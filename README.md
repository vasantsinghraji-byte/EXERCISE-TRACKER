# Body Tracker 3.2

Guided exercise cards support horizontal swipes, Previous/Next buttons and arrow keys when the card is focused. Swiping changes the card and pauses timing; it never confirms activity. Unconfirmed time on a card is discarded when navigating away. Previously confirmed cards can be reviewed without duplicate credit. Reset session restarts the current draft after confirmation, preserving saved history. The boxing timer also retains its own Reset control.

The five sections now use a responsive desktop sidebar and mobile bottom navigation, keyboard-accessible tabs, a boxing timer ring, protein target ring and portion preview, quick food selection, labeled progress charts, and a dedicated backup screen. Food entries can be removed from the journal. No external fonts, icon packages or image requests are needed.

A local-first daily movement companion. Serve this folder using any static HTTP server; HTTPS or localhost enables service-worker offline caching. Existing nutrition, check-ins and backups remain available.

## Daily use

- Choose 2, 5 or 10 minutes, adjust readiness if needed, then start.
- Preferences cover focus, experience, floor work, available support, weekly goal and optional browser spoken cues.
- Each guided step includes 15 seconds of setup/rest and a 45-second movement window. Pauses and time spent confirming extend elapsed session time.
- Confirm movements you actually performed. Skipping, watching a timer, and planning rest never count as activity.
- Save and close to resume later. Hiding the app pauses timers; keep it visible during a timed interval.
- Finish early records only previously confirmed movements. The effort/discomfort check-in informs future suggestions.
- The journal supports removing an incorrect session. Export a backup regularly.

## Data and behavior

No account, backend, analytics, notifications or external media are required. Text instructions and optional speech provide guidance; exercise demonstration videos are not bundled.

New records use the local date when the session starts. Existing UTC-dated records are retained as written because the original timezone cannot be recovered. Weekly goals run Monday–Sunday; the older counters show a rolling seven days. Rest markers remain separate from movement. Guided sessions and legacy checkmarks are deduplicated by date for active-day totals.

The app stores preferences, sessions, rest markers and an unfinished-session draft under `habitPreferences`, `habitSessions`, `habitRest` and `habitDraft`. Existing JSON backup export includes these keys. Clearing today's legacy checkmarks does not remove session journal records; remove those individually in Progress.

Recommendations use explicit filters rather than a clinical assessment. Recent hard/discomfort feedback and recent strength activity reduce suggested strength work. Unknown effort/recovery data cannot trigger boxing progression. Movement time is timer-assisted and user-confirmed, not sensor verified. There is no automatic exercise progression based on rewards.

## Verification

Run `node --check app.js`, `node --check habit.js`, and `node --check sw.js`.

With Playwright and its Chromium browser installed, run:

```
node tests/habit.browser.cjs
```

An existing Playwright package path can be passed as the first argument. The script starts a loopback static server, checks the main session lifecycle and regression cases, and saves desktop/mobile screenshots in `tests/`. No real user browser data is used.

Deploy `index.html`, `app.js`, `habit.js`, `habit.css`, `interface.js`, `interface.css`, `sw.js`, `manifest.json` and both icons together. The older ZIP and README.txt describe version 2 and are retained as historical artifacts. The service worker uses a version 3.2 cache and removes only older Body Tracker caches.
