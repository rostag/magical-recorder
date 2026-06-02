## ADDED Requirements

### Requirement: Notes section is collapsible
The Notes section (fingering card grid) at the top of the page SHALL be wrapped in a collapsible container with a visible toggle header (`▸ / ▾ Ноти`). The section SHALL be closed by default on first load.

#### Scenario: Notes section closed on first visit
- **WHEN** the user loads the page with no localStorage entry for `recorder_notes_open`
- **THEN** the Notes section content is hidden and the toggle shows `▸ Ноти`

#### Scenario: User opens the Notes section
- **WHEN** the user clicks the `▸ Ноти` toggle
- **THEN** the Notes section content becomes visible and the toggle changes to `▾ Ноти`

#### Scenario: User closes the Notes section
- **WHEN** the Notes section is open and the user clicks the `▾ Ноти` toggle
- **THEN** the Notes section content is hidden and the toggle reverts to `▸ Ноти`

#### Scenario: Notes section state is persisted
- **WHEN** the user toggles the Notes section open or closed
- **THEN** the state is written to `localStorage` under key `recorder_notes_open` as `"true"` or `"false"`

#### Scenario: Notes section restores persisted state on reload
- **WHEN** the user reloads the page and `localStorage` contains `recorder_notes_open`
- **THEN** the Notes section opens or stays closed to match the persisted value

### Requirement: Drill panels are collapsible with persisted state
Each interval exercise card (Терції, Кварти, Квінти, Сексти, Септими) and the 1–4–5 card SHALL have a collapsible drill panel at the bottom of the card. Each panel SHALL be closed by default on first load. State SHALL be persisted per exercise in `localStorage`.

#### Scenario: Drill panel closed on first visit
- **WHEN** the user loads the page with no localStorage entry for a drill panel
- **THEN** the drill panel is hidden and shows `▸ <drill-name>`

#### Scenario: User opens a drill panel
- **WHEN** the user clicks the `▸ <drill-name>` toggle on an exercise card
- **THEN** the drill panel content becomes visible and the toggle shows `▾ <drill-name>`

#### Scenario: Drill panel state persists across reloads
- **WHEN** the user toggles a drill panel and reloads the page
- **THEN** the drill panel restores to the same open/closed state

#### Scenario: localStorage unavailable
- **WHEN** `localStorage` access throws an error (e.g. private browsing)
- **THEN** the app loads silently with all sections at their default states (Notes closed, all drills closed)
