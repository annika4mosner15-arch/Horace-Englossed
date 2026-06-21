Horace-Englossed: CSS Architecture & Style Guide
This document provides a comprehensive walkthrough of the project's styling system. The stylesheet is designed around a Mobile-First Responsive Workflow, meaning layout systems are optimized for small mobile screen dimensions by default and scale gracefully into multi-column desktop environments using media queries.

1. Global Setup & Typographic Foundations
These core styles set the visual tone of the digital edition, prioritizing an elegant, manuscript-adjacent aesthetic.

CSS
body {
    font-family: Georgia, 'Times New Roman', serif;
    background-color: #faf8f4;
    color: #333;
    margin: 0;
    padding: 0;
}
Typography: Uses classic serif typefaces (Georgia, Times New Roman) to evoke an academic, editorial feel fit for a digital humanities critique edition.

Colors: Utilizes a soft cream canvas color (#faf8f4) instead of a harsh pure white, reducing eye strain during long-form reading sessions.

CSS
.container {
    width: 100%;
    padding: 15px;
}
Layout Box: Serves as the global content wrapper. On mobile layouts, it stays full width with narrow margins to optimize text real estate.

2. Navigation Component (nav)
The header navigation is constructed using CSS Flexbox to accommodate dynamic counts of page links.

nav ul: Eliminates standard list bullets and turns the collection into a centered, flexible row. flex-wrap: wrap ensures that if navigation links overflow a small device viewport, they wrap cleanly to a new line instead of clipping off-screen.

nav a: Uses thick font treatments, a characteristic deep teal corporate hue (#22696b), and a 0.2s ease transition to smoothly change the background fill color when hovered or tabbed to via keyboards.

3. Structural Headers & Typographic Accents
CSS
header h1 {
    font-family: 'Garamond', Georgia, serif;
    font-size: 2.2em;
    letter-spacing: 0.07em;
    color: #365257;
    margin: 0 auto 0.3em auto;
}
header h1 & h2: Swaps main headings into a premium editorial font choice (Garamond). The properties include generous letter spacing (letter-spacing) to improve legibility and subtle warm earth tones (#365257 teal-gray and #4a2c2c wine-red) to categorize hierarchy.

4. Control Interface (Buttons & Interaction)
CSS
button {
    background-color: #4a2c2c;
    color: #fff;
    width: 100%;
    transition: background 0.18s, transform 0.12s;
}
button:hover, button:focus {
    background-color: #996633;
    transform: scale(1.02);
}
Mobile-First Buttons: Buttons span full wide blocks (width: 100%) by default on mobile platforms to provide easy-to-tap targets.

Micro-interactions: When hovered or focused, buttons shift colors smoothly to a warm tan tone and use a micro-scale transition (transform: scale(1.02)) to lift toward the user's focus point.

.button-row: Coordinates the multi-button layout, arranging controls vertically as a single column stacked block on mobile viewpoints.

5. Pure-CSS Tooltip Component
The glossary tooltip system is engineered to run automatically through markup parameters without depending on heavy third-party positioning libraries.

CSS
.tooltip-trigger {
    border-bottom: 1px dotted #8b0000;
    cursor: help;
    position: relative;
    display: inline-block;
}
Anchor: Tells the reader the word is interactive by giving it a custom help pointer (cursor: help) and a deep red dotted underline. Setting position: relative turns this phrase into the coordinates parent for the hidden bubble box.

CSS
.tooltip-trigger::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 130%;
    left: 0;
    width: 240px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease-in-out;
}
The Content Engine: content: attr(data-tooltip) automatically reads whatever descriptive definition text is assigned to the HTML element's data-tooltip attribute.

Left Alignment Fix: Setting left: 0 pushes the text container box to grow entirely toward the right margin. This ensures tooltips generated for terms on the absolute left edge of a text line never break past column bounds or get clipped out of sight.

Safety Mechanics: opacity: 0 keeps it hidden, while pointer-events: none makes sure the hidden box doesn't capture accidental mouse interaction clicks until hovered via .tooltip-trigger:hover::after.

6. The Split-View Layout System
This defines the core presentation layout used to cross-analyze text side-by-side with source materials.

CSS
.tei-poem-split {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
Mobile Stack: On mobile views, the split screen drops the side-by-side display and instead stacks columns vertically (flex-direction: column) to keep reading margins legible.

Panel Presentations: .tei-poem-column and .tei-code-column feature uniform parchment-like boxes featuring light borders (#e7dec7) and light shadows (box-shadow) to distinguish readable panes clearly.

7. TEI Markup Elements & Text Overlays
These selectors specifically format structural values outputted from parsed XML TEI tags:

.tei-code-column pre: Manages the raw XML inspection pane. Utilizes white-space: pre-wrap and word-break: break-word to guarantee long XML tag chains break nicely to a new line rather than pushing past box boundaries.

.zoom-img-box img: Controls manuscript facsimile assets, turning off pointer selection features (user-select: none; touch-action: none) so custom pan-and-zoom libraries can grab and maneuver images smoothly.

.line-translation: Offsets textual line translations, utilizing distinct light gray text stylings (#666) and indents (padding-left: 20px) to sit perfectly below the primary historical verse.

.poem-gloss: Implements styling for inline text annotations—highlighting entries with dynamic blue shades (#2a5080) over soft canvas fills (#fff9c4) inside a dashed perimeter border.

.poem-metamark: Styles administrative notes and copy markings. Features heavy weights, high contrast backgrounds (#bbdefb), and elegant small-caps visual modifications.

8. Responsive Breakpoints (Media Queries)
As viewports open up, media queries dynamically alter column architectures from mobile stacks into complex desktop layouts.

A. Tablet Viewports (min-width: 768px)
Container Limitations: Locks the core page column layout widths to a clean 720px max-width container centered on the monitor.

Control Panel Restructuring: Transforms control buttons away from block layout stacks into neat horizontal rows (flex-direction: row) with custom width allocations.

True Split Windows: Forces the poem panel and image panel to mount directly side-by-side (flex-direction: row). Both are assigned an exact fixed frame elevation of height: 600px with active overflow properties (overflow: auto), unlocking the synchronized scroll mechanics.

B. Desktop Viewports (min-width: 1024px)
Asymmetrical Columns: Maximizes desktop split-screen usability by prioritizing critical space allocations using flex weight coefficients:

.tei-poem-column is assigned flex: 2 (Gains 66.6% width space).

.tei-code-column is assigned flex: 1 (Gains 33.3% width space).

C. Large Display Viewports (min-width: 1440px)
Scale Expansions: Expands structural view containers to 1200px boundaries and elevates global legibility configurations (font-size: 1.1rem).

Ultrawide Adaptability: Updates structural flex proportions to accommodate widescreen displays (Poem: flex: 3 vs. Code/Image: flex: 2).
