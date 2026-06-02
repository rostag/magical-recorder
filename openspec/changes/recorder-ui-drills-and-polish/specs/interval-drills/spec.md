## ADDED Requirements

### Requirement: Interval exercise cards display drill panels
Each of the 5 interval exercise cards (Терції, Кварти, Квінти, Сексти, Септими) SHALL display a collapsible drill panel at the bottom of the card. The drill panel SHALL be named: Розтерцовка, Розквартовка, Розквінтовка, Розсекстовка, Розсептимовка respectively.

#### Scenario: Drill panel shows 8 rows
- **WHEN** the user opens the drill panel for any interval exercise
- **THEN** 8 rows are displayed, one per base note: До1, Ре1, Мі1, Фа1, Соль1, Ля1, Сі1, До2

### Requirement: Drill chains are computed by upward interval steps with cap reversal
Each drill row SHALL show a 4-note chain: the base note followed by 3 interval steps. Each step SHALL go upward by the exercise's interval (in diatonic scale steps). If an upward step would produce a note beyond До3 or not in the NOTES array, the step SHALL go DOWNWARD by the same interval from the current note instead.

**Interval step sizes:**
- Терції: ±2 scale steps
- Кварти: ±3 scale steps
- Квінти: ±4 scale steps
- Сексти: ±5 scale steps
- Септими: ±6 scale steps

**Cap rule:** notes in oct3 are only valid if the note name is До. All other oct3 notes and any oct > 3 notes are out of range.

#### Scenario: Chain stays within range for small intervals
- **WHEN** the computed chain for a base note with a small interval (e.g. Терції from До1) is generated
- **THEN** all 4 notes are within the range До1–До3 and all go upward

#### Scenario: Chain reverses when cap is hit
- **WHEN** a step in the chain would land above До3
- **THEN** that step goes downward instead, and subsequent steps each independently check up-first

#### Scenario: Кварти from Ля1 reaches До3
- **WHEN** the drill chain for Кварти starting on Ля1 is generated
- **THEN** the chain is: Ля1 → Ре2 → Соль2 → До3

#### Scenario: Кварти from Сі1 reverses on third step
- **WHEN** the drill chain for Кварти starting on Сі1 is generated
- **THEN** the chain is: Сі1 → Мі2 → Ля2 → Мі2 (third step reverses to downward fourth)

### Requirement: Drill rows show note sequence and play button
Each drill row SHALL display the base note label and the full 4-note chain as text (format: `Нота¹ → Нота¹ → Нота² → ...`) and a ▶ play button.

#### Scenario: Drill row displays correct note labels
- **WHEN** the drill panel is open
- **THEN** each row shows the base note name with superscript octave and the arrow-separated chain

#### Scenario: Play button triggers chain playback
- **WHEN** the user clicks ▶ on a drill row
- **THEN** the chain plays sequentially at the card's current BPM setting

### Requirement: Drill playback updates the card's shared staff
When a drill row plays, the card's staff SVG SHALL be replaced with a 4-note staff showing the drill chain. When playback ends or is stopped, the staff SHALL revert to the exercise's original sequence.

#### Scenario: Staff updates on drill play
- **WHEN** the user clicks ▶ on a drill row
- **THEN** the card's staff SVG shows only the 4 notes of that drill chain

#### Scenario: Staff reverts on drill stop
- **WHEN** drill playback ends or the user stops it
- **THEN** the card's staff reverts to showing the full original exercise sequence

#### Scenario: Playing one drill stops another
- **WHEN** a drill row is playing and the user clicks ▶ on a different drill row (in the same or different card)
- **THEN** the first playback stops and the new chain begins

### Requirement: 1–4–5 exercises consolidated into one card with drill panel
The 7 separate "1 — 4 — 5 · До/Ре/…" exercise cards SHALL be replaced by a single "1 — 4 — 5" card. The card's main sequence SHALL show the До1 variant (До1 → Фа1 → Соль1 → До2). The card SHALL have a collapsible drill panel named "По ступенях" showing 8 rows for До1 through До2.

Each 1–4–5 drill row chain is: root → fourth above (root +3) → fifth above (root +4) → octave above (root +7, i.e. same note next octave). If any step exceeds До3, the reversal rule applies.

#### Scenario: 1–4–5 card shows Do1 variant as main exercise
- **WHEN** the exercises section renders
- **THEN** there is exactly one "1 — 4 — 5" card showing До1→Фа1→Соль1→До2 as the main sequence

#### Scenario: По ступенях panel shows 8 rows
- **WHEN** the user opens the "По ступенях" drill panel
- **THEN** 8 rows appear for base notes До1 through До2

#### Scenario: До2 variant reaches До3
- **WHEN** the drill chain for 1–4–5 starting on До2 is generated
- **THEN** the chain is: До2 → Фа2 → Соль2 → До3
