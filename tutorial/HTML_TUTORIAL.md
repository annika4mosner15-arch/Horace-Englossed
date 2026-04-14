# HTML Tutorial: Horace Englossed – index.html Breakdown

## Overview
The `index.html` file is a sophisticated digital edition of Horace's Carmen 1,12 with interactive features for manuscript viewing, text transcription, and medieval glosses. Below is a detailed, step-by-step explanation of every major section.

---

## 1. Document Type and HTML Root Element

```html
<!DOCTYPE html>
<html lang="la">
```

- **`<!DOCTYPE html>`**: Declares this as an HTML5 document. Must be the first line.
- **`<html lang="la">`**: The root element wrapping all content. The `lang="la"` attribute specifies the document is in Latin (la = Latin language code).

---

## 2. The Head Section

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Horace Englossed – Carmen 1,12</title>
    <link rel="stylesheet" href="css/style.css">
</head>
```

### Meta Tags:
- **`<meta charset="UTF-8">`**: Specifies character encoding. UTF-8 supports all languages, including Latin characters with diacritics.
- **`<meta name="viewport"...>`**: Makes the page responsive on mobile devices:
  - `width=device-width`: Uses device's full width
  - `initial-scale=1.0`: Sets initial zoom level to 100%

### Title Tag:
- **`<title>`**: Sets the text that appears in the browser tab. Readers see "Horace Englossed – Carmen 1,12"

### Stylesheet Link:
- **`<link rel="stylesheet" href="css/style.css">`**: Imports external CSS file for styling. `rel="stylesheet"` tells the browser this is a stylesheet.

---

## 3. Body: Header Section

```html
<header>
    <h1>Horace Englossed</h1>
    <p class="subtitle">A Digital Edition of Horace, Carmen 1,12 · VadSlg Ms. 312, Kantonsbibliothek St. Gallen (10th c.)</p>
</header>
```

- **`<header>`**: Semantic element for introductory content at the top of the page.
- **`<h1>`**: Main page heading (largest heading level, should appear once per page).
- **`<p class="subtitle">`**: Descriptive paragraph with class "subtitle" for CSS styling. Provides context about the manuscript source.

---

## 4. Navigation

```html
<nav aria-label="Main navigation">
    <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="#text">Text</a></li>
        <li><a href="#glosses">Glosses</a></li>
        <li><a href="imprint.html">About</a></li>
    </ul>
</nav>
```

- **`<nav>`**: Semantic element for navigation. `aria-label="Main navigation"` helps screen readers identify the navigation purpose.
- **`<ul>`**: Unordered (bulleted) list containing navigation items.
- **`<li><a>`**: List items with anchor links:
  - `href="index.html"`: Link to home page
  - `href="#text"`: Fragment identifier linking to element with `id="text"` on same page (jumps to the Text section)
  - `href="#glosses"`: Jumps to the Glosses section
  - `href="imprint.html"`: Links to About/imprint page

---

## 5. Page Wrapper Container

```html
<div class="page-wrapper">
    <!-- All main content goes here -->
</div>
```

- **`<div class="page-wrapper">`**: A generic container grouping the page layout. Used for CSS layout control (likely a flexbox or grid layout).

---

## 6. Controls Sidebar (Left Sidebar)

```html
<aside id="sidebar-controls" class="sidebar" aria-label="Display controls">
    <h2>Controls</h2>
    <div class="control-group">
        <label>
            <input type="checkbox" id="toggle-glosses" checked>
            Show Glosses
        </label>
    </div>
    <div class="control-group">
        <label>
            <input type="checkbox" id="toggle-abbreviations">
            Expand Abbreviations
        </label>
    </div>
    <div class="control-group">
        <label for="edition-mode">Edition Mode:</label>
        <select id="edition-mode">
            <option value="diplomatic">Diplomatic</option>
            <option value="normalized">Normalized</option>
        </select>
    </div>
</aside>
```

### Breakdown:
- **`<aside>`**: Semantic element for supplementary content (sidebar). `id="sidebar-controls"` allows JavaScript to target it.
- **`aria-label="Display controls"`**: Accessibility label for screen readers.
- **`<h2>Controls`**: Sidebar heading.

### Form Elements:
- **`<input type="checkbox">`**: Creates checkboxes. 
  - `id="toggle-glosses" checked`: Pre-checked by default (glosses shown on load)
  - `id="toggle-abbreviations"`: Unchecked by default
- **`<label>`**: Associates text with form controls for better UX and accessibility. Wrapping the `<input>` means clicking the text toggles the checkbox.
- **`<select>`**: Dropdown menu with two options:
  - `value="diplomatic"`: Shows text as it appears in manuscript
  - `value="normalized"`: Shows modernized/standardized text
- **`<option>`**: Individual dropdown choices.

---

## 7. Main Content Area

```html
<main id="text">
    <!-- Manuscript viewer and transcription go here -->
</main>
```

- **`<main>`**: Semantic element for dominant content. `id="text"` makes it a jump target for the "#text" navigation link.

---

## 8. Manuscript Image Viewer Section

```html
<section class="manuscript-viewer">
    <h2>Manuscript Images</h2>
    <p class="section-desc">VadSlg Ms. 312, Kantonsbibliothek St. Gallen, Switzerland</p>
    <div class="manuscript-image-container">
        <figure>
            <img class="manuscript-image"
                 src="https://www.e-codices.unifr.ch/loris/vad/vad0312/vad0312_e0007r.jpg/full/500,/0/default.jpg"
                 alt="Folio 7r – Horace Carmen 1,12 beginning, VadSlg Ms. 312"
                 onerror="this.parentElement.querySelector('.img-fallback').style.display='block'; this.style.display='none';">
            <p class="img-fallback" style="display:none;">
                [Folio 7r – view on
                <a href="https://www.e-codices.ch/en/list/one/vad/0312" target="_blank" rel="noopener">e-codices</a>]
            </p>
            <figcaption>Folio 7r – Carmen 1,12 begins</figcaption>
        </figure>
    </div>
</section>
```

### Elements:
- **`<section>`**: Groups related content (the manuscript viewer).
- **`<h2>`**: Section heading.
- **`<div class="manuscript-image-container">`**: Container for organizing images.

### Figure Element:
- **`<figure>`**: Semantic container for images with captions.
- **`<img>`**: Displays the manuscript image.
  - `src="..."`: URL to high-resolution manuscript image from e-codices repository
  - `alt="..."`: Alternative text for accessibility and if image fails to load
  - `onerror="..."`: JavaScript handler. If image fails to load, shows fallback link instead
- **`<p class="img-fallback">`**: Hidden by default (`style="display:none;"`), appears if image fails via the onerror handler
  - **`target="_blank"`**: Opens link in new tab
  - **`rel="noopener"`**: Security attribute preventing the opened page from accessing the `window.opener` object
- **`<figcaption>`**: Caption describing the image.

---

## 9. Text Transcription Section

```html
<section class="text-transcription">
    <h2>Transcription – <em>De laudibus deorum vel hominum</em> (Carmen 1,12)</h2>
    <div class="page-header">
        <span id="current-folio">Folio 7r</span>
        <progress id="page-progress" value="1" max="2" aria-label="Page progress"></progress>
        <span id="page-counter">Page 1 of 2</span>
    </div>
```

### Components:
- **`<h2>`**: Section heading with italicized Latin title using `<em>` (emphasis).
- **`<span id="current-folio">`**: Displays current folio number. Targeted by JavaScript to update dynamically.
- **`<progress>`**: HTML5 progress bar showing pagination:
  - `value="1"`: Current page (1)
  - `max="2"`: Total pages (2)
  - `aria-label="..."`: Accessibility description for screen readers
- **`<span id="page-counter">`**: Text showing "Page 1 of 2", updated by JavaScript.

---

## 10. Latin Text Content

```html
<div id="manuscript-text" class="latin-text">
    <p><strong>DE LAUDIBVS DEORVM VEL HOMINVM</strong></p>
    <p>Quem virũ aut heroa. lyra vel acri</p>
    <p>Tibia <span class="gloss-word" data-gloss-id="gloss-sumis">sumis</span> celebrare <span class="gloss-word" data-gloss-id="gloss-clyo">Clyo</span>:</p>
    <!-- More lines... -->
</div>
```

### Breakdown:
- **`<div id="manuscript-text">`**: Container for all Latin text. JavaScript uses this ID to manage content.
- **`<p>`**: Each line of poetry in its own paragraph.
- **`<strong>`**: Bold text for title.
- **`<span class="gloss-word" data-gloss-id="..."></span>`**: Special spans marking words that have glosses (explanations).
  - `class="gloss-word"`: CSS styling (likely highlights or makes clickable)
  - `data-gloss-id="gloss-sumis"`: Custom data attribute linking to corresponding gloss entry. The ID connects to a `<div class="gloss-item" data-gloss-id="gloss-sumis">` in the glosses sidebar.

---

## 11. Page Navigation Buttons

```html
<div class="page-navigation">
    <button id="prev-page" disabled aria-label="Previous page">&#8592; Previous</button>
    <button id="next-page" aria-label="Next page">Next &#8594;</button>
</div>
```

- **`<button>`**: Interactive buttons for pagination.
  - `id="prev-page"`: Target for JavaScript. `disabled` attribute starts disabled (can't go before page 1).
  - `id="next-page"`: Target for JavaScript navigation.
  - `aria-label="..."`: Accessibility labels for screen readers.
- **`&#8592;` and `&#8594;`**: HTML entities for left/right arrows (← and →).

---

## 12. Glosses Sidebar (Right Sidebar)

```html
<aside id="glossen-sidebar" class="sidebar sidebar-glosses">
    <h2 id="glosses">Glosses</h2>
    <div class="gloss-filter">
        <label for="gloss-type-filter">Filter:</label>
        <select id="gloss-type-filter">
            <option value="all">All types</option>
            <option value="explanation">Explanation</option>
            <option value="synonym">Synonym</option>
            <option value="commentary">Commentary</option>
            <option value="addition">Addition</option>
        </select>
    </div>
```

- **`<aside id="glossen-sidebar">`**: Right sidebar. `id="glossen-sidebar"` allows JavaScript to show/hide based on checkbox.
- **`<h2 id="glosses">`**: Sidebar heading with `id="glosses"` making it a jump target for the navigation link.
- **`<select id="gloss-type-filter">`**: Dropdown to filter glosses by type:
  - `all`: Show all glosses
  - `explanation`, `synonym`, `commentary`, `addition`: Specific gloss types

---

## 13. Gloss Items

```html
<div class="gloss-item" data-gloss-id="gloss-clyo">
    <h4 class="gloss-word">Clio</h4>
    <p class="gloss-type">explanation</p>
    <p class="gloss-content">una ex viiii Musis — one of the nine Muses; patron of lyric poetry</p>
</div>
```

### Structure:
- **`<div class="gloss-item">`**: Container for one gloss entry.
  - `data-gloss-id="gloss-clyo"`: Matches the ID in gloss-word spans in the main text. When a user clicks "Clio" in the text, this gloss is highlighted/displayed.
- **`<h4 class="gloss-word">`**: The word being glossed (Clio).
- **`<p class="gloss-type">`**: Type of gloss (explanation, synonym, etc.). Used for filtering.
- **`<p class="gloss-content">`**: The actual gloss text with English translation. The em-dash (—) separates Latin explanation from English.

---

## 14. Footer

```html
<footer>
    <p>
        Digital edition of Quintus Horatius Flaccus, <em>Opera</em> (Carmen 1,12)<br>
        Source: VadSlg Ms. 312, Kantonsbibliothek St. Gallen, Switzerland (10th century)<br>
        Images courtesy of
        <a href="https://www.e-codices.ch/en/list/one/vad/0312" target="_blank" rel="noopener">e-codices – Virtual Manuscript Library of Switzerland</a><br>
        DOI: <a href="https://doi.org/10.5076/e-codices-vad-0312" target="_blank" rel="noopener">10.5076/e-codices-vad-0312</a>
    </p>
    <p>&copy; 2026 Horace Englossed. All Rights Reserved.</p>
</footer>
```

- **`<footer>`**: Semantic element for page footer.
- **`<br>`**: Line break for formatting attribution information.
- **`<a href="..." target="_blank" rel="noopener">`**: Links to external sources:
  - `target="_blank"`: Opens in new tab
  - `rel="noopener"`: Security best practice
- **`&copy;`**: HTML entity for copyright symbol (©).

---

## 15. JavaScript Import

```html
<script src="js/main.js"></script>
```

- **`<script>`**: Loads the external JavaScript file that powers interactivity:
  - Show/hide glosses and abbreviations
  - Handle page navigation
  - Link gloss items to text highlights
  - Manage edition mode switching
- Placed at **end of `</body>`** for better performance (allows HTML to render before JS executes).

---

## Key Design Patterns in This HTML

### 1. **Semantic HTML5**
Uses meaningful tags (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<section>`) for better accessibility and SEO.

### 2. **Accessibility**
- `aria-label` attributes for screen readers
- `alt` text for images
- Proper `<label>` associations with form controls
- Semantic structure aids navigation

### 3. **Data Attributes**
- `data-gloss-id` connects glosses in the text to gloss definitions
- Custom data attributes are excellent for JavaScript to query elements

### 4. **Responsive Design**
- Meta viewport tag ensures mobile responsiveness
- External CSS (style.css) likely uses flexbox/grid for layout

### 5. **Linking and Navigation**
- Fragment identifiers (`#text`, `#glosses`) for internal page navigation
- Proper URL structure for external links

### 6. **Error Handling**
- `onerror` handler on images provides graceful fallback to e-codices link

---

## Summary

Your `index.html` is a well-structured digital humanities project combining:
- **Semantic HTML** for proper document structure
- **Accessibility features** for inclusive design
- **Interactive controls** for user engagement
- **Data-driven linking** connecting text to glosses
- **Professional attribution** to manuscript source and copyright

The interplay between HTML structure and CSS/JavaScript creates a rich reading experience for medieval Latin texts!