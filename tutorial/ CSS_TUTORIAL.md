# Horace Englossed CSS Style Guide

This document explains how the `style.css` file controls the look and feel of the Horace Englossed digital edition website.  
It provides a reference for contributors and helps you understand or extend the interface.

---

## 1. Base and Footer Styling

- **Body** uses a scholarly serif font, light background, and resets all margins and padding for a clean start.
- **Footer (`<footer>`), Impressum (`.impressum`):**
  - Footer appears at the bottom with a soft background, faint border, and generous padding.
  - `.impressum` inside the footer uses a small, faint font and centers the text, with gentle line spacing and letter spacing for readability.
  - Links in the impressum have a subtle color and underline hover effect.

---

## 2. Page Titles and Section Headings

- The **site title** in `<header> h1` is large, elegant, and centered, using 'Garamond' and a soft blue color.
- **Main section titles (`h2`)** are also centered, slightly smaller, with a brown accent color and even spacing above and below.

---

## 3. Button Styling

- **Buttons** have a rich brown background, white text, gentle rounding, larger padding, and a drop shadow for depth.
- On hover/focus, they lighten, and "press" with a scale effect.

---

## 4. Split-Screen Layout

- **`.tei-poem-split`** sets up Flexbox: poem left, TEI or manuscript right, with a visible gap.
- **`.tei-poem-column` and `.tei-code-column`** fill half the screen with a soft background, rounded edges, scrolling (if needed), and internal padding for comfort.
- On smaller screens (`max-width: 900px`), everything stacks vertically for mobile accessibility.

---

## 5. TEI Code Display

- **`.tei-code-column pre`**: Displays TEI XML in a readable, wrapped format with internal padding on a gently contrasted background.

---

## 6. Manuscript Images

- **`.ms-img-area`**: Lays out manuscript images vertically, each with a gap.
- **`.zoom-img-box` and its `<img>`**: Add zooming, nice borders, soft background, and rounded corners—ensuring that manuscript facsimiles are visually distinct from textual content and are easy to view.

---

## 7. Poem Lines, Glosses, and Metamarks

- **`.poem-line`**: Formats poem text lines in a classic font, with spacing for readability.
- **`.poem-gloss`**: For inline glosses or word explanations, styled with a yellow background, dashed border, and italic font for clarity, and a hover effect for engagement.
- **`.poem-metamark`**: For scholarly notation or special markup, using blue shades, bold small caps, and outlined for emphasis.

---

## 8. Responsiveness

- Using a media query, the layout adapts to smaller screens by stacking columns, setting widths to 100%, and removing fixed heights to keep everything readable and scrollable on mobile devices.

---

## How to Extend or Adapt

- **Add new annotation types** by copying `.poem-gloss` or `.poem-metamark` and changing color/style rules.
- **Modify the split view** by adjusting `.tei-poem-split` and the related columns.
- **Tweak the footer** for more/less prominence with `.impressum`.
- **Adjust font or background colors** site-wide by updating the relevant CSS selectors.

---

**This CSS ensures** every element is readable, scholarly, and responsive, creating an inviting digital edition for research, teaching, and casual exploration.

---
