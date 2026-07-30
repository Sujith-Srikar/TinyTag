# TinyTags Design System

URL management platform. Warm neutral canvas, single acid-green accent. Interface recedes; links, slugs, and analytics take the stage.

| Characteristic | Value |
|---|---|
| Platform | Web-only (Next.js) — no native app constraints |
| Styling | Tailwind CSS + SCSS modules |
| Component library | shadcn/ui (Radix + Tailwind) |
| Icon library | Phosphor (`@phosphor-icons/react`), Heroicons fallback |
| Font stack | PP Neue Montreal (display) + Satoshi (body), local `next/font/local` |
| Accent | `#D0F54A` — single, never decorative |
| Dark mode | Full parity, `data-theme="dark"` attribute |

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

### Do's

- Use the accent color exclusively for primary actions, selection states, and focus indicators
- Build depth through border contrast and spacing before reaching for shadow
- Animate only to clarify state transitions — entrance, exit, focus, and completion
- Let the browser handle form controls; override appearance only when necessary for brand consistency
- Keep motion brief and purposeful — every animation should answer "what changed?"

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
| `--color-brand` | `#D0F54A` | `#D0F54A` | Primary actions, active states, focus rings. Reserved — never decorative. |
| `--color-on-accent` | `#100303` | `#100303` | Text and icons on accent backgrounds. Always near-black — acid green is too light for white text. |
| `--color-accent-muted` | `#e8ffaa` | `rgba(203,255,71,0.12)` | Subtle accent tints, hover tints. |
| `--color-accent-dim` | `rgba(203,255,71,0.15)` | `rgba(203,255,71,0.08)` | Focus rings, disabled accent backgrounds. |

**Contrast guarantee:** `--color-brand` on `--color-on-accent` passes WCAG AA at all text sizes.

#### Surfaces

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-surface-canvas` | `#F3F1EC` | `#090909` | Page canvas |
| `--color-surface` | `#F0EEE9` | `#111111` | Cards, panels, inputs |
| `--color-surface-elevated` | `#EBE8E1` | `#171717` | Dropdowns, hovered rows, disabled inputs |

#### Borders

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-border-subtle` | `rgba(20,20,18,0.06)` | `rgba(255,255,255,0.06)` | Dividers, ghost borders |
| `--color-border` | `rgba(20,20,18,0.10)` | `rgba(255,255,255,0.10)` | Card borders, input borders at rest |
| `--color-border-strong` | `rgba(20,20,18,0.18)` | `rgba(255,255,255,0.18)` | Focused inputs, active rows |
| `--color-border-focus` | `var(--color-brand)` | `var(--color-brand)` | Focus outlines only — accent reused |

#### Text

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-text-primary` | `#141412` | `#F5F5F0` | Headlines, labels, body copy |
| `--color-text-secondary` | `#68655F` | `#B3B3AC` | Descriptions, timestamps, help text |
| `--color-text-muted` | `#8C8882` | `#777770` | Placeholders, disabled labels, fine print |
| `--color-text-inverse` | `#F5F5F0` | `#141412` | Text on dark or colored surfaces |

**Contrast:** `--color-text-primary` on `--color-surface` meets 4.5:1 in both modes. `--color-text-secondary` on `--color-surface` meets 4.5:1. `--color-text-muted` is non-critical UI only — avoid for body copy or labels.

#### Semantic

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-success` | `#22C55E` | `#4ADE80` | Positive trends, active badges |
| `--color-success-muted` | `rgba(34,197,94,0.1)` | `rgba(74,222,128,0.1)` | Success backgrounds |
| `--color-warning` | `#F59E0B` | `#FBBF24` | Caution states, expiring items |
| `--color-warning-muted` | `rgba(245,158,11,0.1)` | `rgba(251,191,36,0.1)` | Warning backgrounds |
| `--color-danger` | `#EF4444` | `#F87171` | Destructive actions and errors |
| `--color-danger-muted` | `rgba(239,68,68,0.1)` | `rgba(248,113,113,0.1)` | Error backgrounds |
| `--color-danger-ring` | `rgba(239,68,68,0.2)` | `rgba(248,113,113,0.2)` | Error focus rings |

**Rule:** Every color-coded state is paired with an icon or text label. Color alone never carries meaning.

#### Accent-as-foreground text

When accent is used as a text color (e.g., slug in link row, active sort indicator), verify contrast against the actual background. `--color-brand` (#D0F54A) on `--color-surface` (#F0EEE9) is low contrast — use `--color-text-primary` or `--color-text-secondary` as fallback in those contexts, reserving accent text for large display sizes only.

---

### 2.2 Typography

#### Font families

| Token | Stack | Use |
|---|---|---|
| `--font-family-display` | `'PP Neue Montreal', system-ui, sans-serif` | Headlines ≥ 20px |
| `--font-family-body` | `'Satoshi', system-ui, sans-serif` | Body copy, labels, buttons, inputs |
| `--font-family-mono` | `'JetBrains Mono', ui-monospace, monospace` | URLs, slugs, IDs, analytics figures |

PP Neue Montreal pairs with Satoshi on a geometric-vs-humanist axis — the contrast between them creates hierarchy without visual noise.

**Fallback strategy:** If PP Neue Montreal fails to load, `system-ui, sans-serif` kicks in (already in the stack). Satoshi falls back to `system-ui` the same way. No Flash of Invisible Text (FOIT) — `next/font/local` uses `display: swap` by default.

#### Type scale

Base size: 16px. Scale ratio: major second (×1.125) for body, larger steps for display.

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `--font-size-display-xl` | 56px | 600 | 1.05 | -0.03em | Landing hero |
| `--font-size-display-lg` | 48px | 600 | 1.05 | -0.03em | Section hero |
| `--font-size-display-md` | 40px | 600 | 1.10 | -0.02em | Page titles |
| `--font-size-heading-xl` | 32px | 600 | 1.15 | -0.02em | Card group headers |
| `--font-size-heading-lg` | 24px | 600 | 1.20 | -0.02em | Card titles, sidebar sections |
| `--font-size-heading-md` | 20px | 600 | 1.25 | -0.01em | Sub-section heads |
| `--font-size-body-lg` | 18px | 400 | 1.60 | 0 | Lead paragraphs, onboarding |
| `--font-size-body` | 16px | 400 | 1.60 | 0 | Default body copy |
| `--font-size-body-sm` | 14px | 400 | 1.50 | 0 | Help text, secondary descriptions |
| `--font-size-label` | 14px | 500 | 1.00 | 0 | Input labels, button text, nav items |
| `--font-size-caption` | 12px | 400 | 1.40 | 0.01em | Timestamps, table headers, fine print |
| `--font-size-mono-lg` | 24px | 500 | 1.20 | -0.01em | Large stat numbers |
| `--font-size-mono` | 14px | 400 | 1.50 | -0.01em | URLs, slugs, click counts, IDs |

#### Typographic rules

- `--font-family-mono` is mandatory for every URL, slug, numeric stat, and ID.
- `--font-family-display` at ≥ 20px only. Below that, `--font-family-body` takes over.
- Max reading width: 70ch on all body text containers.
- Weight ladder: 400 / 500 / 600. Reserve 700 for marketing surfaces only.
- `font-variant-numeric: tabular-nums` on all mono data in tables and dashboards.
- `text-wrap: balance` on h1–h3. `text-wrap: pretty` on long prose.

---

### 2.3 Spacing

Base unit: 4px. All values are multiples of this unit.

| Token | Value | Use |
|---|---|---|
| `spacing-1` | 4px | Icon-to-label gap, tight inline spacing |
| `spacing-2` | 8px | Compact internal spacing |
| `spacing-3` | 12px | Badge padding, tight gaps |
| `spacing-4` | 16px | Default unit, input horizontal padding |
| `spacing-6` | 24px | Card padding, form field gaps |
| `spacing-8` | 32px | Section spacing |
| `spacing-12` | 48px | Large block spacing |
| `spacing-16` | 64px | Page vertical rhythm |
| `spacing-24` | 96px | Hero whitespace |
| `spacing-32` | 128px | Large marketing sections |
| `spacing-0-5` | 2px | Half-unit spacing, compact icon gaps |
| `spacing-1-5` | 6px | Fine spacing for tight layouts |
| `spacing-5` | 20px | Input-to-label gap, subtle section spread |
| `spacing-7` | 28px | Compact card padding |
| `spacing-9` | 36px | Form section spacing |
| `spacing-10` | 40px | Wide form spacing |
| `spacing-11` | 44px | Element height baseline, generous spacing |

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

### 2.5 Element Size

| Token | Value | Use |
|---|---|---|
| `--size-element-xs` | 24px | Compact buttons, tags, icon-only controls |
| `--size-element-sm` | 28px | Small buttons, compact inputs |
| `--size-element-md` | 36px | Default input height, dropdown items |
| `--size-element-lg` | 44px | Primary button height, touch target minimum |
| `--size-element-xl` | 52px | Large buttons, hero inputs |

---

### 2.6 Elevation

Depth comes from border contrast and spacing first. Shadow is reserved for the overlay layer — modals, drawers, and toasts. Subtle shadow may appear on dropdowns and elevated cards, but never as default card treatment.

| Level | Treatment | Use |
|---|---|---|
| Flat | No border, no shadow | Page canvas, sidebar, nav bars |
| Subtle | 1px solid `--color-border` | Cards, inputs at rest, table rows |
| Raised | 1px solid `--color-border-strong` | Focused inputs, hovered cards, dropdowns |
| Overlay | Modal shadow + backdrop blur | Modals, bottom sheets, toasts |

**Default:** Levels 0–2 use border contrast. Level 3 uses shadow and backdrop blur.

---

### 2.7 Blur

| Token | Value | Use |
|---|---|---|
| `blur-subtle` | 8px | Modal backdrop, drawer backdrop |
| `blur-medium` | 20px | Dropdown backdrop over complex content |

Applied as `backdrop-filter` on the backdrop element, not the surface itself. Always paired with a dimming overlay.

---

### 2.8 Opacity

| Token | Value | Use |
|---|---|---|
| `opacity-disabled` | 0.4 | Disabled interactive elements |

---

### 2.9 Motion

| Token | Duration | Use |
|---|---|---|---|
| `duration-fast` | 120ms | Button press, badge appear, tooltip |
| `duration-medium` | 180ms | Card hover, dropdown open, input focus |
| `duration-slow` | 280ms | Modal enter/exit, drawer slide, toast enter |
| `duration-exit-fast` | 84ms | Button press release, badge dismiss |
| `duration-exit-medium` | 126ms | Dropdown close, tooltip hide |
| `duration-exit-slow` | 196ms | Modal exit, drawer close, toast dismiss |

| Token | Curve | Use |
|---|---|---|
| `ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` | All entering elements |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | All exiting elements |

#### Transition shorthands

| Token | Value | Use |
|---|---|---|
| `--transition-fast` | `var(--duration-fast) var(--ease-enter)` | Quick property transitions (color, bg) |
| `--transition-base` | `var(--duration-medium) var(--ease-enter)` | Default transition |
| `--transition-slow` | `var(--duration-slow) var(--ease-enter)` | Theme-switch, layout transitions |
| `--transition-exit-fast` | `var(--duration-exit-fast) var(--ease-exit)` | Quick exit transitions |
| `--transition-exit-base` | `var(--duration-exit-medium) var(--ease-exit)` | Default exit transition |
| `--transition-exit-slow` | `var(--duration-exit-slow) var(--ease-exit)` | Slow exit transitions |

#### Motion rules

- Animate only: opacity, transform (translate, scale), color, background-color, border-color.
- Avoid animating layout properties (width, height, padding, margin).
- Exit animations use the dedicated `--duration-exit-*` tokens (70% of corresponding enter duration).
- Respect `prefers-reduced-motion: reduce` — disable all transforms and opacity transitions.

---

### 2.10 Shadow and Overlay

| Token | Value | Use |
|---|---|---|
| `shadow-high` | `0 8px 32px rgba(20,20,18,0.16), 0 2px 8px rgba(20,20,18,0.08)` | Modal surfaces |
| `color-overlay` | `rgba(20,20,18,0.5)` | Modal backdrop |
| `color-overlay-drawer` | `rgba(20,20,18,0.4)` | Drawer backdrop |
| `shadow-low` | `0 1px 2px rgba(20,20,18,0.06), 0 1px 1px rgba(20,20,18,0.04)` | Small card hover shadow |
| `shadow-md` | `0 4px 12px rgba(20,20,18,0.10), 0 2px 4px rgba(20,20,18,0.06)` | Dropdown, popover shadow |

### 2.11 Z-index

| Token | Value | Use |
|---|---|---|
| `--z-base` | 1 | Base stacking |
| `--z-dropdown` | 100 | Dropdowns, tooltips, popovers |
| `--z-overlay-low` | 150 | Lower overlay elements |
| `--z-sticky` | 200 | Sticky headers, sticky columns |
| `--z-overlay` | 300 | Backdrops, overlay containers |
| `--z-modal` | 400 | Modals, drawers, bottom sheets |
| `--z-toast` | 500 | Toasts, notifications |

---

## 3. Semantic Tokens

Semantic tokens map intent to primitives. Components consume semantic tokens, never primitives directly. This allows redesigns without touching component code.

### Foreground

| Token | Maps to | Use |
|---|---|---|
| `foreground` | `--color-text-primary` | Headlines, labels, body copy |
| `foreground-muted` | `--color-text-secondary` | Descriptions, timestamps |
| `foreground-subtle` | `--color-text-muted` | Placeholders, fine print |
| `foreground-inverse` | `--color-text-inverse` | Text on dark or colored surfaces |

### Surface

| Token | Maps to | Use |
|---|---|---|
| `surface` | `--color-surface` | Cards, panels, inputs |
| `surface-elevated` | `--color-surface-elevated` | Dropdowns, hovered rows |
| `surface-base` | `--color-surface-canvas` | Page canvas |
| `surface-hover` | `--color-surface-elevated` | Hovered interactive surface |
| `surface-selected` | `--color-accent-muted` | Selected items, active states |
| `surface-disabled` | `--color-surface-elevated` | Disabled inputs and buttons |

### Border

| Token | Maps to | Use |
|---|---|---|
| `border` | `--color-border` | Card borders, input borders |
| `border-subtle` | `--color-border-subtle` | Dividers, ghost borders |
| `border-strong` | `--color-border-strong` | Focused inputs, active rows |
| `border-focus` | `--color-border-focus` | Focus outlines |

### Interactive

| Token | Maps to | Use |
|---|---|---|
| `interactive` | `--color-brand` | Primary action color |
| `interactive-hover` | `color-mix(in srgb, var(--color-brand) 80%, #000)` | Hovered primary action |
| `interactive-active` | `color-mix(in srgb, var(--color-brand) 60%, #000)` | Pressed primary action |
| `interactive-muted` | `--color-accent-muted` | Subtle interactive tints |

### Status

| Token | Maps to | Use |
|---|---|---|
| `status-success` | `--color-success` | Positive outcome |
| `status-success-muted` | `--color-success-muted` | Success background |
| `status-warning` | `--color-warning` | Caution |
| `status-warning-muted` | `--color-warning-muted` | Warning background |
| `status-danger` | `--color-danger` | Error, destructive |
| `status-danger-muted` | `--color-danger-muted` | Error background |
| `status-danger-ring` | `--color-danger-ring` | Error focus ring |

---

## 4. Interaction States

All interactive components share these states. Component specs reference this section.

| State | Visual rule | Applied to |
|---|---|---|
| **Default** | Resting appearance. Component is visible and ready for interaction. | All components |
| **Hover** | `--surface-hover` background for containers; `--interactive-hover` for accent actions; cursor: pointer. | Buttons, cards, dropdown items, table rows |
| **Focused** | `2px solid var(--color-brand)` outline, `outline-offset: 2px`. Never hidden. | All interactive elements |
| **Active/Pressed** | `--interactive-active` for accent actions; `transform: scale(0.97)` for buttons. | Buttons, toggle switches |
| **Disabled** | `--opacity-disabled` (0.4), `--surface-disabled` background, pointer-events: none. | Buttons, inputs, dropdowns |
| **Loading** | Spinner replaces content. Button retains size. Skeleton for content areas after 300ms. | Buttons, stat cards, tables |
| **Error** | `--status-danger-ring` border + ring, `status-danger` message below with `role="alert"`. | Inputs, form fields |
| **Success** | `--status-success` brief flash on completion, then return to default. | Forms, save actions |
| **Selected** | `--surface-selected` background, `--interactive` text or checkmark. | Nav items, list rows, filter chips |

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
| Mobile | `content-xs` (480px) | `spacing-4` (16px) |
| Tablet | 720px | `spacing-6` (24px) |
| Desktop | 1280px | `spacing-8` (32px) |
| Large desktop | 1440px | `spacing-12` (48px) |
| Ultra wide | 1600px | Content locked, whitespace grows |

### Grid

| Breakpoint | Columns | Gutter |
|---|---|---|
| Mobile (< 640px) | 4 | `spacing-4` |
| Tablet (640–1023px) | 8 | `spacing-4` |
| Desktop (≥ 1024px) | 12 | `spacing-6` |

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
  ↕ spacing-2 (8px)
Description (optional)
  ↕ spacing-1 (4px)
Input
  ↕ spacing-1 (4px)
Helper text or validation
```

**Between fields:** `spacing-6` (24px).
**Between sections:** `spacing-12` (48px).
**Max form width:** 720px.

**Label:** Always above the input. `--font-size-label` style / `--foreground`. Avoid using placeholder text as label.
**Placeholder:** Hint text only, not a substitute for label. `--foreground-subtle`.
**Error message:** Below input, `--font-size-body-sm` / `status-danger`. `role="alert"`.
**Disabled state:** `surface-disabled` background, reduced opacity, `cursor: not-allowed`.

### 6.2 Navigation

**Sidebar** — Persistent on desktop (≥ 1024px). 240px wide. `surface-base` background. Right border `1px solid border`. Structure: logo → nav items → flexible space → user profile.

**Sidebar item** — Default: `foreground-muted`, `font-size-label` style. Active: `interactive` background, `foreground-inverse` text.

**Top bar** — Replaces sidebar on mobile/tablet (< 1024px). `surface-base` background. Bottom border.

**Nav drawer** — Mobile/tablet only. Slides from left. `surface` background. Right edge `radius-xl`. Backdrop: `color-overlay-drawer` + `blur-subtle`.

### 6.3 Feedback

**Toast** — Bottom-right (desktop), bottom-center (mobile). Max 320px. `surface` background. `radius-lg`. Left accent bar: 3px, colored by type. Auto-dismiss 4s. Stacks with `spacing-2` gap.
- Success: `status-success` bar, checkmark icon. `aria-live="polite"`.
- Danger: `status-danger` bar, x-circle icon. `aria-live="assertive"`.
- Warning: `status-warning` bar, alert-triangle icon.
- Info: `interactive` bar, info icon.

**Modal** — Centered. Max-width 560px. `radius-xl`. `surface-base` background. Overlay shadow. Backdrop: `color-overlay` + `blur-medium`. Header with title and close button. Body and footer with `spacing-6` padding.

**Bottom sheet** — Mobile only (< 768px). Replaces modal. Full width, bottom-anchored, `radius-xl` top corners. Drag handle: 4×32px, `border`, `radius-full`.

**Skeleton** — Shown after ≥ 300ms delay. Matches content dimensions. `surface-elevated` background. Avoid spinners in content areas.

### 6.4 Empty States

Centered column. Icon (32px, `foreground-subtle`) → headline (`font-size-heading-md`, `foreground`) → description (`font-size-body`, `foreground-muted`, max 2 lines, 48ch) → primary button. Generous padding.

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

**Stat cards** — Top-to-bottom: metric label (`font-size-caption` / `foreground-subtle`) → value (`font-size-mono-lg` / `foreground`) → trend arrow + delta (`font-size-body-sm`) in `status-success` or `status-danger`.

**Link row** — Table row. Favicon → URL (`font-size-mono` / `foreground`, truncated) → slug (`font-size-mono` / accent — verify contrast) → clicks (`font-size-mono` / `foreground-muted`) → actions.

**Data table** — Header: `surface-elevated`, `font-size-caption` / `foreground-subtle`, uppercase, `letter-spacing: 0.05em`. Sortable column: chevron `foreground-subtle` → `interactive` when active. Body rows: follow link row pattern.

**Charts** — Primary: `interactive`. Secondary: `foreground-subtle`. No gradient fills. Grid: `1px dashed border`. Axis labels: `font-size-caption` / `foreground-subtle`. Data values: `font-size-mono`. Min 44px tap targets.

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

**Accessibility:** Icon-only buttons must carry `aria-label`. Focus ring: `2px solid var(--color-brand)`, `outline-offset: 2px`.

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

**Behavior:** `radius-md`. `surface` background. Raised elevation. Options: 36px height, `font-size-body-sm`. Hover: `surface-elevated`. Selected: accent text or check icon.

**Accessibility:** Keyboard navigation (arrow keys, Enter, Escape). `aria-expanded`, `aria-haspopup`. Selected option announced.

### Badge

**Purpose:** Short status label. Max 2 words.

**Variants:** Accent, success, danger, muted. `radius-full`. `font-size-caption` style.

### Card

**Purpose:** Group related content. `surface` background. Subtle border. `radius-lg`. `spacing-6` padding.

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
- **Spacing:** `spacing-1` (4px) between icon and adjacent label.
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
- **Axis labels:** `font-size-caption` / `foreground-subtle`.
- **Data points:** `font-size-mono` font. Hover reveals exact value.
- **Empty chart:** Show axis skeleton with "No data for this period" message.
- **Avoid:** Gradient fills, decorative shadows, 3D effects, animation on data load.

### Stat cards

Structure: label → value → trend. Label is `font-size-caption` / `foreground-subtle`. Value is `font-size-mono-lg` / `foreground`. Trend is `font-size-body-sm` with directional color.

---

## 10. Accessibility

| Requirement | Standard |
|---|---|---|
| Touch target | Minimum 44 × 44px |
| Body text contrast | WCAG AA — 4.5:1 |
| Large text contrast | WCAG AA — 3:1 (≥ 18px bold or ≥ 24px) |
| Focus ring | `2px solid var(--color-brand)`, `outline-offset: 2px` |
| Keyboard | Full tab order; DOM order matches visual order |
| Skip link | Visible on first Tab press, bypasses nav to main content |
| Heading hierarchy | Single `h1` per page, semantic nesting (`h1` → `h2` → `h3`), no skipping levels |
| Reduced motion | `prefers-reduced-motion: reduce` — transforms and transitions disabled |
| Icon-only buttons | Must carry `aria-label` |
| Form errors | `role="alert"` or `aria-live="polite"` |
| Form labels | Every input has a visible `<label>`, `htmlFor` matches input `id` |
| Toast notifications | `aria-live="polite"` (success/info), `aria-live="assertive"` (errors) |
| Color alone | Never the sole indicator of state — pair with icon or text |
| Screen reader | Status messages use `aria-live` regions. Dynamic content updates announced. |

---

## 11. Known Gaps

- Inline validation patterns (character limit counters, format hints) not yet documented.
- Chart sub-types (area, bar, sparkline) need dedicated specs.
- Toast stacking beyond 3 simultaneous toasts undefined.
- Bottom sheet swipe-to-dismiss needs defined interaction.
- RTL/i18n layout guidance not yet defined.
- Dark mode accent-muted equivalence with light mode not verified for all contexts.
