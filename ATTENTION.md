# Intentional visits: what is implemented

Body Tracker provides voluntary intent check-ins, an elapsed-time stopwatch, opt-in allowance reminders and weekly reflection. It does not detect app launches, read Screen Time, block Instagram/YouTube/Safari, or provide a native widget. A timer left running includes time away from the app, regardless of what you were doing. You confirm or correct the minutes before they enter reflection.

## Use it now

1. Under Today, choose an app in “A moment before the scroll”.
2. Write your intention and allowance. Reminders are optional.
3. Choose Continue intentionally. Switch to your chosen app yourself.
4. Return to Body Tracker to pause or finish. Reminders appear in Body Tracker when visible; background alarms are not guaranteed.
5. Review the elapsed estimate, correct actual minutes, and save. Choosing a break records a choice, not proof of a completed break.

## Manual iPhone shortcut

In Backup, expand “Open an intent prompt with iPhone Shortcuts” and copy a link. In Shortcuts, create a shortcut with that URL followed by Open URLs. Give it a name such as “Before Instagram”. Run it before your visit. The prompt preselects the app. It will not automatically open the distracting app or start a timer.

Example links on the deployed site:

- https://vasantsinghraji-byte.github.io/EXERCISE-TRACKER/?intent=instagram
- https://vasantsinghraji-byte.github.io/EXERCISE-TRACKER/?intent=youtube
- https://vasantsinghraji-byte.github.io/EXERCISE-TRACKER/?intent=safari

## Optional app-open automation

Apple provides App / Is Opened automation triggers, including switching back to a selected app. A naive automation that always opens Body Tracker can therefore trap you in a loop. An automatic setup needs a persistent cooldown in Shortcuts, separate from browser storage. Conceptually:

```
Read this app's last-prompt timestamp from a local Shortcuts file.
If it is less than your chosen cooldown ago: stop this shortcut.
Otherwise save the current timestamp first, then open the intent URL.
```

This cooldown is not configured by the web app. Start with a manual shortcut. If you build an app-open automation, test its behavior when switching back, locking your phone and using other browser profiles. Avoid a Safari-open trigger whose action reopens Safari. Apple’s setup and available options can vary by iOS version.

Apple reference: https://support.apple.com/en-asia/guide/shortcuts/apde31e9638b/ios

## Storage and interpretation

`intentDraft` stores the pending stopwatch. `intentLogs` stores confirmed minutes and break choices. `intentSettings` stores your last allowance and reminder preference. `weeklyIntentNotes` stores notes by local Monday date. All are included in JSON backups; no records are uploaded by this app. A visit is assigned to the local day on which you save its reflection; minutes are not automatically split across midnight. Daily/weekly totals are reported estimates, not inferred usage. An unfinished visit never contributes to weekly totals.

For accurate device-level usage thresholds and native widgets, a separate native iPhone companion with Apple's Screen Time capabilities would be required.
