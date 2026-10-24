# FixMyCity: design

## Product

FixMyCity lets citizens report problems in their city (photo, location, description, time) and lets the responsible authorities resolve them.

## Users

- Citizens (all ages) report problems, mostly from a phone on the spot.
- An administrator approves every citizen post before it is public (hides inappropriate photos or descriptions), then tracks it to resolution.
- Layouts must work at 375 px (primary) and 1440 px.

## Tone

Reliable, clear, civic. Trust matters more than fun: plain language, no jokes, no hype.

## Visuals

- Colors: deep blue primary (`--primary`), orange accent (`--accent`) reserved for the main action ("Report a problem") and attention, cool neutral gray-white background. Tokens live in `src/index.css`. No dark mode.
- Status colors: `--success`, `--warning`, `--info`, `--destructive`, each with a matching `-foreground` for text on top of it, plus muted gray for neutral states.
- Fonts: Poppins (headings, 600/700), Mulish (body). No other fonts.
- Shape: slightly rounded (`--radius` 8 px), thin borders, no shadows except on overlays (dialog, popover, dropdown).
- Images: report photo at 4:3, `object-cover`, lazy-loaded, always with `alt`. Location is shown as an address in lists; a small map appears only on the report detail page.
- Icons: `lucide-react` only.

## Report status

Shown as a badge: color + lucide icon + text label, never color alone.

| Status      | Meaning                       | Color token   |
| ----------- | ----------------------------- | ------------- |
| Pending     | waiting for admin approval    | `muted`       |
| Approved    | public, not yet handled       | `info`        |
| In progress | authorities are working on it | `warning`     |
| Resolved    | fixed                         | `success`     |
| Rejected    | admin refused the post        | `destructive` |

## Stars and ranking

- Star button: lucide `Star` icon + count, outline when not starred, filled `accent` when starred; `aria-pressed` and a label like "Star this report". Min 44 px touch target.
- Visitors see the count but the button asks them to sign in; a citizen's own report shows the count without a button.
- Ranking list: numbered rows (1, 2, 3…), photo, title, address, status badge and star count; the star count is the visual weight of the row, not a bigger card. Top 3 are not styled with medals or trophies.
- Star color is the only place `accent` is used outside the main action.

## Key screens

- Public list: sortable by newest or most starred; report photos in a single column on phones, 2–3 columns on desktop; status badge and address on each item; one orange "Report a problem" button (sticky at the bottom on phones).
- New report form: one column, large touch targets (min 44 px), photo first, then location, then description. Time is automatic.
- Moderation queue (admin): dense table on desktop, stacked rows on phones; approve and reject are the only primary actions per row.
- Every list and data page has loading, empty and error states, in plain, calm language.

## References

None yet. Put screenshots in `docs/ref/` and describe what you like and don't like here.

## Don't

- Gradients without a reason, emoji instead of icons, a "Welcome to…" hero
- Everything in cards with shadows
- Status conveyed by color only
- More than one orange (accent) action per screen (a filled star is not an action)
