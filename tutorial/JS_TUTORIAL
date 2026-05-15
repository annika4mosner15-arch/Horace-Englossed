# Horace Englossed – Detailed JavaScript Code Tutorial

This guide walks through every part of `app.js`, including variable roles, function logic, data flow, and DOM manipulation. Use it to review what the code does or to clarify your answers in discussion.

---

## 1. **Overview: What does `app.js` do?**

- Loads file and image information from the project’s GitHub repository using the GitHub REST API.
- Dynamically builds the split-screen interface: poem on the left, right side switched between the TEI XML or manuscript images.
- Adds interactive buttons for toggling glosses/metamarks, and revealing/hiding TEI or manuscript.
- Handles loading, parsing, and rendering the TEI-XML, including glosses and metamarks.
- Loads, stacks, and zoom-enables manuscript images.
- Ensures responsive, accessible, and modular user interface with continuous user feedback.

---

## 2. **Variable and Function Breakdown**

### **Repository Parameters**

```js
const owner = "annika4mosner15-arch";
const repo = "Horace-Englossed";
const dataPath = "data";
const filesApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}`;
```
- **Purpose:** Sets up parameters necessary to query your GitHub repo.  
  - `owner` is your GitHub username.
  - `repo` is the repository’s name.
  - `dataPath` is the subfolder in your repo where XML and images are stored.
  - `filesApiUrl` constructs the API endpoint string to fetch the list of files stored at `/data/`.

---

### **Main Content Container**

```js
const fileContentContainer = document.getElementById("file-content");
```
- Selects the `<div id="file-content">` in your HTML.  
- Everything rendered by your script (poem, TEI, buttons, images) gets attached here.

---

### **Image-TEI Mapping Helper**

```js
function getImageNamesForTei(teiFile) {
    return ["010.jpg", "011.jpg"];
}
```
- **Purpose:** Maps a TEI XML file to the relevant manuscript image filenames.
- **Explanation:**  
  - Currently hardcoded, always returns two specific manuscript JPEGs (["010.jpg", "011.jpg"]).
  - Customizable: If you add more poems or manuscripts, you can extend this to map TEI files to their images.

---

### **Fetching Files from GitHub (The Core FETCH Process)**

```js
fetch(filesApiUrl)
  .then(res => res.json())
  .then(files => {
      // ... further processing code ...
  })
  .catch(err => {
      fileContentContainer.textContent = "Failed to load file list.";
      console.error(err);
  });
```

#### **How it works:**
- **`fetch(filesApiUrl)`**:  
  Initiates an HTTP GET request to the GitHub API URL you constructed (`https://api.github.com/repos/annika4mosner15-arch/Horace-Englossed/contents/data`).
  
- **`.then(res => res.json())`**:  
  Converts the response stream into JSON.  
  - The result: an array of file metadata objects (XML + images).
  
- **`.then(files => { ... })`**:  
  Works with the parsed file list. Splits them into XML files (Poems/TEI) and image files (manuscripts) by their extensions.
  
- **`.catch(err => { ... })`**:  
  If the initial fetch fails (e.g., bad path or network issue), this block sets an error message in the main content container and logs details for debugging.

---

### **Filtering Downloaded Files**

```js
const xmlFiles = files.filter(file => file.name.endsWith(".xml"));
const imageFiles = files.filter(file => file.name.toLowerCase().endsWith(".jpg") ||
                                        file.name.toLowerCase().endsWith(".jpeg") ||
                                        file.name.toLowerCase().endsWith(".jpf"));
```
- **Explanation:**
  - `xmlFiles`: filters and stores files that end with `.xml` (should be <i>1 per poem</i>).
  - `imageFiles`: filters images; case-insensitive matching for `.jpg`, `.jpeg`, `.jpf`.
  - Both arrays allow you to handle poems and manuscript images separately.

---

### **Building Section per Poem/TEI File**

#### **HTML Structure:**
For every TEI file:
1. Creates a new section.
2. Adds a button row (Show glosses/metamarks, Show TEI code, Show manuscript).
3. Adds a header `<h2>` for the poem title.
4. Adds a split-view layout:
   - Left: Poem with gloss/metamark support.
   - Right: Switchable area (TEI or manuscript images).

#### **Breakdown Example:**
```js
xmlFiles.forEach(file => {
    // Creates containers for section, buttons, title, split-view, poem, TEI code, and images
    // Appends all these to fileContentContainer (the DOM)
    // ...
});
```
<br/>

### **Fetching and Processing XML per Poem**

For each XML file in `xmlFiles`:

```js
fetch(file.download_url)
    .then(res => res.text())
    .then(xmlText => {
        teiPre.textContent = xmlText;
        // All further processing below
        // ...
    })
    .catch(err => { ... });
```
- **Second fetch:** Grabs and loads the XML content for each poem.
- **Why two fetch calls?**  
  - The first fetch grabs the list of files in /data.
  - The second fetch (per XML) loads each poem’s actual content (`file.download_url` is provided by the GitHub API).

---

#### **Parsing TEI XML and Displaying the Poem**

- Uses `DOMParser` to convert the XML string to a DOM object.
- Extracts the poem title from `<fw><hi>`.
- Finds each `<ab>` block (arbitrary block, often groups lines).
- For each `<ab>`, loops over child nodes:
  - For `<l>`: builds both a plain version and a version with gloss/metamarks exposed inline.
  - For `<note>` or `<metamark>` siblings: preps a gloss/metamark span for gloss mode.
- Stores each as an object in `poemHtmlLines` for efficient toggling later.

##### **Glosses and Metamarks Rendering**

- The code toggles glosses and metamarks using buttons.
- The logic lets you switch between a reading-friendly and a scholarship-detail mode.

---

### **Button Functionality**

- **Glosses Button:**  
  Toggles display of gloss and metamark spans in the poem. Also updates its own label ("Show" ↔ "Hide").
- **TEI/MS Toggle Buttons:**  
  Only one right pane is visible at any time. Clicking a button shows or hides the corresponding view (TEI code or manuscript images).

---

### **Rendering Manuscript Images (and Panzoom Integration)**

- The `showImages()` function prepares all relevant images for a given TEI file:
  - Searches `imageFiles` for matches.
  - For each image, builds a container and `<img>`, adds Panzoom for zooming/panning.
  - If an image is missing, displays a helpful error message.
- Optionally, appends an attribution or caption under all images.

---

### **Synchronized Scrolling**

- When you scroll one part (poem, TEI, or images), the corresponding section scrolls in sync.
- This uses event listeners and a flag (`programmaticScroll`) to prevent feedback loops between the sections.

---

### **Utility Function**

```js
function escapeHtml(s) { ... }
```
- Encodes special HTML characters to avoid rendering bugs or XSS/security issues.

---

## 3. **Code Flow Summary (Step by Step)**

1. **Builds GitHub API endpoint for repository data.**
2. **Fetches a list of all files in the /data directory.**
3. **Splits into XMLs (poems) and images.**
4. **For each XML:**
   - Creates UI containers (section, buttons, headers, columns).
   - Fetches and processes the poem's XML:
      - Extracts the title, poem lines, glosses, and metamarks.
      - Builds both plain and glossed versions of the poem.
   - Sets button logic to toggle glosses/metamarks, show/hide TEI or manuscript images.
   - Manuscript images are displayed in the right pane, zoom-enabled, with optional source captions.
   - Synchronizes scrolling between poem and whichever right pane is visible.
5. **If any fetch or parsing fails, shows an appropriate error message for the user.**

---

## 4. **Why This Approach?**

- **Fetches from GitHub**: Allows your edition data and images to live in the repo—no web server needed.
- **Dynamic DOM construction**: Maximizes flexibility (works for one or many poems).
- **Button-driven toggling**: Lets users switch between editions (poem-only, scholarly, facsimile) on the fly.
- **Separation of presentation** (CSS), **logic** (JS), and **content** (XML, images)—all real digital edition best practices.

---

## 5. **FAQs You Might Be Asked**

- **Why two fetches?**
  - First to get file list (so code works for multiple poems/manuscripts), second to actually load poem text for each one.
- **Why use DOMParser for the TEI?**
  - Easy to navigate XML with JS as a document tree; lets you extract elements robustly even if order varies.
- **How do you ensure accessibility?**
  - Buttons have clear text, headings are semantic, the split view collapses on mobile.
- **How would you add another poem/manuscript?**
  - Just drop its XML and images in `/data`; no HTML or JS changes needed unless mapping logic is customized.

---

## 6. **Where Can Things Go Wrong? (Debug Tips)**

- If **no poems or images appear**, check:
  - The GitHub file path,
  - That your repo is public,
  - That the browser isn’t blocking cross-origin requests.
- If **gloss toggle doesn’t work**, ensure your TEI contains `<note>` and `<metamark>` elements correctly.

---

**With this guide, you can explain all code logic, justify every design, and confidently answer detailed questions about your digital edition's frontend scripting.**
