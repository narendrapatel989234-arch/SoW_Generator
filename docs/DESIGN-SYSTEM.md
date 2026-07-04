# M42 Hub CodeApps — Design System & Structure Reference

> **Audience:** QA / design team.
> **Purpose:** A single reference of the front-end structure under `src/` — folders, design tokens, layout, screens, and every reusable component (its purpose, import path, props, and the exact CSS class names / `data-*` hooks it renders). Use it to design against the real structure and to copy-paste markup/classes for reuse.

> ⚠️ **Note on styling:** Components are styled with **hand-written semantic (BEM-style) class names** — e.g. `app-sidebar__item`, `stat-card__value`. The class names below are the contract to design against. (The component stylesheet defining these classes is authored separately in `src/theme` / component CSS; the tokens it consumes are listed in [Design Tokens](#2-design-tokens).)

---

## 1. Folder structure (`src/`)

```
src/
├── main.tsx                     App entry — mounts <App/>, imports index.css, calls Power SDK initialize()
├── App.tsx                      Wraps <Layout/> in <ThemeProvider/>; imports theme.css + App.css
├── index.css                    Base/global CSS (starter template — being replaced)
├── App.css                      Legacy starter styles
│
├── theme/                       Theming: tokens, runtime theme derivation, React context
│   ├── theme.css                Design tokens (CSS custom properties) + element resets
│   ├── themeConfig.ts           Theme options, color math, deriveThemeVars()
│   ├── ThemeContext.ts          React context + useTheme() hook
│   └── ThemeProvider.tsx        Applies tokens to :root, persists to localStorage
│
├── layout/
│   └── Layout.tsx               App shell: sidebar + main (topbar + content); screen routing
│
├── screens/
│   └── ComponentsShowcase.tsx   "Design system" screen — live component gallery + docs
│
└── components/
    ├── reusable/                Composite / app-level components
    │   ├── LeftNavigation.tsx   Sidebar nav (collapsible)
    │   ├── TopNavigation.tsx    Header bar (toggle + breadcrumb)
    │   └── DataTable.tsx        Generic table: sort, filter, resize, inline edit, paginate
    │
    └── ui/                      Atomic / primitive components
        ├── Icon.tsx             Inline SVG icon set (21 icons)
        ├── componentDoc.ts      Types for self-documenting component metadata
        ├── Button.tsx           Text button (variants)
        ├── IconButton.tsx       Square icon-only button (tones)
        ├── Badge.tsx            Status pill (tones)
        ├── Card.tsx             Surface with optional title header
        ├── StatCard.tsx         KPI card (value, trend, tone/custom bg)
        ├── CodeBlock.tsx        Code snippet + copy button
        ├── Loading.tsx          Spinner + message
        ├── ProcessList.tsx      Task list with live statuses
        ├── AiScanLoader.tsx     Animated document-scan loader
        ├── StepProgress.tsx     Stepper / timeline (2 variants × 2 orientations)
        ├── SidePanel.tsx        Right slide-over drawer (5 widths)
        ├── ConfirmDialog.tsx    Modal confirm (danger / primary)
        ├── FileUpload.tsx       Drag-and-drop upload with per-file progress
        └── RichTextEditor.tsx   Dependency-free WYSIWYG editor
```

**Two component tiers:**
- **`ui/`** — atomic primitives (buttons, badges, cards…). No app logic.
- **`reusable/`** — composite pieces built from primitives (navigation, data table).

Every component co-locates a `componentDoc` export (import line, props, live examples) so it is self-describing; the showcase screen renders them without a central registry.

---

## 2. Design Tokens

All colors, spacing, radii, and typography are **CSS custom properties** declared on `:root` in [`theme/theme.css`](theme/theme.css). **Design against these tokens** — every component references them, so changing a token restyles the whole app.

### Color

| Token | Default | Use |
|---|---|---|
| `--app-color-bg` | `#f5f7fb` | App background |
| `--app-color-surface` | `#ffffff` | Cards, panels, surfaces |
| `--app-color-surface-muted` | `#eef3f8` | Subtle fills, hover rows |
| `--app-color-primary` | `#0D212C` | Primary actions, active state |
| `--app-color-primary-strong` | `#08171F` | Primary hover / pressed |
| `--app-color-primary-soft` | `#D9E6EB` | Primary tint backgrounds |
| `--app-color-accent` | `#36C0C9` | Accent highlights |
| `--app-color-accent-soft` | `#DDF7F9` | Accent tint backgrounds |
| `--app-color-warning` | `#b7791f` | Warning text/icon |
| `--app-color-success` | `#0a8754` | Success text/icon |
| `--app-color-success-soft` | `#d6f1e3` | Success tint |
| `--app-color-danger` | `#d92d20` | Danger/error |
| `--app-color-danger-soft` | `#fde3e1` | Danger tint |
| `--app-color-text` | `#0D212C` | Body text |
| `--app-color-text-muted` | `#5B7E95` | Secondary text |
| `--app-color-border` | `#d9e2ec` | Borders, dividers |
| `--app-color-focus` | `#36C0C9` | Focus outline |

### Elevation, radius, typography, layout

| Token | Default | Use |
|---|---|---|
| `--app-shadow-soft` | `0 10px 30px rgba(15,35,52,0.08)` | Card / panel shadow |
| `--app-radius-sm` | `6px` | Small radius (inputs, pills) |
| `--app-radius-md` | `8px` | Card / surface radius |
| `--app-font-family` | Inter, system-ui… | Global font |
| `--app-sidebar-width` | `256px` | Expanded sidebar |
| `--app-sidebar-collapsed-width` | `72px` | Collapsed sidebar rail |
| `--app-topbar-height` | `64px` | Header bar height |

### Runtime-derived tokens (themeable)

The **Themes** feature lets a user pick a primary color + font. [`themeConfig.ts › deriveThemeVars()`](theme/themeConfig.ts) recomputes and overrides these on `:root` at runtime:

- `--app-color-primary` (chosen color)
- `--app-color-primary-strong` (primary mixed 30% toward black)
- `--app-color-primary-soft` (primary mixed 86% toward white)
- `--app-color-focus` (primary mixed 12% toward white)
- `--app-font-family` (chosen font)

**Primary color options:** Ocean `#0f4c81`, Teal `#0ea5a3`, Indigo `#4f46e5`, Violet `#7c3aed`, Emerald `#059669`, Rose `#e11d48`, Amber `#d97706`, Slate `#334155`.
**Font options:** Inter (default), Verdana, Trebuchet, Georgia, Monospace.

Settings persist to `localStorage` under key `m42.theme.settings`. Consume in code via `useTheme()` → `{ theme, setPrimaryColor, setFontFamily, resetTheme }`.

### Base element resets (in `theme.css`)
`* { box-sizing: border-box }`; `html, body, #root { min-height: 100% }`; `body` uses bg/text/font tokens at `14px`; form controls inherit font; `button { cursor: pointer }`; focus-visible ring uses `--app-color-focus`; headings and `p` have zero margin.

---

## 3. Layout ([`layout/Layout.tsx`](layout/Layout.tsx))

The app shell — a two-column grid: fixed sidebar + flexible main column (topbar over scrolling content).

```
.app-layout
├── <LeftNavigation/>          → aside.app-sidebar
└── .app-main
    ├── <TopNavigation/>        → header.app-topbar
    └── .app-content            → active screen renders here
```

| Class | Element | Notes |
|---|---|---|
| `app-layout` | `div` | Root flex/grid; sidebar + main |
| `app-main` | `main` | Right column (topbar + content) |
| `app-content` | `div` | Scrolling area that holds the active screen |

**State:** `activeScreen` (which screen is shown, default `components`) and `collapsed` (sidebar collapsed). Screen metadata (breadcrumb, title, description) is keyed by `ScreenId`.

**`ScreenId` values:** `dashboard`, `components`, `themes`, `website-sources`, `crawl-health`, `settings`, `weekly-digestive`.

---

## 4. Screens ([`screens/`](screens/))

### ComponentsShowcase ([`ComponentsShowcase.tsx`](screens/ComponentsShowcase.tsx))
The live "Design system" gallery. Left doc-nav lists components grouped by folder (UI / Reusable); right pane shows the selected component's hero preview, import snippet, props table, and variation examples.

```
.screen-stack
├── header (screen-eyebrow / screen-title / screen-description)
└── .docs-layout
    ├── aside.docs-nav
    │   └── .docs-nav__section
    │       ├── .docs-nav__label
    │       └── button.docs-nav__item        [data-active]
    └── .docs-content
        └── article.docs-article
            ├── .docs-article__head (.docs-article__title + .screen-description)
            ├── .docs-preview.docs-preview--hero
            └── section.docs-section
                ├── .docs-section__title
                ├── .docs-block (.docs-label + <CodeBlock/>)
                ├── table.props-table (in .props-table-wrap)
                └── .docs-example (.docs-example__title, .docs-preview, <CodeBlock/>)
```

| Class | Purpose |
|---|---|
| `screen-stack` | Vertical screen wrapper |
| `screen-eyebrow` | Small overline label above title |
| `screen-title` | Screen `<h1>` |
| `screen-description` | Muted supporting paragraph (reused across app) |
| `docs-layout` | Two-column: nav + content |
| `docs-nav`, `docs-nav__section`, `docs-nav__label`, `docs-nav__item` | Doc sidebar (`__item` has `data-active`) |
| `docs-content` | Right doc pane |
| `docs-article`, `docs-article__head`, `docs-article__title` | Per-component doc |
| `docs-preview`, `docs-preview--hero` | Live preview box (`--hero` = first/large look) |
| `docs-section`, `docs-section__title` | "Use me" / "Variations" sections |
| `docs-block`, `docs-label` | Labeled block (Import / Parameters) |
| `docs-example`, `docs-example__title` | One variation demo |
| `docs-muted` | Muted inline note |
| `props-table`, `props-table-wrap`, `props-table__name`, `props-table__req` | Props table (`__req` = red required `*`) |

---

## 5. Shared layout / utility classes

Used across previews and screens for arranging content:

| Class | Purpose |
|---|---|
| `gallery-row` | Horizontal row of demo items (wraps) |
| `split-2` | Two-column split |
| `stat-grid` | Responsive grid of `StatCard`s |
| `preview-box` | Bordered box that centers a single preview |
| `nav-preview`, `nav-preview--left`, `nav-preview--top` | Frame for nav component previews |

---

## 6. Component Catalog

For each component: **import path**, **props**, and the **class names / `data-*` attributes** it renders (design hooks). `data-*` attributes drive visual state — style them as attribute selectors (e.g. `.badge[data-tone="success"]`).

---

### 6.1 Icon — `components/ui/Icon.tsx`
Inline SVG icon, `stroke="currentColor"` (inherits text color), default size `18`.

```tsx
import { Icon } from '../components/ui/Icon';
<Icon name="check" size={16} className="…" />
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `IconName` | — | Required |
| `size` | `number` | `18` | px (width & height) |
| `className` | `string` | — | e.g. `icon-spin` to animate |

**`IconName` set (21):** `activity`, `bar-chart`, `check`, `chevron-down`, `chevron-right`, `dashboard`, `edit`, `file`, `filter`, `link`, `list`, `list-ordered`, `loader`, `menu`, `palette`, `rss`, `settings`, `sparkle`, `trash`, `upload`, `x`.
**Utility class:** `icon-spin` — spins the icon (used with `loader`).

---

### 6.2 Button — `components/ui/Button.tsx`
```tsx
import { Button } from '../components/ui/Button';
<Button variant="primary">Confirm</Button>
```
| Prop | Type | Default |
|---|---|---|
| `variant` | `'default' \| 'primary' \| 'danger' \| 'ghost'` | `'default'` |
| `children` | `ReactNode` | required |
| `...props` | native button attrs (`onClick`, `disabled`, `type`) | — |

**Classes:** base `app-button`; modifiers `app-button--primary`, `app-button--danger`, `app-button--ghost` (default variant = base only). Can accept extra `className`.

---

### 6.3 IconButton — `components/ui/IconButton.tsx`
Square, icon-only button. Requires an accessible `label` (sets `aria-label` + `title`).
```tsx
import { IconButton } from '../components/ui/IconButton';
<IconButton label="Delete" className="icon-button--danger"><Icon name="trash" /></IconButton>
```
| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Required (a11y) |
| `children` | `ReactNode` | Usually one `<Icon/>` |
| `className` | `string` | Tone/shape modifiers |
| `...props` | native button attrs | — |

**Classes:** base `icon-button`; modifiers `icon-button--primary`, `icon-button--danger`, `icon-button--ghost`, `icon-button--flip` (mirrors icon, e.g. "previous" chevron).

---

### 6.4 Badge — `components/ui/Badge.tsx`
Small status pill.
```tsx
import { Badge } from '../components/ui/Badge';
<Badge tone="success">Active</Badge>
```
| Prop | Type | Default |
|---|---|---|
| `tone` | `'neutral' \| 'success' \| 'danger' \| 'warning' \| 'info'` | `'neutral'` |
| `children` | `ReactNode` | required |

**Class:** `badge` with **`data-tone="neutral|success|danger|warning|info"`**.

---

### 6.5 Card — `components/ui/Card.tsx`
Surface with an optional title header.
```tsx
import { Card } from '../components/ui/Card';
<Card title="Overview">…body…</Card>
```
| Prop | Type | Notes |
|---|---|---|
| `title` | `string` | Optional header |
| `children` | `ReactNode` | Body |

**Classes:** `app-card` › `app-card__header` › `app-card__title`; body `app-card__body`.

---

### 6.6 StatCard — `components/ui/StatCard.tsx`
KPI card: value, label, optional icon/trend/hint, preset tone or custom background.
```tsx
import { StatCard } from '../components/ui/StatCard';
<StatCard label="Total sources" value="1,240" icon="rss"
          trend={{ direction: 'up', value: '12%' }} hint="vs last month" />
```
| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | Required |
| `value` | `ReactNode` | — | Required |
| `hint` | `ReactNode` | — | Text under value |
| `icon` | `IconName` | — | Corner badge |
| `trend` | `{ direction: 'up'\|'down'; value: string }` | — | Green up / red down |
| `tone` | `'default'\|'primary'\|'success'\|'danger'\|'warning'\|'info'` | `'default'` | Preset bg |
| `background` | `string` | — | Custom bg (overrides tone; switches to light text) |

**Classes / hooks:** `stat-card` (+ `stat-card--filled` when tone≠default or custom bg) with **`data-tone`**; inner `stat-card__top`, `stat-card__label`, `stat-card__icon`, `stat-card__value`, `stat-card__foot`, `stat-card__trend` (**`data-dir="up|down"`**, up arrow uses `stat-card__trend-up`), `stat-card__hint`. Lay out multiples in `.stat-grid`.

---

### 6.7 CodeBlock — `components/ui/CodeBlock.tsx`
Code snippet with a copy button (label toggles "Copy" → "Copied").
```tsx
import { CodeBlock } from '../components/ui/CodeBlock';
<CodeBlock code={`<Button>Hi</Button>`} />
```
| Prop | Type |
|---|---|
| `code` | `string` (required) |

**Classes:** `code-block` › `code-block__copy` (button) + `code-block__pre` (`<pre><code>`).

---

### 6.8 Loading — `components/ui/Loading.tsx`
Centered spinner + message; sizeable area.
```tsx
import { Loading } from '../components/ui/Loading';
<Loading height={120}>Fetching sources…</Loading>
```
| Prop | Type | Default |
|---|---|---|
| `children` | `ReactNode` | `"Loading…"` |
| `width` | `number \| string` | — |
| `height` | `number \| string` | — (also sets min-height) |

**Classes:** `loading` (`role="status"`) › `loading__spinner` (holds `Icon.icon-spin`) + `loading__text`.

---

### 6.9 ProcessList — `components/ui/ProcessList.tsx`
Task list with live status; errored tasks reveal detail on hover/focus.
```tsx
import { ProcessList, type ProcessTask } from '../components/ui/ProcessList';
<ProcessList title="Background processes" tasks={tasks} />
```
| Prop | Type | Notes |
|---|---|---|
| `tasks` | `ProcessTask[]` | `{ id, label, status, error? }` |
| `title` | `string` | Optional heading |

`ProcessStatus = 'in-progress' | 'completed' | 'error'` → renders spinner / tick / cross.

**Classes / hooks:** `process-list` › `process-list__title`, `process-list__items` (`<ul>`) › `process-item` (**`data-status="in-progress|completed|error"`**) › `process-item__icon`, `process-item__label`, and either `process-item__status` or `process-item__error` (with `process-item__tip` tooltip).

---

### 6.10 AiScanLoader — `components/ui/AiScanLoader.tsx`
Animated document-scan loader for "applying AI theme" flows.
```tsx
import { AiScanLoader } from '../components/ui/AiScanLoader';
<AiScanLoader title="Scanning document…" subtitle="Applying AI theme" />
```
| Prop | Type | Default |
|---|---|---|
| `title` | `string` | `'Scanning document…'` |
| `subtitle` | `string` | `'Applying AI theme'` |

**Classes:** `ai-scan` (`role="status"`) › `ai-scan__stage` (file icon + `ai-scan__line` scan beam + `ai-scan__spark`), `ai-scan__title`, `ai-scan__sub`, `ai-scan__bar` (progress).

---

### 6.11 StepProgress — `components/ui/StepProgress.tsx`
Stepper / tabs with per-step status. **2 variants × 2 orientations = 4 looks.**
```tsx
import { StepProgress, type Step } from '../components/ui/StepProgress';
<StepProgress steps={steps} variant="timeline" activeStep={active}
              onStepClick={setActive} width={320} />
```
| Prop | Type | Default | Notes |
|---|---|---|---|
| `steps` | `Step[]` | — | `{ id, title, description?, status?, icon? }` |
| `activeStep` | `string` | — | Highlighted step id |
| `variant` | `'default' \| 'timeline'` | `'default'` | numbered/tick vs icon-tile + status badge |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | — |
| `onStepClick` | `(id) => void` | — | Makes steps clickable (tab behavior) |
| `width` | `number \| string` | — | Falls back to CSS min-width |

`StepStatus = 'completed' | 'error' | 'pending'` → tick / cross / number. Timeline variant also shows a `<Badge>` (success/danger/neutral).

**Classes / hooks:** `step-progress` (**`data-orientation`**, **`data-variant`**) › `step-progress__item` (**`data-active`**, **`data-status`**) › `step-progress__rail` (`step-progress__badge` + `step-progress__line`) + `step-progress__content` (button) or `step-progress__content--static`; inside: `step-progress__title-row`, `step-progress__title`, `step-progress__desc`; pending badge shows `step-progress__number`.

---

### 6.12 SidePanel — `components/ui/SidePanel.tsx`
Right-side slide-over drawer; closes on backdrop click / Esc / close button.
```tsx
import { SidePanel } from '../components/ui/SidePanel';
<SidePanel open={open} width="lg" title="Edit source"
           onClose={close} footer={<>…buttons…</>}>…</SidePanel>
```
| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | — | Required |
| `onClose` | `() => void` | — | Required |
| `children` | `ReactNode` | — | Body |
| `title` | `string` | — | Header |
| `width` | `'xs'\|'sm'\|'md'\|'lg'\|'xlg'` | `'md'` | 300 / 380 / 480 / 640 / 820 px |
| `footer` | `ReactNode` | — | Sticky footer |

**Classes / hooks:** `side-panel-overlay` (backdrop) › `side-panel` (`role="dialog"`, **`data-width`**) › `side-panel__head` (`side-panel__title` + close IconButton), `side-panel__body`, `side-panel__foot`.

---

### 6.13 ConfirmDialog — `components/ui/ConfirmDialog.tsx`
One modal for delete/save/edit confirmations — tone + icon driven.
```tsx
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
<ConfirmDialog open={open} tone="danger" icon="trash" title="Delete item?"
               description="…" confirmLabel="Delete"
               onConfirm={handleDelete} onCancel={close} />
```
| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | — | Required |
| `title` | `string` | — | Required |
| `description` | `ReactNode` | — | — |
| `tone` | `'danger' \| 'primary'` | `'primary'` | Badge + confirm color |
| `icon` | `IconName` | per tone (trash/check) | Badge icon |
| `confirmLabel` | `string` | `'Confirm'` | — |
| `cancelLabel` | `string` | `'Cancel'` | — |
| `loading` | `boolean` | `false` | Spinner on confirm; disables buttons |
| `onConfirm` / `onCancel` | `() => void` | — | Required |

**Classes / hooks:** `modal-overlay` › `modal` (`role="dialog"`) › `modal__header` (`modal__icon` **`data-tone="danger|primary"`** + `modal__title` + `modal__desc`), `modal__actions` (Cancel + Confirm buttons).

---

### 6.14 FileUpload — `components/ui/FileUpload.tsx`
Drag-and-drop upload box; each file shows name, live % (simulated), then size + delete.
```tsx
import { FileUpload } from '../components/ui/FileUpload';
<FileUpload multiple hint="PDF, DOCX, PNG up to 10MB" />
```
| Prop | Type | Default |
|---|---|---|
| `multiple` | `boolean` | `true` |
| `accept` | `string` | — |
| `hint` | `string` | `'PDF, DOCX, PNG up to 10MB'` |

**Classes / hooks:**
- Drop zone: `file-upload` › `file-upload__drop` (label, **`data-drag="true|false"`**) › `file-upload__drop-icon`, `file-upload__drop-title`, `file-upload__drop-hint`, hidden `file-upload__input`.
- List: `file-upload__list` › `file-item` (**`data-status="uploading|done"`**) › `file-item__icon`, `file-item__main` (`file-item__row` › `file-item__name` + `file-item__meta`; then `file-item__bar` progress **or** `file-item__done` label), and a ghost/danger delete IconButton.

---

### 6.15 RichTextEditor — `components/ui/RichTextEditor.tsx`
Dependency-free WYSIWYG (uses `contentEditable` + `document.execCommand`); emits HTML on change.
```tsx
import { RichTextEditor } from '../components/ui/RichTextEditor';
<RichTextEditor defaultValue="<h2>Notes</h2>" placeholder="Start typing…" onChange={setHtml} />
```
| Prop | Type | Default |
|---|---|---|
| `defaultValue` | `string` | `''` (initial HTML) |
| `placeholder` | `string` | `'Write something…'` |
| `minHeight` | `number` | `180` |
| `onChange` | `(html: string) => void` | — |

**Toolbar groups:** block (`H1`, `H2`, quote), inline (`B`, `I`, `U`, `S`), list/link (bullet, numbered, link, clear formatting).
**Classes / hooks:** `rte` › `rte__toolbar` (`rte__group` × 3 separated by `rte__divider`) › `rte__btn` (**`data-active`**, `aria-pressed`) ; editing surface `rte__area` (`contentEditable`, `data-placeholder`).

---

### 6.16 LeftNavigation — `components/reusable/LeftNavigation.tsx`
Collapsible app sidebar rendered from the exported `navigationSections` config.
```tsx
import { LeftNavigation, navigationSections, type ScreenId } from '../components/reusable/LeftNavigation';
<LeftNavigation activeItem={active} collapsed={false} onItemClick={setActive} />
```
| Prop | Type | Notes |
|---|---|---|
| `activeItem` | `ScreenId` | Highlighted item |
| `collapsed` | `boolean` | Icon-only rail |
| `onItemClick` | `(id: ScreenId) => void` | — |

**Structure & classes:**
```
aside.app-sidebar                         [data-collapsed]
├── .app-sidebar__brand
│   ├── .app-sidebar__logo                "M42"
│   └── .app-sidebar__brand-copy (title + subtitle)
├── .app-sidebar__content
│   └── .app-sidebar__section
│       ├── .app-sidebar__section-label
│       └── nav.app-sidebar__nav
│           └── button.app-sidebar__item  [data-active] › .app-sidebar__icon + label
└── .app-sidebar__footer
    └── .app-sidebar__user
        ├── .app-sidebar__avatar          "ST"
        └── .app-sidebar__user-copy (.app-sidebar__user-name + .app-sidebar__user-email)
```
`navigationSections` (edit to add screens): **Components** (`sparkle`) · section **Administration** → **Themes** (`palette`).

---

### 6.17 TopNavigation — `components/reusable/TopNavigation.tsx`
Header bar: sidebar toggle + `Title › Breadcrumb` trail.
```tsx
import { TopNavigation } from '../components/reusable/TopNavigation';
<TopNavigation title="Components" breadcrumb="Design system"
               collapsed={collapsed} onToggleSidebar={toggle} />
```
| Prop | Type | Notes |
|---|---|---|
| `title` | `string` | Bold current crumb |
| `breadcrumb` | `string` | Trailing crumb |
| `collapsed` | `boolean` | Drives toggle label |
| `onToggleSidebar` | `() => void` | — |

**Classes:** `app-topbar` › `app-topbar__left` (menu IconButton + `app-topbar__breadcrumb`) › `app-topbar__crumb` (current = `app-topbar__crumb--current`), `app-topbar__crumb-separator` (chevron), trailing `app-topbar__crumb`.

---

### 6.18 DataTable — `components/reusable/DataTable.tsx`
Generic table: custom cells, optional inline edit/delete, sort, multi-value filter, column resize, pagination.
```tsx
import { DataTable, type Column } from '../components/reusable/DataTable';
<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} pageSize={4}
           onSave={saveRow} onDelete={askDelete} />
```
| Prop | Type | Default | Notes |
|---|---|---|---|
| `columns` | `Column<Row>[]` | — | See column config below |
| `rows` | `Row[]` | — | `Row extends Record<string, unknown>` |
| `rowKey` | `(row) => string` | — | Unique id |
| `pageSize` | `number` | `5` | Rows per page |
| `emptyMessage` | `string` | `'No records to show.'` | — |
| `onSave` | `(row) => void` | — | Enables inline edit + adds action column |
| `onDelete` | `(row) => void` | — | Adds delete action (pair with `ConfirmDialog`) |

**`Column<Row>` config:** `key`, `header`, `width?`, `align?` (`left|center|right`), `editable?`, `render?(row)`, `isSortRequired?`, `isFilterRequired?`, `isHeaderFlexible?` (drag-resize).

**Classes / hooks:**
- Wrapper `data-table-wrap` › `table.data-table` (**`data-fixed`** when any column is resizable).
- Header cell `data-table__th` › sortable `data-table__th-label` with `data-table__sort` (**`data-active`**, `is-asc` when ascending) **or** static `data-table__th-text`.
- Filter: `data-table__filter-wrap` › `data-table__filter-btn` (**`data-active`**) › popover `data-table__filter` (`data-table__filter-head`, `data-table__filter-search`, `data-table__filter-list` › `data-table__filter-item` / `data-table__filter-empty`).
- Resize handle: `data-table__resize`.
- Body: rows carry **`data-editing`**; edit input `data-table__input`; empty state `data-table__empty`.
- Actions column: `data-table__actions-head` (header + cell) › `data-table__actions` (edit/save/cancel/delete IconButtons).
- Pagination: `table-pagination` › `table-pagination__info` + `table-pagination__pages` (prev IconButton `icon-button--flip`, `table-pagination__flip` › `page-btn` [**`data-active`**] / `page-ellipsis`, next IconButton).

---

## 7. `data-*` state hooks — quick index

Design these as attribute selectors (state-driven styling):

| Attribute | Values | Component(s) |
|---|---|---|
| `data-tone` | neutral / success / danger / warning / info / primary | Badge, StatCard, ConfirmDialog(`modal__icon`) |
| `data-status` | uploading·done / in-progress·completed·error / completed·error·pending | FileUpload item, ProcessList, StepProgress |
| `data-active` | true / false | sidebar item, docs-nav item, step item, rte button, filter/sort, page button |
| `data-collapsed` | true / false | app-sidebar |
| `data-orientation` | vertical / horizontal | StepProgress |
| `data-variant` | default / timeline | StepProgress |
| `data-width` | xs / sm / md / lg / xlg | SidePanel |
| `data-dir` | up / down | StatCard trend |
| `data-drag` | true / false | FileUpload drop zone |
| `data-editing` | true / false | DataTable row |
| `data-fixed` | true / false | DataTable |

---

## 8. How to reuse

1. **Import** the component from its path (see each entry's snippet).
2. **Wrap the app** in `<ThemeProvider>` (already done in `App.tsx`) so tokens resolve.
3. **Style against tokens**, not hard-coded colors — restyling is a token change.
4. **Copy the class structure** above when hand-building markup; the `data-*` hooks give you every visual state.
5. For **new screens**, add a `ScreenId`, register it in `LeftNavigation.navigationSections`, and render it from `Layout.renderScreen`.
