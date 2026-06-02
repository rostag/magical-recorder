## Context

The app is a single self-contained HTML file (`src/recorder.html`). All logic, styles, and data live in one file with no build step or external dependencies beyond Google Fonts. The key rendering functions are `render()` (note cards) and `renderExercises()` (exercise cards + staff SVGs). The staff is drawn via `buildStaff(seqNotes)` which uses three constants — `STEP` (line spacing), `HEAD_RX`, `HEAD_RY` (notehead ellipse radii) — and active-note highlighting is done via CSS class toggling.

Existing `EXERCISES` array holds 12 entries: 5 interval exercises + 7 "1–4–5" root variants.

## Goals / Non-Goals

**Goals:**
- Collapsible Notes section (top) with localStorage persistence, closed by default.
- Each interval exercise card gains a collapsible drill panel (closed by default, localStorage persisted) showing 8 base-note chains of 4 notes each.
- Seven 1–4–5 cards consolidated into one card with a drill panel using the same pattern.
- Staff visual: border-only active note; 30% larger noteheads; 30% tighter line spacing.
- No external dependencies added.

**Non-Goals:**
- Responsive/mobile layout changes beyond what falls out naturally.
- Audio engine changes.
- Persistent BPM or loop settings.
- Shareable URLs or export features.

## Decisions

### 1. Chain generation — pure function at render time

Chains are computed programmatically from a `buildChain(baseName, baseOct, intervalSteps)` helper rather than hardcoded in `EXERCISES`. This keeps the data compact and ensures consistency with the cap/reversal rule.

**Cap rule**: only До3 is valid from oct3. Any computed note with oct > 3, or oct === 3 and name !== 'До', is considered out of range.

**Reversal rule**: if the next UP step is out of range, take the same interval DOWNWARD from the current note instead. Applied per-step (each step independently checks UP first, falls back to DOWN). This naturally produces alternating patterns for large intervals near the top of range.

**Interval step counts** (diatonic scale degrees, 0-indexed names array `['До','Ре','Мі','Фа','Соль','Ля','Сі']`):
- Терції: +2 / −2
- Кварти: +3 / −3
- Квінти: +4 / −4
- Сексти: +5 / −5
- Септими: +6 / −6
- 1–4–5: fixed sequence [0, +3, +4, +7(=oct)] — computed as [root, root+fourth, root+fifth, root+octave(up)]

### 2. 1–4–5 drill uses a fixed interval sequence, not a generic interval step

Each 1–4–5 chain is: root → +3 scale steps (fourth) → +1 scale step (fifth) → +3 scale steps (octave root). This matches the existing 1–4–5 exercise semantics exactly. Computed via the same `buildChain`-style approach but with fixed offsets [0, 3, 4, 7].

### 3. Shared staff — replace on drill play, restore on stop

When a drill row's ▶ is clicked, `buildStaff()` is called with the 4-note chain and the result replaces the existing staff SVG node in the card. When playback ends (or stops), the original main-exercise staff is restored. This avoids 40+ extra SVG elements in the DOM at all times.

**Alternative considered**: keep both staffs in DOM and toggle visibility. Rejected — too much hidden DOM weight for a single-file app.

### 4. Collapsible sections — CSS height transition via `max-height`

Toggle collapse by adding/removing a CSS class (`collapsed`) that sets `max-height: 0; overflow: hidden` on the content element. Open state uses `max-height: none` (or a large value). No JS animation library needed.

**localStorage keys**:
- `recorder_notes_open` → `"true"` / `"false"`, default `false`
- `recorder_drill_<exerciseName>` → `"true"` / `"false"`, default `false`

Exercise names used as keys: `Терції`, `Кварти`, `Квінти`, `Сексти`, `Септими`, `1-4-5`.

### 5. Staff constants

| Constant | Old | New | Note |
|----------|-----|-----|------|
| `STEP` | 7 | 5 | 30% tighter (7 × 0.7 ≈ 5) |
| `HEAD_RX` | 5 | 6.5 | 30% larger |
| `HEAD_RY` | 3.5 | 4.55 | 30% larger |

Active note: remove `fill` change from `.staff-note-head.active`; add `stroke` with contrasting color and `stroke-width: 2`. Keep stem/label active color change for readability.

### 6. EXERCISES array restructure

Remove the 7 "1–4–5" entries from `EXERCISES`. Add a separate `EXERCISES_145` constant (or handle inline in `renderExercises`) for the single consolidated 1–4–5 card. The interval exercises stay in `EXERCISES` as-is; the drill panel data is generated at render time.

## Risks / Trade-offs

- **`max-height` animation glitch for tall drill panels**: If 8 drill rows are taller than the `max-height` value used for the open state, content clips. → Use a sufficiently large value (e.g. `2000px`) or `max-height: none` with no CSS transition (just instant toggle), which is acceptable given the app's simple interaction model.
- **Staff swap flicker**: Replacing the SVG node causes a brief repaint. → Acceptable; the swap happens on user click, not during playback.
- **Alternating chains for large intervals**: Сексти/Септими chains from upper base notes oscillate (e.g. До2→Сі2→До2→Сі2). This is musically valid but visually repetitive. → Noted in UI as expected behavior; no mitigation needed.
- **localStorage unavailable**: In private browsing or restricted environments, `localStorage` may throw. → Wrap reads/writes in try/catch; fall back to defaults silently.

## Open Questions

*(none — all decisions resolved in explore phase)*
