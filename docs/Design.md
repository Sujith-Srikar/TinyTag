# TinyTags Design System

---

## Overview

TinyTags is a URL management platform for developers, creators, and modern businesses. The interface runs on a warm neutral foundation — a warm-off-white canvas in light mode, a near-pure-black in dark mode — anchored by a single acid-green accent that carries every interactive signal and every data point worth noticing. UI recedes; links, slugs, and analytics take the stage.

**Key Characteristics:**
- Full light/dark mode system. Every token has both values. No assumptions shared between modes.
- Single accent (`$color-accent` — `#CBFF47`) for every interactive element. No second brand color.
- Three-font system: Bricolage Grotesque for display, Satoshi for body/UI, JetBrains Mono exclusively for data.
- Persistent 280px sidebar on desktop. Collapses to top bar + drawer below 1024px.
- Elevation from border and spacing — not shadow. Shadow used at modal layer only.
- Strict radius grammar: inputs/buttons `10px`, cards `18px`, modals/drawers `24px`, badges `9999px`.
- Motion: `opacity` and `transform` only. `120–280ms`. Ease-out enter, ease-in exit.

---

## Colors

### Brand

| Name | Token | Value | Use |
|---|---|---|---|
| Acid Green | `$color-accent` | `#CBFF47` | Every primary button, active state, focus ring, key metric. Never decorative. |
| On Accent | `$color-on-accent` | `#141412` | Text/icons rendered on `$color-accent`. Always near-black — acid green is too light for white text. |

---

### Light Mode

| Name | Token | Value | Use |
|---|---|---|---|
| Canvas | `$color-canvas` | `#F5F5F3` | Page background |
| Surface | `$color-surface` | `#FFFFFF` | Cards, panels, inputs |
| Surface Elevated | `$color-surface-elevated` | `#FAFAF8` | Dropdowns, hovered rows, disabled inputs |
| Border Subtle | `$color-border-subtle` | `rgba(20,20,18,0.06)` | Dividers, ghost borders |
| Border Default | `$color-border` | `rgba(20,20,18,0.10)` | Card borders, input borders at rest |
| Border Strong | `$color-border-strong` | `rgba(20,20,18,0.18)` | Focused inputs, active rows |
| Text Primary | `$color-text-primary` | `#141412` | Headlines, labels, body |
| Text Secondary | `$color-text-secondary` | `#666660` | Descriptions, timestamps, help text |
| Text Muted | `$color-text-muted` | `#9A9A94` | Placeholders, disabled labels, fine print |

---

### Dark Mode

| Name | Token | Value | Use |
|---|---|---|---|
| Canvas | `$color-canvas-dark` | `#090909` | Page background |
| Surface | `$color-surface-dark` | `#111111` | Cards, panels, inputs |
| Surface Elevated | `$color-surface-elevated-dark` | `#171717` | Dropdowns, hovered rows, disabled inputs |
| Border Subtle | `$color-border-subtle-dark` | `rgba(255,255,255,0.06)` | Dividers, ghost borders |
| Border Default | `$color-border-dark` | `rgba(255,255,255,0.10)` | Card and input borders at rest |
| Border Strong | `$color-border-strong-dark` | `rgba(255,255,255,0.18)` | Focused inputs, active rows |
| Text Primary | `$color-text-primary-dark` | `#F5F5F0` | Headlines, labels, body |
| Text Secondary | `$color-text-secondary-dark` | `#B3B3AC` | Descriptions, timestamps |
| Text Muted | `$color-text-muted-dark` | `#777770` | Placeholders, disabled |

---

### Semantic

| Name | Token | Light | Dark | Use |
|---|---|---|---|---|
| Success | `$color-success` | `#22C55E` | `#4ADE80` | Positive trends, active badges |
| Warning | `$color-warning` | `#F59E0B` | `#FBBF24` | Caution states, expiring items |
| Danger | `$color-danger` | `#EF4444` | `#F87171` | Destructive actions and errors only |

> **Contrast:** `$color-accent` on `$color-on-accent` passes WCAG AA at all sizes. All `$color-text-primary` / `$color-text-secondary` pairs meet 4.5:1 on their respective surfaces. Semantic colors meet 3:1 minimum. `$color-text-muted` is for non-critical UI only — never use for body copy or labels.

---

## Typography

### Font Families

| Role | Token | Stack | Use |
|---|---|---|---|
| Display | `$font-display` | `'Bricolage Grotesque', system-ui, sans-serif` | All headlines ≥ 20px |
| Body / UI | `$font-body` | `'Satoshi', system-ui, sans-serif` | Body copy, labels, buttons, inputs |
| Mono | `$font-mono` | `'JetBrains Mono', ui-monospace, monospace` | URLs, slugs, IDs, all analytics figures |

---

### Type Scale

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
| `$type-mono-lg` | Mono | 24px | 500 | 1.20 | -0.01em | Large stat numbers on dashboard |
| `$type-mono` | Mono | 14px | 400 | 1.50 | -0.01em | URLs, slugs, click counts, IDs |

**Rules:**
- `$font-mono` is mandatory for every URL, slug, numeric stat, and ID. Never use `$font-body` for data.
- `$font-display` (Bricolage Grotesque) is only used at ≥ 20px. Below that, `$font-body` takes over.
- Max reading width: `70ch` on all body text containers.
- Never center long paragraphs. Center-align for display sizes only.
- Weight ladder: `400 / 500 / 600 / 700`. No other weights.
- `font-variant-numeric: tabular-nums` on all mono data in tables and dashboards.

---

## Spacing

Base unit: `4px`. All layout values are multiples of this unit.

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

## Border Radius

| Token | Value | Use |
|---|---|---|
| `$radius-xs` | 6px | Tags, small inline chips |
| `$radius-sm` | 10px | **All buttons, all inputs** |
| `$radius-md` | 14px | Dropdowns, tooltips |
| `$radius-lg` | 18px | **All cards, panels** |
| `$radius-xl` | 24px | **Modals, drawers, bottom sheets** |
| `$radius-full` | 9999px | **Badges, status chips, toggles** |

Never mix grammars. Buttons and inputs are always `$radius-sm`. Cards are always `$radius-lg`. No exceptions.

---

## Elevation

| Level | Token | CSS | Use |
|---|---|---|---|
| 0 | `$elevation-flat` | none | Page canvas, sidebar, nav bars |
| 1 | `$elevation-subtle` | `1px solid $color-border` | Cards, inputs at rest, table rows |
| 2 | `$elevation-raised` | `1px solid $color-border-strong` + `box-shadow: 0 2px 8px rgba(0,0,0,0.06)` | Focused inputs, hovered cards, dropdowns |
| 3 | `$elevation-modal` | `box-shadow: 0 8px 32px rgba(0,0,0,0.20)` | **Modals, bottom sheets, toasts** |

Shadow appears at Level 3 only. Levels 0–2 use border contrast and spacing for depth.

---

## Blur

Blur is used exclusively on surfaces that float over page content. Never blur cards, page backgrounds, or static content.

| Token | Value | Use |
|---|---|---|
| `$blur-subtle` | `blur(8px)` | Modal backdrop, nav drawer backdrop |
| `$blur-medium` | `blur(12px)` | Dropdown backdrop (when over photography or complex content) |

Applied as `backdrop-filter: $blur-subtle` on the backdrop element, not the surface itself. Always paired with a dimming overlay (`rgba(0,0,0,0.5)` for modals, `rgba(0,0,0,0.4)` for drawers).

---

## Layout

### Container Widths

| Context | Max Width | Side Padding |
|---|---|---|
| Mobile | 100% | `$space-4` (16px) |
| Tablet | 720px | `$space-6` (24px) |
| Desktop | 1280px | `$space-8` (32px) |
| Large Desktop | 1440px | `$space-12` (48px) |
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
| Mobile (< 640px) | 4 | 16px |
| Tablet (640–1023px) | 8 | 16px |
| Desktop (≥ 1024px) | 12 | 24px |

---

## Motion

### Timing

| Token | Value | Use |
|---|---|---|
| `$motion-fast` | 120ms | Button press, badge appear, tooltip |
| `$motion-normal` | 180ms | Card hover, dropdown open, input focus |
| `$motion-slow` | 280ms | Modal enter/exit, drawer slide, toast enter |

### Easing

| Token | Value | Use |
|---|---|---|
| `$ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` | All entering elements |
| `$ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | All exiting elements |

**Rules:**
- Animate only: `opacity`, `transform` (translate, scale), `color`, `background-color`, `border-color`.
- Never animate: `width`, `height`, `top`, `left`, `right`, `bottom`, `padding`, `margin`.
- Exit animations run at 70% of enter duration (e.g. modal enters at `$motion-slow` 280ms, exits at ~200ms).
- Respect `prefers-reduced-motion: reduce` — disable all transforms and opacity transitions, keep state changes instant.

---

## Components

### Navigation

**`$component-sidebar`** — Persistent left sidebar on all desktop breakpoints (≥ 1024px). Width 280px. Background `$color-canvas`. Right border `1px solid $color-border`. `$elevation-flat`. Never collapses at any desktop breakpoint. Structure top-to-bottom: logo → primary nav items → flexible space → workspace switcher → user profile. Nav item height 44px, padding 0 `$space-4`.

**`$component-sidebar-item`** — Default: text `$color-text-secondary`, `$type-label`, `$radius-sm`. Active: background `$color-accent`, text `$color-on-accent`. Icon 20px, `$space-2` gap to label. No hover state defined — active is the only alternate state.

**`$component-top-bar`** — Replaces sidebar on mobile and tablet (< 1024px). Height 56px. Background `$color-canvas`. Bottom border `1px solid $color-border`. Left: logo mark. Right: hamburger icon (24px) that triggers `$component-nav-drawer`.

**`$component-nav-drawer`** — Triggered by hamburger on mobile/tablet. Slides in from left. Width 280px, full viewport height. Background `$color-surface`. `$radius-xl` on right edge only. Backdrop: `rgba(0,0,0,0.4)` + `$blur-subtle`. Closes via swipe-left or backdrop tap. Motion: `$motion-slow` / `$ease-enter` on open, `$ease-exit` on close.

---

### Buttons

**`$component-button-primary`** — Background `$color-accent`, text `$color-on-accent`, `$type-label`, `$radius-sm`, height 44px, padding 0 20px.
- Active: `transform: scale(0.97)`, transition `$motion-fast`
- Focus: `outline: 2px solid $color-accent`, `outline-offset: 2px`
- Disabled: `opacity: 0.4`, `pointer-events: none`

**`$component-button-secondary`** — Background `$color-surface`, text `$color-text-primary`, `$type-label`, `1px solid $color-border`, `$radius-sm`, height 44px, padding 0 20px.
- Active: `transform: scale(0.97)`, transition `$motion-fast`
- Focus: `outline: 2px solid $color-accent`, `outline-offset: 2px`
- Disabled: `opacity: 0.4`, `pointer-events: none`

**`$component-button-ghost`** — Background transparent, text `$color-text-secondary`, `$type-label`, no border, `$radius-sm`, height 44px, padding 0 `$space-4`. Tertiary actions only.
- Active: `transform: scale(0.97)`, transition `$motion-fast`
- Focus: `outline: 2px solid $color-accent`, `outline-offset: 2px`
- Disabled: `opacity: 0.4`, `pointer-events: none`

**`$component-button-danger`** — Background `$color-danger`, text `#FFFFFF`, `$type-label`, `$radius-sm`, height 44px, padding 0 20px. Destructive actions only — delete link, revoke access, account removal. Never for cancel or navigation.
- Active: `transform: scale(0.97)`, transition `$motion-fast`
- Focus: `outline: 2px solid $color-danger`, `outline-offset: 2px`

**`$component-button-icon`** — 36×36px (default) or 44×44px (touch targets). Background transparent or `$color-surface`. `$radius-sm`. Icon 18px, `$color-text-secondary`. Must carry `aria-label`.
- Focus: `outline: 2px solid $color-accent`, `outline-offset: 2px`

---

### Inputs & Forms

**`$component-input`** — Background `$color-surface`, text `$color-text-primary`, `$type-body`, border `1px solid $color-border` (`$elevation-subtle`), `$radius-sm`, height 48px, horizontal padding `$space-4`.
- Focus: border upgrades to `$color-border-strong`, `box-shadow: 0 0 0 3px rgba(203,255,71,0.20)`, transition `$motion-normal`
- Error: border `$color-danger`, focus ring `rgba(239,68,68,0.20)`
- Disabled: background `$color-surface-elevated`, `opacity: 0.6`, `cursor: not-allowed`
- Label: always above the input in `$type-label` / `$color-text-primary`. Placeholder is hint text only — never the label.
- Error message: below the input in `$type-body-sm` / `$color-danger`. Uses `role="alert"`.

**`$component-input-slug`** — Variant of `$component-input`. Left side renders the non-editable domain prefix in `$font-mono` / `$color-text-muted`, separated by a right border `$color-border`. Editable slug portion in `$font-mono` / `$color-text-primary`.

**`$component-dropdown`** — Background `$color-surface`, `$elevation-raised`, `$radius-md`, `$space-2` vertical padding. Opens below the trigger with `$motion-normal` / `$ease-enter`. Each option: height 36px, horizontal padding `$space-4`, `$type-body-sm` / `$color-text-primary`. Hovered option: background `$color-surface-elevated`. Selected option: text `$color-accent`. Closes on outside click or Escape.

**`$component-textarea`** — Same border, radius, and font as `$component-input`. Min-height 120px. `resize: none`. Vertical padding 14px. All states identical to `$component-input`.

**Form spacing:** label → field `$space-2` · field → field `$space-6` · section → section `$space-12`. Max form width 720px. Single column by default; two columns only on desktop settings surfaces.

---

### Cards & Containers

**`$component-card`** — Background `$color-surface`, `$elevation-subtle`, `$radius-lg`, padding `$space-6`. On hover: transitions to `$elevation-raised` over `$motion-normal` / `$ease-enter`.

**`$component-stat-card`** — Variant of `$component-card`. Structure top-to-bottom: metric label (`$type-caption` / `$color-text-muted`) → primary value (`$type-mono-lg` / `$color-text-primary`) → optional trend row: directional arrow icon + delta value (`$type-body-sm`) in `$color-success` for positive or `$color-danger` for negative.

**`$component-link-row`** — Table row for the link list. Height 64px. Bottom border `1px solid $color-border`. Layout: favicon 20px → destination URL (`$type-mono` / `$color-text-primary`, truncated) → slug (`$type-mono` / `$color-accent`) → click count (`$type-mono` / `$color-text-secondary`) → action trigger (`$component-button-icon`). Hover: background `$color-surface-elevated`, transition `$motion-fast`.

**`$component-modal`** — Centered overlay. Max-width 560px. `$radius-xl`. Background `$color-canvas`. `$elevation-modal`. Backdrop: `rgba(0,0,0,0.5)` + `$blur-subtle`. Header: title `$type-heading-lg` / `$color-text-primary` + `$component-button-icon` (close) right-aligned. Body: `$space-6` padding. Footer: `$space-6` padding, right-aligned action buttons. Enters with `transform: scale(0.96) → 1` + `opacity: 0 → 1` at `$motion-slow`. Closes via Escape, close button, or outside click.

**`$component-bottom-sheet`** — Mobile only (< 768px). Replaces `$component-modal`. Full width, bottom-anchored, `$radius-xl` on top corners only. Background `$color-surface`. `$elevation-modal`. Drag handle: 4×32px, `$color-border`, `$radius-full`, centered 12px from top. Safe area padding at bottom. Enters via `translateY(100%) → 0` at `$motion-slow`. Swipe down or backdrop tap to dismiss.

**`$component-badge`** — `$type-caption`, `$radius-full`, padding 3px 8px. Accent variant: background `$color-accent`, text `$color-on-accent`. Success variant: background `$color-success`, text `#FFFFFF`. Danger variant: background `$color-danger`, text `#FFFFFF`. Muted variant: background `$color-surface-elevated`, text `$color-text-secondary`. Max 2 words.

**`$component-empty-state`** — Centered column layout. Icon 32px / `$color-text-muted` → headline `$type-heading-md` / `$color-text-primary` → description `$type-body` / `$color-text-secondary` (max 2 lines, 48ch max-width) → `$component-button-primary`. Vertical padding `$space-16`.

---

### Feedback

**`$component-toast`** — Notification for tRPC mutation results (link created, link deleted, copy confirmed, error). Appears bottom-right on desktop, bottom-center on mobile. Width 320px max. Background `$color-surface`. `$elevation-modal`. `$radius-lg`. Padding `$space-4` horizontal, `$space-3` vertical. Left accent bar: 3px wide, `$color-success` / `$color-danger` / `$color-warning` / `$color-accent` depending on type. Icon 16px + message `$type-body-sm` / `$color-text-primary`. Optional dismiss button (`$component-button-icon`, right-aligned). Enters via `translateY(8px) → 0` + `opacity: 0 → 1` at `$motion-normal`. Auto-dismisses after 4000ms. Stacks vertically with `$space-2` gap between toasts.
- Success: left bar `$color-success`, icon checkmark
- Danger: left bar `$color-danger`, icon x-circle
- Warning: left bar `$color-warning`, icon alert-triangle
- Info: left bar `$color-accent`, icon info

**`$component-skeleton`** — Shown at ≥ 300ms. Matches exact shape and dimensions of the content it replaces. Background `$color-surface-elevated`, shimmer animation: linear-gradient sweep from transparent → `$color-border` → transparent, 1.2s ease-in-out infinite. Nothing shown before 300ms. Never use full-page spinners.

---

### Analytics

**`$component-chart`** — Primary series: `$color-accent`. Secondary series: `$color-text-muted`. No gradient fills, no decorative shadows. Grid lines: `1px solid $color-border`, dashed. Axis labels: `$type-caption` / `$color-text-muted`. All data values: `$type-mono`. Interactive points/bars minimum 44px tap target. Tooltips keyboard-accessible via focus. Empty state uses `$component-empty-state` spec.

**`$component-data-table`** — Header row: background `$color-surface-elevated`, `$type-caption` / `$color-text-muted`, uppercase, `letter-spacing: 0.05em`, height 40px. Sortable columns: chevron icon right-aligned, `$color-text-muted`; active sort chevron in `$color-accent`. Body rows: follow `$component-link-row` spec.

---

### Footer

**`$component-footer`** — Background `$color-canvas`. Top border `1px solid $color-border`. Link columns: `$type-body-sm` / `$color-text-secondary`, line-height 2.0 for scannable density. Column headings: `$type-label` / `$color-text-primary`. Legal row: `$type-caption` / `$color-text-muted`. Vertical padding `$space-16`.

---

## Responsive Behavior

| Element | Desktop ≥ 1024px | Tablet 640–1023px | Mobile < 640px |
|---|---|---|---|
| Navigation | Sidebar 280px, persistent | Top bar + drawer | Top bar + drawer |
| Stat cards | 4-column | 2-column | 1-column |
| Link table | All columns visible | Secondary columns hidden | Slug + clicks only |
| Modal | Centered 560px | Centered 90vw | Bottom sheet |
| Settings | 2-column | 1-column stacked | 1-column stacked |
| Toast | Bottom-right, 320px | Bottom-right, 320px | Bottom-center, 100% - 32px |
| Hero type | `$type-display-xl` 56px | `$type-display-lg` 48px | `$type-display-md` 40px |

**Rules:**
- Mobile first. Every component defined at mobile size, extended up.
- Never hide functionality across breakpoints — only change presentation.
- Below 1024px, the sidebar disappears entirely. Navigation is top bar + drawer only.
- Large screens: content stays at max-width. Whitespace absorbs extra viewport. Never stretch edge-to-edge.

---

## Accessibility

| Rule | Requirement |
|---|---|
| Touch target | Minimum 44 × 44px on all interactive elements |
| Body text contrast | WCAG AA — 4.5:1 minimum |
| Large text contrast | WCAG AA — 3:1 minimum (≥ 18px bold or ≥ 24px regular) |
| Focus ring | `2px solid $color-accent`, `outline-offset: 2px`, always visible, never hidden |
| Keyboard navigation | Full tab order on all interactive elements; logical DOM order matches visual order |
| Reduced motion | `prefers-reduced-motion: reduce` — all transforms and transitions disabled, state changes instant |
| Icon-only buttons | Must carry `aria-label` describing the action |
| Form errors | Announced via `role="alert"` or `aria-live="polite"`. Error message references the field by name. |
| Toast notifications | `aria-live="polite"` for success/info, `aria-live="assertive"` for errors |
| Color-only meaning | Never. Every color-coded state (success, danger, warning) is paired with an icon or text label. |

---

## Do's and Don'ts

### Do
- Use `$color-accent` (#CBFF47) for every interactive signal — primary button, active nav item, focus ring, key metric. One accent, everywhere.
- Render all URLs, slugs, IDs, and analytic numbers in `$font-mono`. Data is always mono.
- Use `$radius-sm` (10px) for all buttons and inputs. `$radius-lg` (18px) for all cards. No exceptions.
- Show `$component-skeleton` at ≥ 300ms. Show nothing before 300ms. Never use a spinner.
- Keep the sidebar persistent on all desktop breakpoints (≥ 1024px).
- Use `$component-bottom-sheet` instead of `$component-modal` on mobile (< 768px).
- Restrict `$color-danger` to destructive actions only — delete, revoke, permanent removal.
- Apply `transform: scale(0.97)` + `$motion-fast` as the active/press state on all buttons.
- Test light and dark mode independently. Never assume a value from one mode works in the other.
- Pair every `$color-success` / `$color-danger` / `$color-warning` use with an icon or label — never color alone.

### Don't
- Don't introduce a second accent color. `$color-accent` is the only interactive signal in the system.
- Don't apply `box-shadow` to cards, buttons, or inputs. Shadow is reserved for `$elevation-modal` only.
- Don't animate `width`, `height`, or position properties (`top`, `left`, `right`, `bottom`).
- Don't use placeholder text as a field label. Every input has a persistent label above it.
- Don't center body paragraphs. Center-align display sizes only.
- Don't show any loading indicator under 300ms. Show nothing, then jump to content.
- Don't stretch content beyond 1600px. Whitespace absorbs extra width.
- Don't use `$font-display` below 20px. `$font-body` takes over at smaller sizes.
- Don't use `$color-danger` for cancel buttons or navigation — destructive and irreversible actions only.
- Don't blur page content, cards, or static backgrounds. `backdrop-filter` is for floating surface backdrops only.

---

## Known Gaps

- Inline validation patterns (character limit counters, format hints) are not yet documented.
- Chart sub-types (area, bar, sparkline) each need a dedicated sub-component spec.
- Toast stacking behavior beyond 3 simultaneous toasts is not defined.
- Bottom sheet spring easing for swipe-to-dismiss is not representable with the current `$motion` token set — implementation should use a physics-based spring (e.g. `spring(stiffness: 300, damping: 30)`).
  
## Product Philosophy

* TinyTags is a premium URL operating system focused on creating, managing, organizing, and sharing links. Analytics support links; links do not support analytics.
* Inspired by Bitly's simplicity, Dub's link management, Vercel's developer experience, and Apple's visual restraint.
* Built for developers, founders, creators, students, and small teams. Simple for new users, efficient for power users.
* The primary workflow is: Create Link → Manage Link → Share Link → Monitor Link → Create Link Again. Every screen should support this loop.

* The dashboard is a workspace, not a landing page. Creating and managing links are primary actions; analytics remain supporting information.

* Information hierarchy is always: Primary Action → Primary Content → Secondary Actions → Supporting Information.

* The interface should feel fast, premium, modern, focused, technical, mature, and intentional. Never corporate, noisy, experimental, trend-driven, or over-designed.

* Interface recedes, content leads. Users should notice links, slugs, destinations, and actions before cards, borders, effects, or decoration.

* Whitespace exists to create hierarchy and improve comprehension. Content width remains stable; additional screen width becomes breathing room.

* Typography carries hierarchy through size, weight, spacing, and placement before color.

* One accent color, one meaning. Accent communicates action, focus, selection, and importance; never decoration.

* Motion explains change. If an animation does not improve understanding, remove it.

* Mobile is the same product with a different layout. Features never disappear; only presentation changes.

* Interactions should feel predictable, states reliable, loading intentional, and errors understandable. The product should reward repeated use.

* Content should be short, clear, and actionable. Prefer direct instructions, precise labels, and concise descriptions over marketing language and buzzwords.

* Every feature should improve link management, reduce effort, increase workflow speed, or support the core workflow. Otherwise it likely does not belong.

* Complexity is a cost. Clarity is a feature. The best UI is the one users stop noticing.

* Before adding anything, ask: Does it improve clarity, speed, usability, support the workflow, and align with the product identity? If not, do not add it.

* TinyTags is a fast, focused, and intentionally minimal system for managing links.