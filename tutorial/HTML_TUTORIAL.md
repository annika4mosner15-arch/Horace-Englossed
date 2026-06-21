# Horace-Englossed: HTML5 Architecture & Document Structure
This document provides a detailed breakdown of the structural blueprint for the Horace Englossed platform. The codebase is written in semantic HTML5, prioritizing accessibility, standard search optimization patterns, and clear hooks for dynamic JavaScript integration.

# 1. Document Metadata & Document Configuration ()
The document header establishes document environments, loads typography networks, and imports critical external script drivers.
```
<meta charset="UTF-8">
<meta name="description" content="Digital scholarly edition of Horace, Carmen 1.12...">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
``` 
Encoding: Configures UTF-8 characters to guarantee Latin character accent features render perfectly without breakages.

Responsive Control: The viewport element configures an initial device scaling index factor of 1.0, ensuring mobile displays render content layout dimensions natively without forced desktop shrinking.

External Assets & Dependencies

```
<link href="[https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap](https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap)" rel="stylesheet">
<link href="[https://fonts.googleapis.com/css?family=EB+Garamond:700&display=swap](https://fonts.googleapis.com/css?family=EB+Garamond:700&display=swap)" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
<script src="[https://cdn.jsdelivr.net/npm/@panzoom/panzoom/dist/panzoom.min.js](https://cdn.jsdelivr.net/npm/@panzoom/panzoom/dist/panzoom.min.js)"></script>
```

Typography Engine: Imports Google Font packages synchronously—utilizing Open Sans for readability across operational controls and interface markers, while using EB Garamond for classical, premium heading layouts.

Style Sheet Binding: Hooks up your comprehensive external desktop styling systems (css/style.css).

Panzoom CDN Script: Pulls down the Panzoom engine resource link early. This library is required to let users click, grab, swipe, and zoom high-definition manuscript image fragments.

# 2. Embedded Document Style System ()
Your HTML document holds local internal canvas adjustments inside an embedded  element. These complement the external file layers with explicit target properties:

.container Layout Box: Restricts reading boundaries to a centered container (max-width: 900px) using margin: 3em auto, wrapping the document in a soft-edged container shadow.

pre Formatting Engine: Formats text components holding digital code outputs. Uses monospaced coding font structures (Fira Mono, Consolas) alongside horizontal scroll properties (overflow-x: auto) to protect layout bounds against text truncation.

Responsive Mobile Compression Query (@media (max-width: 700px)): A fallback rule to safely reduce typographical size tags and frame paddings when viewing text frames through compact device interfaces.

# 3. Structural Semantics & Page Architecture ()
The markup uses specific semantic landmarks instead of generic blocks (div). This makes the layout clear to web crawlers and accessible to assistive screen readers.

```
<nav aria-label="Main Navigation">
    <ul>
        <li><a href="#edition">Edition</a></li>
        <li><a href="#impressum">Impressum</a></li>
    </ul>
</nav>
```
Accessibility Flag: The aria-label="Main Navigation" attribute announces the correct semantic context to screen-reading assistive software.

# 4. Primary Content Module ()

```
<main id="edition">   
    <article>
        <h2>A Digital Edition of Horace, Carmen 1.12</h2>
        <div>
            <p>This digital edition presents...</p>
            <div id="file-content"></div>
            <script src="js/app.js" defer></script>
        </div>
    </article>
</main>
```

The Dynamic Engine Injection Hook (#file-content): This is the critical element for your digital project. This empty element serves as the physical insertion target for your script application loop. Your JavaScript parses the TEI XML file database behind the scenes and injects lines, tooltips, translations, and manuscript images right into this specific node.

Script Integration Driver (js/app.js): Contains the logical processing functions. The defer attribute ensures this controller file loads in background sequences, running safely after your text layouts have completely parsed.

# 5. Institutional Attribution & Metadata Frame ()
```
<footer id="impressum">
<a href="[https://creativecommons.org/licenses/by-nc-sa/4.0/](https://creativecommons.org/licenses/by-nc-sa/4.0/)" target="_blank">
```
    
Licensing Parameters: Configures standard academic distributions using the Creative Commons (CC BY-NC-SA 4.0) protocol parameters. Incorporating target="_blank" forces the link to execute outside the workspace in a separate web tab.

Glossary data and mythological commentary adapted from:
Horace. Odes and Epodes. Edited with commentary by Paul Shorey, revised by Paul Shorey and Gordon J. Laing. New York: Benj. H. Sanborn and Co., 1910.
Academic Provenance Registry: Tracks physical textbook commentary origins (Shorey & Laing 1910 commentary editions), preserving reference tracking pathways.

Institutional Alignment Registry: Documents your research position profiles and project contacts at the University of Graz, establishing the scholarly authority behind the digital edition.
