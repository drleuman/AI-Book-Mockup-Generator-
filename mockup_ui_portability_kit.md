# Mockup UI Portability Kit: “The Monolith” v2.4
## For `drleuman/AI-Book-Mockup-Generator-`

This kit adapts the Monolith v2.4 language used for Budget into the specific needs of the Mockup app.

The source app is a TypeScript Vite app generated from the Google Gemini AI Studio template. Its core flow is:
- upload a cover image
- configure book characteristics
- generate a single mockup or all previews
- review a gallery
- zoom, download, delete, or batch-download generated assets

---

## 1. PORTING OBJECTIVE

Do **not** treat Mockup like Budget with different labels.

Budget is a quote engine.
Mockup is a **visual generation workstation**.

That means the Monolith language must shift from:
- calculation certainty
to:
- creative control
- rendering status
- asset review
- output management

The UI should feel like a **render terminal for print-ready book visuals**, not a playful AI toy.

---

## 2. APP REALITY MAP

The current app structure centers around:
- `App.tsx` as the orchestration shell
- a top `Header`
- a left-side controls panel with upload, selects, numeric controls, color, and advanced options
- a right-side result zone using `GalleryDisplay`
- individual result cards via `MockupCard`
- helper primitives like `FileUpload`, `SelectInput`, `NumberInput`, `Button`, `ColorPicker`, `VisualSelect`, `ErrorDisplay`, and `ConfirmDialog`

The options currently include:
- binding type
- cover finish
- material texture
- spine width
- case wrap for hardcover
- background color
- book format
- perspective previews

The result model already distinguishes:
- single generated mockups
- preview generations
- perspective labels
- downloadable gallery assets

---

## 3. DESIGN DNA FOR MOCKUP

### Core feeling
This app should feel like:
- **industrial image generation**
- **editorial print visualization**
- **controlled rendering environment**

It should not feel like:
- generic SaaS dashboard
- dribbble-like AI art toy
- rounded “creator economy” interface

### Monolith constants kept intact
- 0px corners everywhere
- dark-first canvas
- signal red for key actions and active states
- strong typography hierarchy
- background separation over decorative lines
- sparse but intentional motion

### Mockup-specific interpretation
For Mockup, the Monolith tone must lean toward:
- **studio black**
- **gallery-grade previewing**
- **technical material selection**
- **render queue feedback**
- **asset-management clarity**

---

## 4. COLOR TOKENS FOR MOCKUP

Use the Budget foundation, but adapt semantic roles for a render/generation app.

```css
:root {
  --bg-primary: #131314;
  --bg-secondary: #0e0e0f;
  --bg-elevated: #1a1a1c;
  --bg-panel: rgba(255,255,255,0.03);
  --bg-preview-stage: #18181a;

  --accent-primary: #dc0000;
  --accent-hover: #ff0000;
  --accent-container: rgba(220,0,0,0.12);

  --text-primary: #e5e2e3;
  --text-secondary: #a1a1a8;
  --text-muted: #6d6d73;

  --border-subtle: rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.14);
  --border-active: rgba(220,0,0,0.3);

  --status-loading: rgba(255,255,255,0.18);
  --status-danger: rgba(220,0,0,0.18);
  --status-success: rgba(255,255,255,0.1);
}
```

### Semantic usage
- `--bg-primary`: global page canvas
- `--bg-secondary`: control modules
- `--bg-elevated`: inset metadata blocks and hover shifts
- `--bg-preview-stage`: the visual stage for images and gallery cards
- `--accent-primary`: generate, active option, focused state, selected visual tile
- `--status-danger`: destructive actions like delete/clear
- `--status-loading`: render progress surfaces

---

## 5. TYPOGRAPHY TOKENS

Use the same family logic as Budget, but tune hierarchy to support visual reviewing.

- **Display / H1**: `Manrope`, 800, slightly tight tracking  
  Use for page title, generation counts, empty state headlines.
- **Section Heading / H2**: `Manrope`, 700  
  Use for “Customize Your Mockup”, “Your Mockup Gallery”.
- **Technical Label**: `Space Grotesk`, 700–900, uppercase, tracked  
  Use for binding, finish, format, perspective, preview badges.
- **Body**: `Inter`, 400  
  Use for helper text, drag-and-drop guidance, loading descriptions.
- **Caption / Metadata**: `Space Grotesk`, 500  
  Use for card footers, dimensions, perspective labels, item counts.

### Tone rule
All language should read like a print tool:
- “Render”
- “Generate”
- “Preview”
- “Perspective”
- “Asset”
- “Output”
- “Material”
- “Finish”

Avoid fluffy AI phrasing.

---

## 6. LAYOUT SYSTEM FOR MOCKUP

## Desktop
Preferred structure:
- **2-column workstation**
- left: control stack
- right: gallery / preview review area

Recommended ratio:
- `420px` to `500px` fixed-ish control column
- flexible gallery column

### Why
The current product behavior is already a workstation pattern. Lean into it.
The user configures variables, then evaluates visual outputs. This is not a linear wizard.

## Mobile
Collapse into:
1. upload
2. essential options
3. advanced options accordion
4. action rail
5. gallery

Do not preserve decorative side-by-side cards on mobile if they compromise scanning speed.

### Spacing
- Outer page padding: `24px` mobile, `32px` tablet, `48px` desktop
- Control block padding: `24px`
- Gallery gap: `24px`
- Card internals: `20px`–`24px`

### Max width
- page container: `1440px`
- gallery inner width can stretch more aggressively than Budget because imagery benefits from width

---

## 7. SURFACE RULES

### Control Panel
Use a dense but premium surface:
- background: `--bg-secondary`
- no border radius
- no standard card border unless needed for separation
- use tonal stacking instead of line clutter

### Preview Stage / Gallery
Gallery must feel like a black review table:
- darker stage under the rendered image
- metadata and actions in a separate bottom strip
- hover state shifts to `--bg-elevated`
- selected / focused card gets subtle red edge logic

### Dialogs
Confirm dialogs should feel like system prompts:
- centered
- dark
- strict
- minimal color
- red reserved for destructive confirmation only

---

## 8. COMPONENT PORTABILITY MAP

### `Header`
Current role: lightweight title bar.

Port it to:
- a restrained Monolith masthead
- left-aligned identity
- optional small system badge like `VISUAL RENDER NODE`
- avoid oversized marketing hero behavior inside the app shell

### `FileUpload`
This becomes the **ingest module**.
It should feel like:
- file intake bay
- studio dropzone
- first technical checkpoint

Rules:
- use a sharp dashed or ghost boundary only if necessary
- when a cover exists, preview area becomes a stage, not a generic thumbnail
- show filename, dimensions if available, and replace action in a compact metadata strip

### `VisualSelect`
This is one of the most important components.
It should become a **selection tile grid** with:
- active red focus edge
- monochrome iconography by default
- red only when selected
- metadata labels in technical typography

Perfect for:
- binding type
- format
- perspective presets

### `SelectInput`
Standard dropdowns should be hardened into:
- dark field
- 0px corners
- stronger active ring
- compact labels
- no soft rounded consumer styling

### `NumberInput`
Spine width is a technical field.
It should look like equipment input, not a form control.
Support:
- larger numeric emphasis
- unit suffix if introduced later
- clear min/max context

### `ColorPicker`
The color picker should feel like **backdrop/stage control**.
This is not playful branding color selection.
Use:
- compact swatch + hex field treatment
- optional preview chip against dark stage

### `Button`
Buttons should split into four behaviors:
- **Primary Generate** → signal red
- **Secondary Generate All Previews** → dark with red text/border or elevated neutral
- **Utility Download All** → technical action style
- **Danger Clear All** → destructive rail action

### `GalleryDisplay`
This should become the strongest visual area in the product.
Three states:
- empty
- rendering
- populated gallery

The loading state should feel like a render queue.
The empty state should feel like a dormant output bay.
The populated state should feel like a controlled asset browser.

### `MockupCard`
This is not a casual gallery card.
It is an **output asset card**.

Structure:
- large image stage
- top badge strip for preview/state if needed
- lower metadata rail with perspective name
- tool cluster for zoom/download/delete
- stronger hover on action reveal

### `ErrorDisplay`
Render errors should be framed as system feedback:
- concise
- technical but readable
- visually separated from the creative gallery

### `ConfirmDialog`
Use assertive language:
- “Delete this asset?”
- “Clear the output gallery?”
Avoid friendly-soft modal tone.

---

## 9. APP-SPECIFIC STATE DESIGN

## Empty state
Current intent: “Your Mockups Will Appear Here.”

Ported behavior:
- dark stage with sparse center messaging
- one clear instructional line
- one supporting line
- optional technical ghost icon

Suggested tone:
- “Render output will appear here.”
- “Upload a cover, set the production variables, and generate the first asset.”

## Loading state
Current app cycles through generation messages.
That is worth preserving.

Porting rule:
- present loading as a **render pipeline**
- message cadence should feel intentional, not cute
- use spinner plus message plus micro-status strip
- optional queue count if batch previews are generating

Suggested structure:
- current stage line
- progress rail
- subtle secondary note

## Error state
Make the message clear, stable, and locally contained.
Do not let the whole UI feel broken because one generation failed.

## Success state
Treat each generated result as a controlled output artifact.
The gallery itself is the confirmation.

---

## 10. INTERACTION RULES

### Hover
- surface brightening
- subtle border activation
- no bouncy playful motion
- zoom/download/delete controls may emerge with sharper contrast

### Motion
- default timing: `0.24s` to `0.3s`
- avoid excessive floating or blur-heavy motion
- transitions should feel precise, like workstation tooling

### Focus
- strong visible focus ring in red-accent ghost logic
- keyboard navigation must remain obvious across tiles and card actions

### Destructive actions
Downloads can remain neutral.
Delete and clear must require confirmation.

---

## 11. MOCKUP-SPECIFIC ICONOGRAPHY

Recommended semantic icons:
- upload / ingest
- binding
- finish
- material
- format
- perspective
- render
- preview
- download
- delete
- zoom
- batch export

Style:
- thin or medium linear icons
- no cartoon or emoji-like metaphors
- keep them diagrammatic

---

## 12. CONTENT RULES

### Rewrite the language away from generic consumer app copy
Examples:

Instead of:
- “Customize Your Mockup”
Use:
- “Mockup Configuration”

Instead of:
- “Your Mockup Gallery”
Use:
- “Rendered Assets”

Instead of:
- “Generate All Previews”
Use:
- “Render All Perspectives”

Instead of:
- “Click to change or upload”
Use:
- “Replace source cover”
or
- “Upload or drop source cover”

### Good vocabulary
- source cover
- render
- perspective
- output
- asset
- material
- finish
- stage
- preview
- export

---

## 13. TAILWIND / CSS PRIMITIVES

```ts
// Suggested Tailwind direction
const monolithMockup = {
  page: "min-h-screen bg-[#131314] text-[#e5e2e3]",
  shell: "mx-auto max-w-[1440px] px-6 md:px-8 xl:px-12",
  workstation: "grid grid-cols-1 xl:grid-cols-[460px_minmax(0,1fr)] gap-6 xl:gap-8",
  panel: "bg-[#0e0e0f] p-6 md:p-8 border border-white/5",
  inset: "bg-white/[0.03] p-5 border border-white/5",
  stage: "bg-[#18181a] border border-white/8",
  title: "font-[Manrope] font-extrabold tracking-[-0.04em]",
  techLabel: "font-[Space_Grotesk] uppercase tracking-[0.16em] text-xs font-bold",
  body: "font-[Inter] text-sm md:text-base text-[#a1a1a8]",
  btnPrimary: "bg-[#dc0000] text-white uppercase tracking-[0.12em] font-extrabold px-6 py-4",
  btnSecondary: "bg-transparent text-[#dc0000] border border-[rgba(220,0,0,0.2)] uppercase tracking-[0.12em] font-bold px-6 py-4",
  btnUtility: "bg-white/[0.03] text-[#e5e2e3] border border-white/10 px-5 py-3",
  btnDanger: "bg-transparent text-[#dc0000] border border-[rgba(220,0,0,0.3)] px-5 py-3",
};
```

### Important
Keep `rounded-none` globally for all migrated surfaces and controls.

---

## 14. COMPONENT MAPPING: BUDGET → MOCKUP

- **Quote Config Card** → **Mockup Configuration Panel**
- **Technical Summary Panel** → **Source Cover / Material Specs Module**
- **Offer Cards** → **Rendered Asset Cards**
- **Calculation Status** → **Render Pipeline Status**
- **Export Actions** → **Batch Asset Export**
- **Diagnostic System Messaging** → **Generation / API / Render Feedback**

This is the conceptual bridge from the earlier Budget kit.

---

## 15. IMPLEMENTATION PRIORITY

### Phase 1 — Foundations
- sync Monolith tokens
- enforce 0px corners
- unify typography
- normalize dark surfaces

### Phase 2 — Workstation Shell
- rebuild `App.tsx` into a clean 2-column Monolith shell
- define control rail and output rail
- improve section headers and spacing

### Phase 3 — Core Inputs
- restyle `FileUpload`
- restyle `VisualSelect`
- restyle `SelectInput`, `NumberInput`, `ColorPicker`
- standardize button hierarchy

### Phase 4 — Output System
- redesign `GalleryDisplay`
- redesign `MockupCard`
- improve loading, empty, and error states
- tighten confirm dialogs and lightbox entry points

### Phase 5 — Language Polish
- rewrite labels and helper text to match technical rendering tone
- refine loading message cadence
- tighten metadata labels and export naming

---

## 16. NON-NEGOTIABLE RULES

- keep **0px corners**
- keep the app **dark-first**
- use red as a **signal**, not decoration
- do not overuse borders
- do not make the app feel “creative-tool playful”
- prioritize **clarity of render control** over ornamental UI
- treat outputs as **assets**, not casual gallery pictures

---

## 17. CERTIFIED TARGET OUTCOME

When the migration is done correctly, the Mockup app should feel like:

**“A premium black-box render workstation for book mockups, aligned with the PrintPrice Monolith system.”**

Not a template.
Not a toy.
Not generic AI SaaS.

It should feel native to the same family as Budget, but optimized for visual generation and asset review.
