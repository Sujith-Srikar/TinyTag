# TinyTags Design System

## Overview

TinyTags is a URL management platform. A warm neutral canvas anchored by a single acid-green accent. UI recedes; links, slugs, and analytics take the stage.

- Single accent for every interactive element. No second brand color.
- Three-font system: PP Neue Montreal for display, Satoshi for body/UI, JetBrains Mono for data.
- Persistent 280px sidebar on desktop. Collapses to top bar + drawer below 1024px.
- Elevation from border and spacing — not shadow. Shadow at modal layer only.
- Strict radius grammar: inputs/buttons `10px`, cards `18px`, modals/drawers `24px`, badges `9999px`.

---

## Tokens

### Color

#### Brand

| Token | Light | Dark | Use |
|---|---|---|---|
| `$color-accent` | `#D0F54A` | `#D0F54A` | Primary buttons, active states, focus rings, key metrics. Never decorative. |
| `$color-on-accent` | `#100303` | `#100303` | Text/icons on `$color-accent`. Always near-black — acid green is too light for white. |
| `$color-accent-muted` | `#e8ffaa` | `rgba(203,255,71,0.12)` | Subtle accent tints, hover backgrounds. |
| `$color-accent-dim` | `rgba(203,255,71,0.15)` | `rgba(203,255,71,0.08)` | Focus rings, disabled accent backgrounds. |

#### Surfaces

| Token | Light | Dark | Use |
|---|---|---|---|
| `$color-canvas` | `#F3F1EC` | `#090909` | Page background |
| `$color-surface` | `#F0EEE9` | `#111111` | Cards, panels, inputs |
| `$color-surface-elevated` | `#EBE8E1` | `#171717` | Dropdowns, hovered rows, disabled inputs |

#### Borders

| Token | Light | Dark | Use |
|---|---|---|---|
| `$color-border-subtle` | `rgba(20,20,18,0.06)` | `rgba(255,255,255,0.06)` | Dividers, ghost borders |
| `$color-border` | `rgba(20,20,18,0.10)` | `rgba(255,255,255,0.10)` | Card borders, input borders at rest |
| `$color-border-strong` | `rgba(20,20,18,0.18)` | `rgba(255,255,255,0.18)` | Focused inputs, active rows |
| `$color-border-focus` | `$color-accent` | `$color-accent` | Focus outlines only |

#### Text

| Token | Light | Dark | Use |
|---|---|---|---|
| `$color-text-primary` | `#141412` | `#F5F5F0` | Headlines, labels, body |
| `$color-text-secondary` | `#68655F` | `#B3B3AC` | Descriptions, timestamps, help text |
| `$color-text-muted` | `#8C8882` | `#777770` | Placeholders, disabled labels, fine print |
| `$color-text-inverse` | `#F5F5F0` | `#141412` | Text on dark/light surfaces (badges, danger buttons) |

#### Semantic

| Token | Light | Dark | Use |
|---|---|---|---|
| `$color-success` | `#22C55E` | `#4ADE80` | Positive trends, active badges |
| `$color-warning` | `#F59E0B` | `#FBBF24` | Caution states, expiring items |
| `$color-danger` | `#EF4444` | `#F87171` | Destructive actions and errors only |

**Rules:**
- `$color-accent` on `$color-on-accent` passes WCAG AA at all sizes.
- All `$color-text-primary` / `$color-text-secondary` pairs meet 4.5:1 on their respective surfaces.
- Semantic colors meet 3:1 minimum.
- `$color-text-muted` is for non-critical UI only — never body copy or labels.
- Every color-coded state (success, danger, warning) is paired with an icon or text label — never color alone.

---

### Typography

#### Font Families

| Token | Stack | Use |
|---|---|---|
| `$font-display` | `'PP Neue Montreal', system-ui, sans-serif` | All headlines ≥ 20px |
| `$font-body` | `'Satoshi', system-ui, sans-serif` | Body copy, labels, buttons, inputs |
| `$font-mono` | `'JetBrains Mono', ui-monospace, monospace` | URLs, slugs, IDs, analytics figures |

#### Type Scale

| Token | Family | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|---|
| `$type-display-xl` | Display | 56px | 700 | 1.05 | -0.03em | Landing hero |
| `$type-display-lg` | Display | 48px | 700 | 1.05 | -0.03em | Section hero |
| `$type-display-md` | Display | 40px | 600 | 1.10 | -0.02em | Page titles, modal headlines |
| `$type-heading-xl` | Display | 32px | 600 | 1.15 | -0.02em | Card group headers |
| `$type-heading-lg` | Display | 24px | 600 | 1.20 | -0.02em | Card titles, sidebar section labels |
| `$type-heading-md` | Display | 20px | 600 | 1.25 | -0.01em | Sub-section heads |
| `$type-body-lg` | Body | 18px | 400 | 1.60 | 0 | Lead paragraphs, onboarding copy |
| `$type-body` | Body | 16px | 400 | 1.60 | 0 | Default body copy |
| `$type-body-sm` | Body | 14px | 400 | 1.50 | 0 | Help text, secondary descriptions |
| `$type-label` | Body | 14px | 500 | 1.00 | 0 | Input labels, button text, nav items |
| `$type-caption` | Body | 12px | 400 | 1.40 | 0.01em | Timestamps, table headers, fine print |
| `$type-mono-lg` | Mono | 24px | 500 | 1.20 | -0.01em | Large stat numbers |
| `$type-mono` | Mono | 14px | 400 | 1.50 | -0.01em | URLs, slugs, click counts, IDs |

**Rules:**
- `$font-mono` is mandatory for every URL, slug, numeric stat, and ID.
- `$font-display` only at ≥ 20px. Below that, `$font-body` takes over.
- Max reading width: `70ch` on all body text containers.
- Center-align display sizes only. Never center body paragraphs.
- Weight ladder: `400 / 500 / 600 / 700`. No other weights.
- `font-variant-numeric: tabular-nums` on all mono data in tables and dashboards.

---

### Spacing

Base unit: `4px`. All values are multiples of this unit.

| Token | Value | Use |
|---|---|---|
| `$space-1` | 4px | Icon-to-label gap |
| `$space-2` | 8px | Compact internal spacing |
| `$space-3` | 12px | Badge padding, tight gaps |
| `$space-4` | 16px | Default unit, input padding |
| `$space-6` | 24px | Card padding, form field gaps |
| `$space-8` | 32px | Section spacing |
| `$space-12` | 48px | Large block spacing |
| `$space-16` | 64px | Page vertical rhythm |
| `$space-24` | 96px | Hero whitespace |
| `$space-32` | 128px | Large marketing sections |

No values outside this scale. Never invent arbitrary pixel values.

---

### Border Radius

| Token | Value | Use |
|---|---|---|
| `$radius-xs` | 6px | Tags, small inline chips |
| `$radius-sm` | 10px | All buttons, all inputs |
| `$radius-md` | 14px | Dropdowns, tooltips |
| `$radius-lg` | 18px | All cards, panels |
| `$radius-xl` | 24px | Modals, drawers, bottom sheets |
| `$radius-full` | 9999px | Badges, status chips, toggles |

Never mix grammars. Buttons and inputs are always `$radius-sm`. Cards are always `$radius-lg`.

---

### Elevation

| Level | Token | CSS | Use |
|---|---|---|---|
| 0 | `$elevation-flat` | none | Page canvas, sidebar, nav bars |
| 1 | `$elevation-subtle` | `1px solid $color-border` | Cards, inputs at rest, table rows |
| 2 | `$elevation-raised` | `1px solid $color-border-strong` + shadow token | Focused inputs, hovered cards, dropdowns |
| 3 | `$elevation-modal` | `var(--shadow-modal)` | Modals, bottom sheets, toasts |

Shadow appears at Level 3 only. Levels 0–2 use border contrast and spacing for depth.

---

### Blur

| Token | Value | Use |
|---|---|---|
| `$blur-subtle` | `blur(8px)` | Modal backdrop, nav drawer backdrop |
| `$blur-medium` | `blur(12px)` | Dropdown backdrop over complex content |

Applied as `backdrop-filter` on the backdrop element, not the surface itself. Always paired with a dimming overlay.

---

### Motion

| Token | Value | Use |
|---|---|---|
| `$motion-fast` | 120ms | Button press, badge appear, tooltip |
| `$motion-normal` | 180ms | Card hover, dropdown open, input focus |
| `$motion-slow` | 280ms | Modal enter/exit, drawer slide, toast enter |
| `$ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` | All entering elements |
| `$ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | All exiting elements |

**Rules:**
- Animate only: `opacity`, `transform` (translate, scale), `color`, `background-color`, `border-color`.
- Never animate: `width`, `height`, `top`, `left`, `right`, `bottom`, `padding`, `margin`.
- Exit animations run at 70% of enter duration.
- Respect `prefers-reduced-motion: reduce` — disable all transforms and opacity transitions.

---

## Layout

### Container Widths

| Context | Max Width | Side Padding |
|---|---|---|
| Mobile | 100% | `$space-4` |
| Tablet | 720px | `$space-6` |
| Desktop | 1280px | `$space-8` |
| Large Desktop | 1440px | `$space-12` |
| Ultra Wide | 1600px | auto — content locked, whitespace grows |

### Breakpoints

| Token | Value | Key Change |
|---|---|---|
| `$bp-sm` | 640px | Single-column stack |
| `$bp-md` | 768px | Tablet layouts, bottom sheet replaces modal |
| `$bp-lg` | 1024px | Sidebar appears, desktop grid activates |
| `$bp-xl` | 1280px | Full dashboard layout |
| `$bp-2xl` | 1440px | Content lock at max-width |
| `$bp-3xl` | 1600px | Ultra-wide content lock |

### Grid

| Breakpoint | Columns | Gutter |
|---|---|---|
| Mobile (< 640px) | 4 | `$space-4` |
| Tablet (640–1023px) | 8 | `$space-4` |
| Desktop (≥ 1024px) | 12 | `$space-6` |

---

## Components

### Shared States

All interactive components share these states. Component specs reference this section instead of restating each state.

| State | Treatment |
|---|---|
| **Active/Press** | `transform: scale(0.97)`, transition `$motion-fast` |
| **Focus** | `outline: 2px solid $color-accent`, `outline-offset: 2px` |
| **Disabled** | `opacity: 0.4`, `pointer-events: none` |

---

### Navigation

**`$component-sidebar`** — Persistent left sidebar, desktop only (≥ 1024px). Width 280px. Background `$color-canvas`. Right border `1px solid $color-border`. Structure: logo → nav items → flexible space → user profile.

**`$component-sidebar-item`** — Default: `$color-text-secondary`, `$type-label`, `$radius-sm`. Active: `$color-accent` background, `$color-on-accent` text. Icon 20px, `$space-2` gap.

**`$component-top-bar`** — Replaces sidebar on mobile/tablet (< 1024px). Height 56px. Background `$color-canvas`. Bottom border `1px solid $color-border`.

**`$component-nav-drawer`** — Mobile/tablet. Slides from left. Width 280px, full height. Background `$color-surface`. `$radius-xl` right edge only. Backdrop: `var(--overlay-drawer)` + `$blur-subtle`. Motion: `$motion-slow` / `$ease-enter`.

---

### Buttons

All buttons: `$type-label`, `$radius-sm`, height 44px. Follow [Shared States](#shared-states).

| Variant | Background | Text | Border | Padding |
|---|---|---|---|---|
| Primary | `$color-accent` | `$color-on-accent` | none | 0 20px |
| Secondary | `$color-surface` | `$color-text-primary` | `1px solid $color-border` | 0 20px |
| Ghost | transparent | `$color-text-secondary` | none | 0 `$space-4` |
| Danger | `$color-danger` | `$color-text-inverse` | none | 0 20px |

**Danger button** — Destructive actions only (delete, revoke, permanent removal). Never for cancel or navigation. Focus: `$color-danger` ring.

**Icon button** — 36×36px (default) or 44×44px (touch). Background transparent or `$color-surface`. Icon 18px, `$color-text-secondary`. Must carry `aria-label`.

---

### Inputs & Forms

**`$component-input`** — Background `$color-surface`, text `$color-text-primary`, `$type-body`, `1px solid $color-border`, `$radius-sm`, height 48px, padding 0 `$space-4`.
- Focus: border `$color-border-strong`, `box-shadow: 0 0 0 3px $color-accent-dim`, transition `$motion-normal`.
- Error: border `$color-danger`, ring `var(--danger-ring)`.
- Disabled: background `$color-surface-elevated`, `opacity: 0.6`, `cursor: not-allowed`.
- Label: always above input in `$type-label` / `$color-text-primary`. Placeholder is hint text only.
- Error message: below input in `$type-body-sm` / `$color-danger`. Uses `role="alert"`.

**`$component-input-slug`** — Variant. Left: domain prefix in `$font-mono` / `$color-text-muted`, right border `$color-border`. Right: editable slug in `$font-mono` / `$color-text-primary`.

**`$component-dropdown`** — Background `$color-surface`, `$elevation-raised`, `$radius-md`, `$space-2` vertical padding. Opens below trigger. Each option: height 36px, padding 0 `$space-4`, `$type-body-sm` / `$color-text-primary`. Hover: `$color-surface-elevated`. Selected: `$color-accent` text.

**`$component-textarea`** — Same border, radius, font as `$component-input`. Min-height 120px. `resize: none`.

**Form spacing:** label → field `$space-2` · field → field `$space-6` · section → section `$space-12`. Max width 720px.

---

### Cards & Containers

**`$component-card`** — Background `$color-surface`, `$elevation-subtle`, `$radius-lg`, padding `$space-6`. Hover: transitions to `$elevation-raised`.

**`$component-stat-card`** — Variant. Top-to-bottom: metric label (`$type-caption` / `$color-text-muted`) → value (`$type-mono-lg` / `$color-text-primary`) → trend arrow + delta (`$type-body-sm`) in `$color-success` or `$color-danger`.

**`$component-link-row`** — Table row. Height 64px. Bottom border `1px solid $color-border`. Layout: favicon → URL (`$type-mono` / `$color-text-primary`, truncated) → slug (`$type-mono` / `$color-accent`) → clicks (`$type-mono` / `$color-text-secondary`) → action (`$component-button-icon`). Hover: `$color-surface-elevated`.

**`$component-badge`** — `$type-caption`, `$radius-full`, padding 3px 8px. Max 2 words.
- Accent: `$color-accent` bg, `$color-on-accent` text.
- Success: `$color-success` bg, `$color-text-inverse` text.
- Danger: `$color-danger` bg, `$color-text-inverse` text.
- Muted: `$color-surface-elevated` bg, `$color-text-secondary` text.

**`$component-empty-state`** — Centered column. Icon 32px / `$color-text-muted` → headline `$type-heading-md` / `$color-text-primary` → description `$type-body` / `$color-text-secondary` (max 2 lines, 48ch) → primary button. Padding `$space-16`.

---

### Overlays

**`$component-modal`** — Centered. Max-width 560px. `$radius-xl`. Background `$color-canvas`. `$elevation-modal`. Backdrop: `var(--overlay-modal)` + `$blur-subtle`. Header: title `$type-heading-lg` + close button. Body/footer: `$space-6` padding. Enters: `scale(0.96) → 1` + `opacity: 0 → 1` at `$motion-slow`.

**`$component-bottom-sheet`** — Mobile only (< 768px). Replaces modal. Full width, bottom-anchored, `$radius-xl` top corners. Background `$color-surface`. Drag handle: 4×32px, `$color-border`, `$radius-full`. Enters: `translateY(100%) → 0`.

**`$component-toast`** — Bottom-right (desktop), bottom-center (mobile). Max 320px. Background `$color-surface`. `$elevation-modal`. `$radius-lg`. Left accent bar: 3px, colored by type. Auto-dismiss 4000ms. Stacks with `$space-2` gap.
- Success: `$color-success` bar, checkmark icon.
- Danger: `$color-danger` bar, x-circle icon.
- Warning: `$color-warning` bar, alert-triangle icon.
- Info: `$color-accent` bar, info icon.

**`$component-skeleton`** — Shown at ≥ 300ms. Matches content dimensions. Background `$color-surface-elevated`, shimmer sweep 1.2s. Nothing before 300ms. Never spinners.

---

### Data Display

**`$component-chart`** — Primary: `$color-accent`. Secondary: `$color-text-muted`. No gradient fills, no decorative shadows. Grid: `1px dashed $color-border`. Axis labels: `$type-caption` / `$color-text-muted`. Data values: `$type-mono`. Min 44px tap targets.

**`$component-data-table`** — Header: `$color-surface-elevated`, `$type-caption` / `$color-text-muted`, uppercase, `letter-spacing: 0.05em`, height 40px. Sortable chevron: `$color-text-muted` → `$color-accent` when active. Body rows: follow `$component-link-row`.

**`$component-footer`** — Background `$color-canvas`. Top border `1px solid $color-border`. Links: `$type-body-sm` / `$color-text-secondary`, line-height 2.0. Headings: `$type-label` / `$color-text-primary`. Legal: `$type-caption` / `$color-text-muted`. Padding `$space-16`.

---

## Responsive Behavior

| Element | Desktop ≥ 1024px | Tablet 640–1023px | Mobile < 640px |
|---|---|---|---|
| Navigation | Sidebar 280px | Top bar + drawer | Top bar + drawer |
| Stat cards | 4-column | 2-column | 1-column |
| Link table | All columns | Secondary hidden | Slug + clicks only |
| Modal | Centered 560px | Centered 90vw | Bottom sheet |
| Settings | 2-column | 1-column | 1-column |
| Toast | Bottom-right, 320px | Bottom-right, 320px | Bottom-center, full |

**Rules:**
- Mobile first. Every component defined at mobile size, extended up.
- Never hide functionality — only change presentation.
- Below 1024px: sidebar disappears. Top bar + drawer only.
- Large screens: content at max-width. Whitespace absorbs extra viewport.

---

## Accessibility

| Rule | Requirement |
|---|---|
| Touch target | Minimum 44 × 44px |
| Body text contrast | WCAG AA — 4.5:1 |
| Large text contrast | WCAG AA — 3:1 (≥ 18px bold or ≥ 24px) |
| Focus ring | `2px solid $color-accent`, `outline-offset: 2px` |
| Keyboard | Full tab order; DOM order matches visual order |
| Reduced motion | `prefers-reduced-motion: reduce` — all transforms/transitions disabled |
| Icon-only buttons | Must carry `aria-label` |
| Form errors | `role="alert"` or `aria-live="polite"` |
| Toast notifications | `aria-live="polite"` (success/info), `aria-live="assertive"` (errors) |

---

## Product Principles

- **Task-first UI.** Interface recedes so links, slugs, and analytics stay primary.
- **One accent, one meaning.** `$color-accent` communicates action, focus, selection, importance. Never decoration.
- **Content leads.** Users notice links, slugs, destinations, and actions before cards, borders, or effects.
- **Motion explains change.** If an animation does not improve understanding, remove it.
- **Mobile is the same product.** Features never disappear; only presentation changes.
- **Predictable interactions.** States reliable, loading intentional, errors understandable.
- **Complexity is a cost.** Clarity is a feature. The best UI is the one users stop noticing.

---

## Known Gaps

- Inline validation patterns (character limit counters, format hints) not yet documented.
- Chart sub-types (area, bar, sparkline) need dedicated specs.
- Toast stacking beyond 3 simultaneous toasts undefined.
- Bottom sheet swipe-to-dismiss needs physics-based spring (`stiffness: 300, damping: 30`).
