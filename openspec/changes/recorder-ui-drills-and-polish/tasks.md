## 1. Staff Visual Polish

- [x] 1.1 Update `buildStaff()` constants: `STEP = 5`, `HEAD_RX = 6.5`, `HEAD_RY = 4.55`
- [x] 1.2 Update `.staff-note-head.active` CSS: remove fill change, add `stroke` with contrasting color and `stroke-width: 2`
- [x] 1.3 Verify stem and label active styles remain (stroke/fill on `.staff-note-stem.active` and `.staff-note-label.active` unchanged)
- [x] 1.4 Open the app in browser and visually confirm staff renders correctly: noteheads fit between lines, active note shows border not fill change

## 2. Collapsible Notes Section

- [x] 2.1 Add CSS for `.collapsible-content` (collapsed: `max-height: 0; overflow: hidden`, open: `max-height: none`) and `.section-toggle` header style
- [x] 2.2 Wrap the 3-octave notes grid in `render()` with a collapsible container; add `▸ / ▾ Ноти` toggle header above it
- [x] 2.3 Wire toggle click: flip open/closed class, update arrow, write `localStorage.setItem('recorder_notes_open', ...)`
- [x] 2.4 On page load, read `recorder_notes_open` from localStorage (default `false`) and set initial open/closed state
- [x] 2.5 Wrap localStorage reads/writes in try/catch to handle unavailable storage silently

## 3. Chain Generation Helper

- [x] 3.1 Add `NOTE_NAMES` array `['До','Ре','Мі','Фа','Соль','Ля','Сі']` and `nameToIdx` lookup object
- [x] 3.2 Implement `noteInRange(name, oct)`: returns `true` only if oct === 1 or oct === 2 or (oct === 3 and name === 'До')
- [x] 3.3 Implement `stepNote(name, oct, delta)`: compute next note by adding `delta` scale steps (handles wrap and octave carry); returns `{name, oct}`
- [x] 3.4 Implement `buildChain(baseName, baseOct, intervalSteps, length=3)`: start from base, take `length` steps; each step tries UP (`+intervalSteps`), falls back to DOWN (`-intervalSteps`) if result is out of range; return array of `{name, oct}` objects (length = `length + 1` including base)

## 4. Interval Drill Panels

- [x] 4.1 Add CSS for `.drill-panel` collapsible container, `.drill-toggle` header, `.drill-row` layout (base-note label + chain text + play button), and `.drill-row.active` highlight
- [x] 4.2 Add `DRILL_INTERVALS` map: `{ 'Терції': 2, 'Кварти': 3, 'Квінти': 4, 'Сексти': 5, 'Септими': 6 }`
- [x] 4.3 Define the 8 base notes array: `[{name:'До',oct:1}, {name:'Ре',oct:1}, ..., {name:'До',oct:2}]`
- [x] 4.4 In `renderExercises()`, after building each interval exercise card, append a drill panel div; generate 8 rows using `buildChain` for the exercise's interval
- [x] 4.5 Each drill row: display chain as `До¹ → Фа¹ → Сі¹ → Мі²` (superscript oct), add ▶ button
- [x] 4.6 Wire drill row ▶ button: stop any current playback, call `playSequence` with the 4-note chain; on play, replace card's staff SVG with `buildStaff(chain)` and highlight the active row; on stop/end, restore original staff SVG and remove row highlight
- [x] 4.7 Wire drill panel toggle: flip open/closed, write `localStorage.setItem('recorder_drill_<name>', ...)`
- [x] 4.8 On page load, restore each drill panel's open/closed state from localStorage (default `false`)

## 5. 1–4–5 Consolidation

- [x] 5.1 Remove the 7 individual "1–4–5" entries from the `EXERCISES` array
- [x] 5.2 Add a single `EXERCISE_145` object: `{ name: '1 — 4 — 5', meta: 'тональності', desc: 'До→Фа→Соль→До. Стабільність→відхід→очікування→повернення.', seq: [{name:'До',oct:1},{name:'Фа',oct:1},{name:'Соль',oct:1},{name:'До',oct:2}] }`
- [x] 5.3 Render the `EXERCISE_145` card after the 5 interval exercise cards (before or after the divider — keep visual grouping consistent)
- [x] 5.4 Implement 1–4–5 chain builder: for each base note, produce [root, root+3, root+4, root+7] using `stepNote`; apply cap/reversal rule at each step
- [x] 5.5 Append a "По ступенях" drill panel to the 1–4–5 card with 8 rows (До1–До2), using the same drill row rendering as interval drills
- [x] 5.6 Wire the "По ступенях" drill panel toggle and localStorage persistence under key `recorder_drill_1-4-5`

## 6. Verification

- [x] 6.1 Open app in browser; confirm Notes section is closed on fresh load (clear localStorage first)
- [x] 6.2 Toggle Notes open/closed; reload and confirm state restores
- [x] 6.3 Open each drill panel; confirm 8 rows appear with correct chain sequences
- [x] 6.4 Play a drill row; confirm staff updates to 4-note chain, correct note highlights with border, staff reverts on stop
- [x] 6.5 Confirm the Кварти chain from Ля1 ends on До3; confirm Сі1 chain ends Мі2→Ля2→Мі2 (reversal)
- [x] 6.6 Confirm the 1–4–5 card shows До1 main sequence; open По ступенях and confirm До2 row shows До2→Фа2→Соль2→До3
- [x] 6.7 Confirm staff noteheads are visibly larger and lines visibly tighter than before
- [x] 6.8 Confirm active note on staff shows border highlight (not color fill change) in both light and dark themes
