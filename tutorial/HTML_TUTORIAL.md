# Horace Englossed — HTML Structure Tutorial

This document explains, in detail, the HTML structure for the "Horace Englossed" digital edition site. Reference it to understand how the main elements work, why they appear as they do, and where dynamic page content will be rendered.

---

## 1. Overall Structure

Your HTML is organized into these main blocks:
- **Header:** For the website's main title.
- **Edition Title:** For the current work/page.
- **Dynamic Content Area:** Where the verse, TEI code, and manuscript images appear (injected by JS).
- **Footer (Impressum):** For credits, contact information, licensing, and image source acknowledgement.

---

## 2. Annotated HTML Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Horace Englossed</title>
  <link rel="stylesheet" href="css/style.css">
  <!-- Panzoom library enables zooming manuscript images -->
  <script src="https://cdn.jsdelivr.net/npm/@panzoom/panzoom/dist/panzoom.min.js"></script>
</head>
<body>

  <!-- Site Header: Prominent project name, always visible at the top -->
  <header>
    <h1>Horace Englossed</h1>
  </header>

  <!-- Edition/Work Title: Indicates which text or poem is currently in view -->
  <h2>A Digital Edition of Horace, Carmen 1,12</h2>

  <!-- Main Dynamic Content Area:
       - This <div> is *empty* in the HTML and is populated by JavaScript (app.js)
       - It will contain the split-screen UI with: buttons, poem, glosses, TEI XML, and manuscript images
       - All user interaction and scholarly apparatus is rendered here -->
  <div id="file-content"></div>

  <!-- Footer (Impressum) — Professional, mandatory in many countries for scholarly and transparent web projects.
       - Contains licensing info, project credits, image source attribution, and contact
       - Uses <div> with specialized classes for styling and spacing -->
  <footer>
    <div class="impressum">
      <div>
        Content on this site is licensed under a
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">
          Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)
        </a>.
      </div>
      <div>
        Project by Annabelle Kienzl,
        <a href="mailto:annabelle.kienzl@uni-graz.at">annabelle.kienzl@uni-graz.at</a>,
        University of Graz, Department of Digital Humanities.<br>
        Manuscript images courtesy of
        <a href="https://www.e-codices.ch/en/list/one/vad/0312" target="_blank">
          e-codices – Virtual Manuscript Library of Switzerland
        </a>.
      </div>
      <div class="impressum-note">
        This is a scholarly, non-commercial project.<br>
        <span class="copyright">&copy; 2026 Annabelle Kienzl</span>
      </div>
      <div class="impressum-subtle">
        <em>
          If you have questions or feedback, contact us at <a href="mailto:annabelle.kienzl@uni-graz.at">annabelle.kienzl@uni-graz.at</a>.
        </em>
      </div>
    </div>
  </footer>

  <!-- Main JavaScript:
       - Controls all logic: split pane rendering, toggles, image zoom, etc.
       - Must be included at the end of <body> so the DOM is loaded first -->
  <script src="js/app.js"></script>
</body>
</html>
```

---

## 3. Explanation of Key Elements

- **`<header> <h1>...</h1> </header>`**  
  Displays the site-wide project title centered at the top of the page, styled for impact in the CSS.

- **`<h2>...</h2>`**  
  Under the header, this indicates the edition, manuscript, or poem currently displayed.  
  Only one per page by default, but can be adapted for multi-poem editions.

- **`<div id="file-content"></div>`**  
  **This is the main container for everything else** your reader sees:  
  - The poem text  
  - Buttons for toggling glosses/TEI/manuscript  
  - Side-by-side TEI and images (in a split view)  
  - All injected and managed by JavaScript for flexibility and interactivity

- **`<footer> ... </footer>`**  
  Holds the **impressum** (legal/project info), copyright, manuscript image
  attribution, and contact details.  
  Each `<div>` or `<span>` inside has its own class for refined styling.

---

## 4. Making Changes or Adding Features

- To add a different poem or edition, change the `<h2>` text and update your JavaScript content loader.
- To add disclaimers, alternate licenses, or additional attributions, insert new `<div>` blocks into the impressum/footer.
- For a navigation bar or links to other works, add a `<nav>` after (or inside) the header.

---

## 5. Why is so much content loaded by JavaScript?

This lets the app:
- Dynamically update what’s on the page (e.g. reveal glosses, switch between TEI and images, load multiple poems)
- Keep the HTML neat and minimal, with all logic and content population handled in one place (`app.js`)
- Easily expand the edition to include more poems or manuscript pages without rewriting HTML

---

**In short:**  
Your HTML provides a clean, semantic, and accessible scaffolding for your digital edition—the look, interactivity, and scholarly content is all enhanced and dynamically managed via CSS and JavaScript.
