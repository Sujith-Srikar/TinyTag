# TinyTags Design System

URL management platform. Warm neutral canvas, single acid-green accent. Interface recedes; links, slugs, and analytics take the stage.

---

## 1. Philosophy

### Principles

- **Task-first.** The interface exists to complete link workflows. Every element that doesn't help is a cost.
- **One accent, one meaning.** Accent communicates action, focus, and selection. It is never decorative.
- **Content leads.** Links, slugs, destinations, and numbers are noticed before cards, borders, or effects.
- **Motion explains change.** Animation exists to clarify state transitions, not to decorate.
- **Mobile is the same product.** Features never disappear — only their presentation changes.
- **Predictable interactions.** Every state behaves consistently. Errors are clear. Loading is intentional.
- **Clarity is a feature.** The best interface is the one users stop noticing.

### Color strategy

Restrained. Tinted neutrals plus one accent used at ≤10% of surface area. Accent is reserved for primary actions, current selection, and state indicators.

### Anti-patterns (avoid)

- Accent color used for decoration, gradients, or background fills beyond primary buttons
- Shadow-based depth on cards or panels (shadow is reserved for overlays only)
- Animated page-load sequences — product loads into a task, not a show
- Custom form controls that break standard browser affordances
- Decorative motion that doesn't convey state

---

## 2. Foundations

### 2.1 Color

#### Brand

| Token | Light | Dark | Use |
|---|---|---|---|
| `--brand-accent` | `#D0F54A` | `#D0F54A` | Primary actions, active states, focus rings. Reserved — never decorative. |
| `--accent-fg` | `#100303` | `#100303` | Text and icons on accent backgrounds. Always near-black — acid green is too light for white text. |
| `--accent-muted` | `#e8ffaa` | `rgba(203,255,71,0.12)` | Subtle accent tints, hover tints. |
| `--accent-dim` | `rgba(203,255,71,0.15)` | `rgba(203,255,71,0.08)` | Focus rings, disabled accent backgrounds. |

**Contrast guarantee:** `--brand-accent` on `--accent-fg` passes WCAG AA at all text sizes.

#### Surfaces

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg-base` | `#F3F1EC` | `#090909` | Page canvas |
| `--bg-surface` | `#F0EEE9` | `#111111` | Cards, panels, inputs |
| `--bg-elevated` | `#EBE8E1` | `#171717` | Dropdowns, hovered rows, disabled inputs |

#### Borders

| Token | Light | Dark | Use |
|---|---|---|---|
| `--border-subtle` | `rgba(20,20,18,0.06)` | `rgba(255,255,255,0.06)` | Dividers, ghost borders |
| `--border-default` | `rgba(20,20,18,0.10)` | `rgba(255,255,255,0.10)` | Card borders, input borders at rest |
| `--border-strong` | `rgba(20,20,18,0.18)` | `rgba(255,255,255,0.18)` | Focused inputs, active rows |
| `--border-focus` | `#cbff47` | `#cbff47` | Focus outlines only — accent reused |

#### Text

| Token | Light | Dark | Use |
|---|---|---|---|
| `--text-primary` | `#141412` | `#F5F5F0` | Headlines, labels, body copy |
| `--text-secondary` | `#68655F` | `#B3B3AC` | Descriptions, timestamps, help text |
| `--text-muted` | `#8C8882` | `#777770` | Placeholders, disabled labels, fine print |
| `--text-inverse` | `#F5F5F0` | `#141412` | Text on dark or colored surfaces |

**Contrast:** `--text-primary` on `--bg-surface` meets 4.5:1 in both modes. `--text-secondary` on `--bg-surface` meets 4.5:1. `--text-muted` is non-critical UI only — avoid for body copy or labels.

#### Semantic

| Token | Light | Dark | Use |
|---|---|---|---|
| `--success` | `#22C55E` | `#4ADE80` | Positive trends, active badges |
| `--success-muted` | `rgba(34,197,94,0.1)` | `rgba(74,222,128,0.1)` | Success backgrounds |
| `--warning` | `#F59E0B` | `#FBBF24` | Caution states, expiring items |
| `--warning-muted` | `rgba(245,158,11,0.1)` | `rgba(251,191,36,0.1)` | Warning backgrounds |
| `--danger` | `#EF4444` | `#F87171` | Destructive actions and errors |
| `--danger-muted` | `rgba(239,68,68,0.1)` | `rgba(248,113,113,0.1)` | Error backgrounds |
| `--danger-ring` | `rgba(239,68,68,0.2)` | `rgba(248,113,113,0.2)` | Error focus rings |

**Rule:** Every color-coded state is paired with an icon or text label. Color alone never carries meaning.

#### Accent-as-foreground text

When accent is used as a text color (e.g., slug in link row, active sort indicator), verify contrast against the actual background. `--brand-accent` (#D0F54A) on `--bg-surface` (#F0EEE9) is low contrast — use `--text-primary` or `--text-secondary` as fallback in those contexts, reserving accent text for large display sizes only.

---

### 2.2 Typography

#### Font families

| Token | Stack | Use |
|---|---|---|
| `--font-display` | `'PP Neue Montreal', system-ui, sans-serif` | Headlines ≥ 20px |
| `--font-body` | `'Satoshi', system-ui, sans-serif` | Body copy, labels, buttons, inputs |
| `--font-mono` | `'JetBrains Mono', ui-monospace, monospace` | URLs, slugs, IDs, analytics figures |

PP Neue Montreal pairs with Satoshi on a geometric-vs-humanist axis — the contrast between them creates hierarchy without visual noise.

#### Type scale

Base size: 16px. Scale ratio: major second (×1.125) for body, golden ratio (×1.618) for display.

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `display-xl` | 56px | 600 | 1.05 | -0.03em | Landing hero |
| `display-lg` | 48px | 600 | 1.05 | -0.03em | Section hero |
| `display-md` | 40px | 600 | 1.10 | -0.02em | Page titles |
| `heading-xl` | 32px | 600 | 1.15 | -0.02em | Card group headers |
| `heading-lg` | 24px | 600 | 1.20 | -0.02em | Card titles, sidebar sections |
| `heading-md` | 20px | 600 | 1.25 | -0.01em | Sub-section heads |
| `body-lg` | 18px | 400 | 1.55 | 0 | Lead paragraphs, onboarding |
| `body` | 16px | 400 | 1.55 | 0 | Default body copy |
| `body-sm` | 14px | 400 | 1.50 | 0 | Help text, secondary descriptions |
| `label` | 14px | 500 | 1.00 | 0 | Input labels, button text, nav items |
| `caption` | 12px | 400 | 1.40 | 0.01em | Timestamps, table headers, fine print |
| `mono-lg` | 24px | 500 | 1.20 | -0.01em | Large stat numbers |
| `mono` | 14px | 400 | 1.50 | -0.01em | URLs, slugs, click counts, IDs |

#### Typographic rules

- `--font-mono` is mandatory for every URL, slug, numeric stat, and ID.
- `--font-display` at ≥ 20px only. Below that, `--font-body` takes over.
- Max reading width: 70ch on all body text containers.
- Weight ladder: 400 / 500 / 600. Reserve 700 for marketing surfaces only.
- `font-variant-numeric: tabular-nums` on all mono data in tables and dashboards.
- `text-wrap: balance` on h1–h3. `text-wrap: pretty` on long prose.

---

### 2.3 Spacing

Base unit: 4px. All values are multiples of this unit.

| Token | Value | Use |
|---|---|---|
| `space-1` | 4px | Icon-to-label gap, tight inline spacing |
| `space-2` | 8px | Compact internal spacing |
| `space-3` | 12px | Badge padding, tight gaps |
| `space-4` | 16px | Default unit, input horizontal padding |
| `space-6` | 24px | Card padding, form field gaps |
| `space-8` | 32px | Section spacing |
| `space-12` | 48px | Large block spacing |
| `space-16` | 64px | Page vertical rhythm |
| `space-24` | 96px | Hero whitespace |
| `space-32` | 128px | Large marketing sections |

**Default:** Use the nearest token. Avoid arbitrary pixel values — if a value doesn't fit the scale, round to the nearest token.

---

### 2.4 Border Radius

| Token | Value | Use |
|---|---|---|
| `radius-xs` | 6px | Small inline chips, tags |
| `radius-sm` | 10px | All buttons, all inputs |
| `radius-md` | 14px | Dropdowns, tooltips |
| `radius-lg` | 18px | All cards, panels |
| `radius-xl` | 24px | Modals, drawers, bottom sheets |
| `radius-full` | 9999px | Badges, status chips, toggles |

**Grammar:** Buttons and inputs always use `radius-sm`. Cards always use `radius-lg`. Modals always use `radius-xl`. Mixing grammars within a component is a bug.

---

### 2.5 Elevation

Depth comes from border contrast and spacing, not shadow. Shadow is reserved for the overlay layer.

| Level | Treatment | Use |
|---|---|---|
| Flat | No border, no shadow | Page canvas, sidebar, nav bars |
| Subtle | 1px solid `--border-default` | Cards, inputs at rest, table rows |
| Raised | 1px solid `--border-strong` | Focused inputs, hovered cards, dropdowns |
| Overlay | Modal shadow + backdrop blur | Modals, bottom sheets, toasts |

**Default:** Levels 0–2 use border contrast. Level 3 uses shadow and backdrop blur.

---

### 2.6 Blur

| Token | Value | Use |
|---|---|---|
| `blur-subtle` | 8px | Modal backdrop, drawer backdrop |
| `blur-medium` | 12px | Dropdown backdrop over complex content |

Applied as `backdrop-filter` on the backdrop element, not the surface itself. Always paired with a dimming overlay.

---

### 2.7 Motion

| Token | Duration | Use |
|---|---|---|
| `motion-fast` | 120ms | Button press, badge appear, tooltip |
| `motion-normal` | 180ms | Card hover, dropdown open, input focus |
| `motion-slow` | 280ms | Modal enter/exit, drawer slide, toast enter |

| Token | Curve | Use |
|---|---|---|
| `ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` | All entering elements |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | All exiting elements |

#### Motion rules

- Animate only: opacity, transform (translate, scale), color, background-color, border-color.
- Avoid animating layout properties (width, height, padding, margin).
- Exit animations run at 70% of enter duration.
- Respect `prefers-reduced-motion: reduce` — disable all transforms and opacity transitions.

---

### 2.8 Shadow and Overlay

| Token | Value | Use |
|---|---|---|
| `shadow-modal` | `0 8px 32px rgba(20,20,18,0.16), 0 2px 8px rgba(20,20,18,0.08)` | Modal surfaces |
| `overlay-modal` | `rgba(20,20,18,0.5)` | Modal backdrop |
| `overlay-drawer` | `rgba(20,20,18,0.4)` | Drawer backdrop |

---

## 3. Semantic Tokens

Semantic tokens map intent to primitives. Components consume semantic tokens, never primitives directly. This allows redesigns without touching component code.

### Foreground

| Token | Maps to | Use |
|---|---|---|
| `foreground` | `--text-primary` | Headlines, labels, body copy |
| `foreground-muted` | `--text-secondary` | Descriptions, timestamps |
| `foreground-subtle` | `--text-muted` | Placeholders, fine print |
| `foreground-inverse` | `--text-inverse` | Text on dark or colored surfaces |

### Surface

| Token | Maps to | Use |
|---|---|---|
| `surface` | `--bg-surface` | Cards, panels, inputs |
| `surface-elevated` | `--bg-elevated` | Dropdowns, hovered rows |
| `surface-base` | `--bg-base` | Page canvas |
| `surface-hover` | `--bg-elevated` | Hovered interactive surface |
| `surface-selected` | `--accent-muted` | Selected items, active states |
| `surface-disabled` | `--bg-elevated` | Disabled inputs and buttons |

### Border

| Token | Maps to | Use |
|---|---|---|
| `border` | `--border-default` | Card borders, input borders |
| `border-subtle` | `--border-subtle` | Dividers, ghost borders |
| `border-strong` | `--border-strong` | Focused inputs, active rows |
| `border-focus` | `--border-focus` | Focus outlines |

### Interactive

| Token | Maps to | Use |
|---|---|---|
| `interactive` | `--brand-accent` | Primary action color |
| `interactive-hover` | `--brand-accent/80` | Hovered primary action |
| `interactive-active` | `--brand-accent/60` | Pressed primary action |
| `interactive-muted` | `--accent-muted` | Subtle interactive tints |

### Status

| Token | Maps to | Use |
|---|---|---|
| `status-success` | `--success` | Positive outcome |
| `status-success-muted` | `--success-muted` | Success background |
| `status-warning` | `--warning` | Caution |
| `status-warning-muted` | `--warning-muted` | Warning background |
| `status-danger` | `--danger` | Error, destructive |
| `status-danger-muted` | `--danger-muted` | Error background |
| `status-danger-ring` | `--danger-ring` | Error focus ring |

---

## 4. Interaction States

All interactive components share these states. Component specs reference this section.

| State | Description |
|---|---|
| **Default** | Resting state. Component is visible and ready for interaction. |
| **Hover** | Pointer is over the component. Subtle visual feedback signals interactivity. |
| **Focused** | Keyboard focus indicator. Visible outline on the component. |
| **Active/Pressed** | User is pressing. Subtle scale-down feedback. |
| **Disabled** | Component is non-interactive. Reduced opacity, pointer events disabled. |
| **Loading** | Async action in progress. Visual indicator replaces or augments content. |
| **Error** | Validation or operation failure. Red border or ring, error message below. |
| **Success** | Operation completed. Brief confirmation, then return to default. |
| **Selected** | Item is currently active or chosen. Accent-tinted background. |

---

## 5. Layout

### Breakpoints

| Token | Value | Key change |
|---|---|---|
| `bp-sm` | 640px | Single-column stack |
| `bp-md` | 768px | Tablet layouts, bottom sheet replaces modal |
| `bp-lg` | 1024px | Sidebar appears, desktop grid activates |
| `bp-xl` | 1280px | Full dashboard layout |
| `bp-2xl` | 1440px | Content lock at max-width |
| `bp-3xl` | 1600px | Ultra-wide content lock |

### Container widths

| Context | Max width | Side padding |
|---|---|---|
| Mobile | 100% | `space-4` (16px) |
| Tablet | 720px | `space-6` (24px) |
| Desktop | 1280px | `space-8` (32px) |
| Large desktop | 1440px | `space-12` (48px) |
| Ultra wide | 1600px | Content locked, whitespace grows |

### Grid

| Breakpoint | Columns | Gutter |
|---|---|---|
| Mobile (< 640px) | 4 | `space-4` |
| Tablet (640–1023px) | 8 | `space-4` |
| Desktop (≥ 1024px) | 12 | `space-6` |

### Responsive behavior

| Element | Desktop ≥ 1024px | Tablet 640–1023px | Mobile < 640px |
|---|---|---|---|
| Navigation | Sidebar 240px | Top bar + drawer | Top bar + drawer |
| Stat cards | 4-column | 2-column | 1-column |
| Link table | All columns | Secondary hidden | Slug + clicks only |
| Modal | Centered 560px | Centered 90vw | Bottom sheet |
| Settings | 2-column | 1-column | 1-column |
| Toast | Bottom-right, 320px | Bottom-right, 320px | Bottom-center, full |

**Rules:**
- Mobile first. Every component defined at mobile size, extended up.
- Avoid hiding functionality — change presentation, not capability.
- Large screens: content at max-width. Extra viewport becomes whitespace.

---

## 6. Patterns

### 6.1 Form Grammar

Every form follows this structure, top to bottom:

```
Label
  ↕ space-2 (8px)
Description (optional)
  ↕ space-1 (4px)
Input
  ↕ space-1 (4px)
Helper text or validation
```

**Between fields:** `space-6` (24px).
**Between sections:** `space-12` (48px).
**Max form width:** 720px.

**Label:** Always above the input. `label` style / `foreground`. Avoid using placeholder text as label.
**Placeholder:** Hint text only, not a substitute for label. `$foreground-subtle`.
**Error message:** Below input, `$body-sm` / `status-danger`. `role="alert"`.
**Disabled state:** `surface-disabled` background, reduced opacity, `cursor: not-allowed`.

### 6.2 Navigation

**Sidebar** — Persistent on desktop (≥ 1024px). 240px wide. `surface-base` background. Right border `1px solid border`. Structure: logo → nav items → flexible space → user profile.

**Sidebar item** — Default: `foreground-muted`, `label` style. Active: `interactive` background, `foreground-inverse` text.

**Top bar** — Replaces sidebar on mobile/tablet (< 1024px). `surface-base` background. Bottom border.

**Nav drawer** — Mobile/tablet only. Slides from left. `surface` background. Right edge `radius-xl`. Backdrop: `overlay-drawer` + `blur-subtle`.

### 6.3 Feedback

**Toast** — Bottom-right (desktop), bottom-center (mobile). Max 320px. `surface` background. `radius-lg`. Left accent bar: 3px, colored by type. Auto-dismiss 4s. Stacks with `space-2` gap.
- Success: `status-success` bar, checkmark icon. `aria-live="polite"`.
- Danger: `status-danger` bar, x-circle icon. `aria-live="assertive"`.
- Warning: `status-warning` bar, alert-triangle icon.
- Info: `interactive` bar, info icon.

**Modal** — Centered. Max-width 560px. `radius-xl`. `surface-base` background. Overlay shadow. Backdrop: `overlay-modal` + `blur-subtle`. Header with title and close button. Body and footer with `space-6` padding.

**Bottom sheet** — Mobile only (< 768px). Replaces modal. Full width, bottom-anchored, `radius-xl` top corners. Drag handle: 4×32px, `border`, `radius-full`.

**Skeleton** — Shown after ≥ 300ms delay. Matches content dimensions. `surface-elevated` background. Avoid spinners in content areas.

### 6.4 Empty States

Centered column. Icon (32px, `foreground-subtle`) → headline (`heading-md`, `foreground`) → description (`body`, `foreground-muted`, max 2 lines, 48ch) → primary button. Generous padding.

Use cases:
- **Empty page:** First-run or no data yet. Explain what goes here and how to get started.
- **Empty search:** "No results for [query]." Offer suggestions or clear filter.
- **No results:** "Nothing matches your filters." Show how to adjust.
- **Offline:** "You're offline." Explain what's unavailable.
- **Error:** "Something went wrong." Offer retry.
- **Unauthorized:** "Sign in to continue." Link to auth.
- **Coming soon:** Brief description of what's planned.

### 6.5 Loading States

- **Inline:** Skeleton that matches content dimensions. Show after ≥ 300ms.
- **Button:** Spinner replaces button text while async action runs. Button remains same size.
- **Page:** Full-page skeleton matching the expected layout.
- **Avoid:** Spinners in the middle of content. Spinners on initial load. Multiple simultaneous loading indicators.

### 6.6 Data Display

**Stat cards** — Top-to-bottom: metric label (`caption` / `foreground-subtle`) → value (`mono-lg` / `foreground`) → trend arrow + delta (`body-sm`) in `status-success` or `status-danger`.

**Link row** — Table row. Favicon → URL (`mono` / `foreground`, truncated) → slug (`mono` / accent — verify contrast) → clicks (`mono` / `foreground-muted`) → actions.

**Data table** — Header: `surface-elevated`, `caption` / `foreground-subtle`, uppercase, `letter-spacing: 0.05em`. Sortable column: chevron `foreground-subtle` → `interactive` when active. Body rows: follow link row pattern.

**Charts** — Primary: `interactive`. Secondary: `foreground-subtle`. No gradient fills. Grid: `1px dashed border`. Axis labels: `caption` / `foreground-subtle`. Data values: `mono`. Min 44px tap targets.

---

## 7. Components

Component specs define purpose, behavior, and hierarchy — not pixel values. Implementation lives in the component library.

### Buttons

**Purpose:** Trigger actions. Primary actions use accent. Secondary and ghost for supporting actions. Danger for destructive, irreversible actions.

**Variants:**
- **Default** — Accent background. Used for the single primary action per view.
- **Outline** — Transparent with border. Secondary actions that don't need visual weight.
- **Secondary** — Subtle background. Supporting actions in a group.
- **Ghost** — No background or border. Tertiary actions, navigation, cancel.
- **Destructive** — Danger-tinted background. Delete, revoke, permanent removal only.
- **Link** — Text styled as a hyperlink. Inline actions within prose.

**Sizes:** Default (44px height), sm (32px), xs (24px), lg (48px). Icon variants: icon (44px), icon-sm (32px), icon-xs (24px), icon-lg (48px).

**Hierarchy:** One primary button per view. Supporting buttons use secondary or ghost. Danger is never used for cancel or navigation.

**Accessibility:** Icon-only buttons must carry `aria-label`. Focus ring: `2px solid border-focus`, `outline-offset: 2px`.

### Inputs

**Purpose:** Accept text input. Single-line for short values, textarea for longer content.

**Behavior:** Focus shows border-strong and accent ring. Error shows danger border and ring. Disabled shows elevated background and reduced opacity.

**Variants:**
- **Default** — Standard text input.
- **Slug** — Split input: domain prefix (mono, muted) | editable slug (mono, primary).
- **Textarea** — Multi-line. `resize: none`. Min-height 120px.

**Accessibility:** Label always visible above input. Error message below with `role="alert"`. Required fields indicated.

### Dropdown

**Purpose:** Select one option from a list. Opens below trigger.

**Behavior:** `radius-md`. `surface` background. Raised elevation. Options: 36px height, `body-sm`. Hover: `surface-elevated`. Selected: accent text or check icon.

**Accessibility:** Keyboard navigation (arrow keys, Enter, Escape). `aria-expanded`, `aria-haspopup`. Selected option announced.

### Badge

**Purpose:** Short status label. Max 2 words.

**Variants:** Accent, success, danger, muted. `radius-full`. `caption` style.

### Card

**Purpose:** Group related content. `surface` background. Subtle border. `radius-lg`. `space-6` padding.

**Hover:** Transitions to raised elevation. Avoid nesting cards.

### Modal

**Purpose:** Focused task that requires user attention. Last resort — prefer inline alternatives when possible.

**Behavior:** Centered overlay. `radius-xl`. Backdrop blur. Escape or close button dismisses. Focus trapped inside.

**Mobile:** Replaced by bottom sheet below 768px.

---

## 8. Icons

### Sizes

| Size | Use |
|---|---|
| 16px | Inline icons in text, table cells, compact UI |
| 18px | Button icons, input adornments |
| 20px | Navigation items, sidebar icons |
| 24px | Standalone icons, empty states, section headers |

### Guidelines

- **Stroke weight:** 1.5px for all sizes. Consistent visual weight.
- **Style:** Outline (stroke) by default. Filled variants reserved for active/selected states only.
- **Spacing:** `space-1` (4px) between icon and adjacent label.
- **Color:** Inherit from parent text color. Active/selected states use accent.
- **Functional vs decorative:** Functional icons have `aria-hidden="true"` when paired with text. Decorative icons are purely visual and also hidden from assistive tech.

### Icon set

Use `lucide-react` — it's already in the project. Avoid mixing icon libraries.

---

## 9. Analytics Guidelines

TinyTags is analytics-heavy. These patterns apply to all data surfaces.

### Number formatting

- **Clicks/stats:** Integer with locale-aware thousand separators (e.g., 12,345).
- **Percentages:** One decimal place (e.g., 4.2%).
- **Trends:** Delta with sign (+12% / -3%). Color by direction, not magnitude.
- **Large numbers:** Abbreviate above 10K (12.3K, 1.2M).

### Trend indicators

- **Positive:** Up arrow + `status-success` text. Green arrow for growth metrics.
- **Negative:** Down arrow + `status-danger` text. Red arrow for decline metrics.
- **Neutral:** No arrow, `foreground-muted` text. Flat or unchanged.
- **Always pair** color with an icon and/or text label. Never color alone.

### Charts

- **Primary series:** Accent color. Single, clear line or fill.
- **Secondary series:** `foreground-subtle`. Dashed line or reduced opacity.
- **Grid:** `1px dashed border`. Subtle — data is primary.
- **Axis labels:** `caption` / `foreground-subtle`.
- **Data points:** `mono` font. Hover reveals exact value.
- **Empty chart:** Show axis skeleton with "No data for this period" message.
- **Avoid:** Gradient fills, decorative shadows, 3D effects, animation on data load.

### Stat cards

Structure: label → value → trend. Label is `caption` / `foreground-subtle`. Value is `mono-lg` / `foreground`. Trend is `body-sm` with directional color.

---

## 10. Accessibility

| Requirement | Standard |
|---|---|
| Touch target | Minimum 44 × 44px |
| Body text contrast | WCAG AA — 4.5:1 |
| Large text contrast | WCAG AA — 3:1 (≥ 18px bold or ≥ 24px) |
| Focus ring | `2px solid border-focus`, `outline-offset: 2px` |
| Keyboard | Full tab order; DOM order matches visual order |
| Reduced motion | `prefers-reduced-motion: reduce` — transforms and transitions disabled |
| Icon-only buttons | Must carry `aria-label` |
| Form errors | `role="alert"` or `aria-live="polite"` |
| Toast notifications | `aria-live="polite"` (success/info), `aria-live="assertive"` (errors) |
| Color alone | Never the sole indicator of state — pair with icon or text |

---

## 11. Known Gaps

- Inline validation patterns (character limit counters, format hints) not yet documented.
- Chart sub-types (area, bar, sparkline) need dedicated specs.
- Toast stacking beyond 3 simultaneous toasts undefined.
- Bottom sheet swipe-to-dismiss needs defined interaction.
- RTL/i18n layout guidance not yet defined.
- Dark mode accent-muted equivalence with light mode not verified for all contexts.
