## Why

The recorder app has a rich set of interval exercises but no way to systematically drill each interval from every starting note. The flat layout also keeps all note fingering cards visible at all times, making the page long even when the user only wants to practice. This change adds interval drill sub-exercises, consolidates the 1–4–5 section, and polishes the visual rendering of the staff.

## What Changes

- **Collapsible Notes section**: The top fingering-card section becomes collapsible (closed by default), with state persisted in `localStorage`.
- **Interval drill sections**: Each of the 5 interval exercise cards (Терції, Кварти, Квінти, Сексти, Септими) gains a collapsible `▸ Розxxxовка` section at the bottom containing 8 chains — one per base note До1–До2. Each chain = base note + 3 upward interval steps, with reversal to a downward step when the next note would exceed До3. Playing a chain updates the card's shared staff. All drill sections collapsed by default; state persisted in `localStorage`.
- **1–4–5 consolidation**: Seven separate "1 — 4 — 5 · До/Ре/…" exercise cards are merged into one card (showing the До1 variant as the main example) with a collapsible `▸ По ступенях` drill section listing 8 rows (До1–До2). State persisted in `localStorage`.
- **Staff visual polish**:
  - Active note highlighted with a contrasting stroke border instead of fill color change.
  - Note heads 30% larger (`HEAD_RX` 5 → 6.5, `HEAD_RY` 3.5 → 4.55).
  - Staff line spacing 30% tighter (`STEP` 7 → 5).

## Capabilities

### New Capabilities

- `collapsible-sections`: Collapsible UI sections (Notes, drill panels) with localStorage persistence.
- `interval-drills`: Per-base-note interval drill chains within each exercise card, with shared-staff playback.
- `staff-visual-polish`: Staff rendering improvements — border-only active note, larger noteheads, tighter line spacing.

### Modified Capabilities

*(none — no existing specs to update)*

## Impact

- Single file: `src/recorder.html`
- `EXERCISES` array: 1–4–5 entries consolidated; drill data generated programmatically.
- `buildStaff()`: `STEP`, `HEAD_RX`, `HEAD_RY` constants changed; active-note CSS updated.
- `renderExercises()`: Extended to render collapsible drill rows and wiring.
- New `render()` wrapper: Notes section gets collapse toggle.
- `localStorage` read/write on toggle events.
