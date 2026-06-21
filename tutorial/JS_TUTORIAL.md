# Horace Englossed – Detailed JavaScript Code Tutorial

# 1. Overview: What does app.js do?
- Loads file information from the project’s GitHub repository using the GitHub REST API while simultaneously pulling down a local glossary.json file.
- Dynamically builds the split-screen interface: poem text on the left, right side switchable between raw TEI XML or zoom-enabled manuscript images.
- Implements interactive toggle controls for showing or hiding structural glosses/metamarks, expanded abbreviations, translations, and secondary window configurations.
- Utilizes an internal dictionary look-up pattern to parse <name> and <rs> data keys, outputting responsive, CSS-driven hovered tooltips safely.
- Establishes a double-binding synchronized scroll event engine across all three reading panes, tracking layouts with a positional lock flag.

# 2. Variable and Function Breakdown
Repository Parameters
JavaScript
```
const owner = "annika4mosner15-arch";
const repo = "Horace-Englossed";
const dataPath = "data";
const filesApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}`;
```
Purpose: Sets up parameters necessary to query your GitHub repo.
- owner is your GitHub username.
- repo is the repository’s name.
- dataPath is the subfolder in your repo where XML and images are stored.
- filesApiUrl constructs the API endpoint string to fetch the list of files stored at /data/.

Main Content Container
JavaScript
```
const fileContentContainer = document.getElementById("file-content");
```
Selects the <div id="file-content"> in your HTML.

Everything rendered by your script (poem, TEI, buttons, images) gets attached here.

Image-TEI Mapping Helper
JavaScript
```
function getImageNamesForTei(teiFile) {
    return ["010.jpg", "011.jpg"];
}
```
Purpose: Maps a TEI XML file to the relevant manuscript image filenames.

Explanation:

Currently hardcoded, always returns two specific manuscript JPEGs (["010.jpg", "011.jpg"]).

Dual Initial Fetching (Promise.all)
JavaScript
```
Promise.all([
    fetch('./data/glossary.json')
        .then(res => { ... })
        .catch(err => { ... }),
    fetch(filesApiUrl)
        .then(res => res.json())
])
.then(([glossaryData, files]) => { ... })
```
Purpose: Loads both the local glossary data definition file and the remote GitHub file list tracking arrays asynchronously at the same time.

Explanation:

Using Promise.all ensures the script waits for both files to download before trying to render anything.

It contains a safety fallback .catch routine for the glossary: if your JSON file fails to load or contains a formatting typo, it prints a console warning, falls back to an empty dictionary state {}, and allows the rest of the application to load the poems normally anyway.

Sequenced File Content Collection
JavaScript
```
return Promise.all(xmlFiles.map(file =>
    fetch(file.download_url)
        .then(res => res.text())
        .then(xmlText => ({ file, xmlText }))
));
```
Explanation: Loops over every filtered .xml file discovered in your repository, immediately triggering secondary sub-fetch operations to extract raw string text from each poem database context file.

Building Sections, Structural Elements, and Interactive State
JavaScript
```
const section = document.createElement("section");
const btnBox = document.createElement("div");
btnBox.className = "button-row";
```
Creates glossesBtn, expanBtn, transBtn, teiBtn, imgBtn ...
Explanation: Automatically generates isolated structural node wrappers for each individual poem card entity.

Element Flow Order: Adds a container component holding exactly five action controllers (button-row), appends a title header element, and hooks up the responsive side-by-side display framework components (tei-poem-split).

State Tracking Variables: Declares five local booleans (glossesVisible, expanMode, transVisible, teiVisible, imgVisible) and one engine flag (programmaticScroll) to handle layout states inside this unique section block.

Recursive Sub-Element Rendering Engine
JavaScript
```
function renderGlossWithExpansions(node) {
    // Loops child nodes recursively checking text components and tag criteria...
    if (tag === "choice") { ... }
}
```
Purpose: Traverses deeply nested XML element child arrays to assemble structured inline string representations cleanly. Handles your inline abbreviations seamlessly by checking the state of expanMode, revealing either the expanded text value (<expan>) or the original contracted form (<abbr>).

Normalized Content Processing & Glossary Hook Tooltips
JavaScript
```
else if (tag === "name" || tag === "rs") {
    const key = child.getAttribute("key");
    const explanation = glossary[key] || `Definition for "${key}" not found.`;
    const safeExplanation = escapeHtml(explanation);
    const innerContent = renderLineWithGlosses(child, showGloss);
    html += `<span class="tooltip-trigger" data-tooltip="${safeExplanation}">${innerContent}</span>`;
}
```
Purpose: Intercepts custom semantic elements (<name> and <rs>) during layout passes.

Explanation:

Reads the internal node attribute index field (key).

Matches the token against the globally initialized metadata glossary definition object dictionary.

Wraps the contents inside a clean interactive HTML span element (tooltip-trigger), setting the descriptive string string inside a data-tooltip attribute tag block for instant CSS hover action.

Dynamic Interactive Control Actions
JavaScript
```
glossesBtn.onclick = function() { ... };
expanBtn.onclick = function () { ... };
transBtn.onclick = function () { ... };
```
Explanation: Assigns active click listener handlers to each localized menu control button on user interface headers. Clicking triggers variable state inversion, updates button text configurations cleanly, and calls the re-render routines to draw matching inline layouts.

Multi-Column Canvas Views & Image Zoom Engine
JavaScript
```
function showImages() {
    // ... loops images, creates element frames ...
    Panzoom(imgContainer, { maxScale: 8, minScale: 1, canvas: true });
}
```
Explanation: Builds standard layout column structures (tei-code-column). If raw XML editing is activated, it sets code lines inside formatted layouts. If manuscript rendering is active, it runs automated generation sequences across targeted files, drawing elements safely and initiating the Panzoom touch interaction layer right after browser window load.

Bi-Directional Synchronized Scrolling Event Controllers
JavaScript
```
poemColumn.addEventListener("scroll", function() {
    if (programmaticScroll) { programmaticScroll = false; return; }
    // ... calculates position index percent factors and pushes target value adjustments ...
});
```
Purpose: Keeps the source transcription view on the left scrolling perfectly in sync with whichever analysis pane is open on the right.

Explanation: Calculates exactly how far down the user has scrolled as a percentage factor. To prevent infinite trigger loop collisions (where left scroll changes right scroll, which re-triggers left scroll forever), the script uses an interface flag state tracking toggle (programmaticScroll = true).

Text Security & Escaping Utility
JavaScript
```
function escapeHtml(s) { ... }
```
Purpose: Encodes raw special character nodes (&, <, >, ", ') directly into secure HTML character entity markers, eliminating script execution injection attacks or layout execution bugs.

# 3. Code Flow Summary (Step by Step)
- Constructs data endpoints and runs dual-fetch asynchronous lookup protocols simultaneously.
- Loads the local glossary data resource dictionary file safely while protecting script execution loops.
- Pulls file tracking metrics arrays straight from your GitHub repo data folder endpoints, filtering down list arrays into target collection categories.
- Iterates over structural files, executing download updates to extract structural raw text strings.
- Generates section frameworks sequentially for every item, pre-populating buttons, heading fields, and multi-pane split structural layouts.
- Parses the data using DOMParser to break up structural groupings, reading title fields, paragraph lines, translations, and nested abbreviation structures.
- Maps inline keywords directly against global glossary databases to generate tooltip layouts automatically.
- Binds local button click actions to switch views, handles Panzoom assignments on target elements, and locks view scroll positioning metrics tightly together in parallel.
