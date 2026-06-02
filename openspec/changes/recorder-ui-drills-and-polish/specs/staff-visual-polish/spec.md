## ADDED Requirements

### Requirement: Active note uses border highlight instead of fill change
When a note is active (playing) on the staff, its notehead SHALL NOT change fill color. Instead, the notehead SHALL display a contrasting stroke border. The stem and label MAY retain their existing active color styling.

#### Scenario: Active notehead has border, not fill change
- **WHEN** a note becomes active during sequence playback
- **THEN** the `.staff-note-head.active` element has a visible stroke applied and its fill is unchanged from the inactive state

#### Scenario: Active notehead border is visible on both themes
- **WHEN** the active note is highlighted in light theme or dark theme
- **THEN** the stroke color contrasts clearly with the staff background in both themes

### Requirement: Note heads are 30% larger
The notehead ellipse dimensions SHALL be increased by 30% from their previous values.

#### Scenario: Notehead dimensions updated
- **WHEN** the staff SVG is rendered
- **THEN** note ellipses use `rx ≈ 6.5` and `ry ≈ 4.55` (previously `rx=5`, `ry=3.5`)

### Requirement: Staff line spacing is 30% tighter
The vertical distance between staff lines (the `STEP` constant in `buildStaff`) SHALL be reduced by 30%.

#### Scenario: Staff line spacing updated
- **WHEN** the staff SVG is rendered
- **THEN** lines are spaced using `STEP = 5` pixels per half-space (previously `STEP = 7`)

#### Scenario: Staff remains correctly proportioned
- **WHEN** the staff SVG is rendered with the new STEP and HEAD values
- **THEN** noteheads fit between staff lines without overlapping adjacent lines for notes within the middle register
