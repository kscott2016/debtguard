# Debt Payoff Guard

A Chrome extension that pauses you on shopping sites you choose, and
silently tracks how much you've saved by walking away.

## Install (unpacked, for personal use)

1. Unzip this folder somewhere permanent (don't delete it after — Chrome
   loads the extension directly from these files).
2. Open Chrome and go to `chrome://extensions`.
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the `debt-guard-extension` folder.
5. Click the puzzle-piece icon in your toolbar and pin **Debt Payoff Guard**
   so it's always one click away.

## Set it up

1. Click the extension icon.
2. Under **Sites to watch**, add the sites you want a reminder on
   (e.g. `amazon.com`, `target.com`) — one at a time, no `https://` needed.
3. Set your **typical amount you'd spend per visit** — this is what gets
   added to your "estimated saved" total each time you click "Leave & save it."
4. Write your **debt payoff reminder** — this is your own words, shown
   alongside a general "pause and think" prompt, alternating at random.

## How it works

- Whenever you land on a page whose domain matches your list, a popup
  overlay appears with your message and two buttons:
  - **Leave & save it** — takes you back, logs the visit as avoided, adds
    your typical spend amount to your savings total.
  - **Continue shopping** — dismisses the popup, logs it, no judgment.
- All of this is tracked locally in Chrome's storage — nothing leaves your
  browser, no accounts, no syncing to a server.
- Click the extension icon any time to see your running totals or reset
  them.

## Notes / limitations

- This checks the domain, not specific pages — it'll trigger on any page
  within a site you've added, including the homepage.
- "Estimated saved" is just `avgSpend × times avoided` — a rough number to
  keep you motivated, not exact accounting.
- If you want it to feel stricter (e.g. require typing to confirm before
  continuing), that's a quick follow-up change — just ask.
