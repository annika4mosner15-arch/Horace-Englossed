const owner = "annika4mosner15-arch";
const repo = "Horace-Englossed";
const dataPath = "data";
const filesApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}`;

const fileContentContainer = document.getElementById("file-content");

// Utility: Map a TEI file to its associated manuscript image names (can extend logic if desired)
function getImageNamesForTei(teiFile) {
    // For your current setup just return your manuscript page image filenames
    // (expand to adapt for other poems/manuscripts)
    return ["010.jpg", "011.jpg"];
}

fetch(filesApiUrl)
    .then(res => res.json())
    .then(files => {
        const xmlFiles = files.filter(file => file.name.endsWith(".xml"));
        // Get image files
        const imageFiles = files.filter(file =>
            file.name.toLowerCase().endsWith(".jpg") ||
            file.name.toLowerCase().endsWith(".jpeg") ||
            file.name.toLowerCase().endsWith(".jpf")
        );
        xmlFiles.forEach(file => {
            // ---- SECTION per poem/TEI file ----
            const section = document.createElement("section");
            section.style.marginBottom = "2em";

            // --- Button row (at top!) ---
            const btnBox = document.createElement("div");
            btnBox.style.display = "flex";
            btnBox.style.gap = "1em";
            btnBox.style.marginBottom = "1.3em";

            const glossesBtn = document.createElement("button");
            glossesBtn.textContent = "Show glosses and metamarks";
            btnBox.appendChild(glossesBtn);

            const teiBtn = document.createElement("button");
            teiBtn.textContent = "Show TEI code";
            btnBox.appendChild(teiBtn);

            const imgBtn = document.createElement("button");
            imgBtn.textContent = "Show manuscript";
            btnBox.appendChild(imgBtn);

            // --- Title ---
            const title = document.createElement("h2");

            // --- Order: BUTTONS, TITLE, SPLIT VIEW
            section.appendChild(btnBox);
            section.appendChild(title);

            // --- Split view: poem | code/image column ---
            const split = document.createElement("div");
            split.className = "tei-poem-split";

            // Poem column
            const poemColumn = document.createElement("div");
            poemColumn.className = "tei-poem-column";
            split.appendChild(poemColumn);

            // TEI code column (right, hidden unless TEI/image is active)
            const codeColumn = document.createElement("div");
            codeColumn.className = "tei-code-column";
            codeColumn.style.display = "none";
            // Two children, only one visible at a time:
            const teiPre = document.createElement("pre");
            teiPre.style.display = "none";
            codeColumn.appendChild(teiPre);

            const imgArea = document.createElement("div");
            imgArea.className = "ms-img-area";
            imgArea.style.display = "none";
            imgArea.style.height = "100%";
            imgArea.style.overflow = "auto";
            imgArea.style.position = "relative";
            codeColumn.appendChild(imgArea);

            split.appendChild(codeColumn);

            section.appendChild(split);

            fileContentContainer.appendChild(section);

            // --- FETCH AND PROCESS XML ---
            fetch(file.download_url)
                .then(res => res.text())
                .then(xmlText => {
                    teiPre.textContent = xmlText;

                    let poemHtmlLines = [];

                    try {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

                        // --- Set the title from <fw><hi>... ---
                        const hiEl = xmlDoc.querySelector('fw > hi');
                        title.textContent = hiEl ? hiEl.textContent.replace(/[\.·]$/, "").trim() : "";

                        // Find all <ab> blocks (group poem lines and gloss/metamark siblings)
                        const abs = Array.from(xmlDoc.getElementsByTagNameNS("*", "ab"));
                        abs.forEach(ab => {
                            let block = [];
                            Array.from(ab.childNodes).forEach(node => {
                                if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === "l") {
                                    block.push({
                                        type: "line",
                                        htmlPlain: renderLineWithGlosses(node, false),
                                        htmlWithGloss: renderLineWithGlosses(node, true)
                                    });
                                }
                                else if (node.nodeType === Node.ELEMENT_NODE &&
                                         (node.tagName.toLowerCase() === "note" || node.tagName.toLowerCase() === "metamark")) {
                                    let css = node.tagName.toLowerCase() === "note" ? "poem-gloss" : "poem-metamark";
                                    block.push({
                                        type: node.tagName.toLowerCase(),
                                        htmlPlain: "",
                                        htmlWithGloss: `<span class="${css}">${escapeHtml(node.textContent.trim())}</span>`
                                    });
                                }
                            });
                            poemHtmlLines.push(...block);
                        });

                        function renderPoem(glossMode = false) {
                            poemColumn.innerHTML = "";
                            poemHtmlLines.forEach(part => {
                                if (!glossMode && part.type !== 'line') return;
                                if (part.type === "line") {
                                    const lineDiv = document.createElement("div");
                                    lineDiv.className = "poem-line";
                                    lineDiv.innerHTML = glossMode ? part.htmlWithGloss : part.htmlPlain;
                                    poemColumn.appendChild(lineDiv);
                                } else if (glossMode && part.type !== 'line') {
                                    const div = document.createElement("div");
                                    div.className = part.type === "note" ? "poem-gloss" : "poem-metamark";
                                    div.innerHTML = part.htmlWithGloss;
                                    poemColumn.appendChild(div);
                                }
                            });
                        }

                        function renderLineWithGlosses(node, showGloss) {
                            let html = "";
                            node.childNodes.forEach(child => {
                                if (child.nodeType === Node.TEXT_NODE) {
                                    html += escapeHtml(child.textContent);
                                } else if (child.nodeType === Node.ELEMENT_NODE) {
                                    const tag = child.tagName.toLowerCase();
                                    if (tag === "note") {
                                        html += showGloss
                                            ? `<span class="poem-gloss">(${escapeHtml(child.textContent)})</span>`
                                            : "";
                                    } else if (tag === "metamark") {
                                        html += showGloss
                                            ? `<span class="poem-metamark">${escapeHtml(child.textContent)}</span>`
                                            : "";
                                    } else {
                                        html += renderLineWithGlosses(child, showGloss);
                                    }
                                }
                            });
                            return html;
                        }

                        // ***** RENDER poem initially (no glosses) *****
                        renderPoem(false);

                        // --- Lyric/Gloss buttons ---
                        let glossesVisible = false;
                        glossesBtn.onclick = function() {
                            glossesVisible = !glossesVisible;
                            renderPoem(glossesVisible);
                            glossesBtn.textContent = glossesVisible
                                ? "Hide glosses and metamarks"
                                : "Show glosses and metamarks";
                        };

                        // --- TEI/MS toggle logic ---
                        let teiVisible = false;
                        let imgVisible = false;

                        function showTeiCode() {
                            codeColumn.style.display = "block";
                            teiPre.style.display = "block";
                            imgArea.style.display = "none";
                            teiBtn.textContent = "Hide TEI code";
                            imgBtn.textContent = "Show manuscript";
                            teiVisible = true;
                            imgVisible = false;
                        }
                        function hideAllRight() {
                            codeColumn.style.display = "none";
                            teiPre.style.display = "none";
                            imgArea.style.display = "none";
                            teiBtn.textContent = "Show TEI code";
                            imgBtn.textContent = "Show manuscript";
                            teiVisible = false;
                            imgVisible = false;
                        }
                        function showImages() {
                            codeColumn.style.display = "block";
                            teiPre.style.display = "none";
                            imgArea.style.display = "block";
                            teiBtn.textContent = "Show TEI code";
                            imgBtn.textContent = "Hide manuscript";
                            teiVisible = false;
                            imgVisible = true;
                        }

                        teiBtn.onclick = function() {
                            if (teiVisible) {
                                hideAllRight();
                            } else {
                                showTeiCode();
                            }
                        };
                        imgBtn.onclick = function() {
                            if (imgVisible) {
                                hideAllRight();
                            } else {
                                showImages();
                            }
                        };

                        // --- Dynamically load images for this TEI (one at a time, with select) ---
                        const imageNames = getImageNamesForTei(file); // e.g. ["010.jpg", "011.jpg"]

                        imgArea.innerHTML = "";

                        // --- Page select control ---
                        const imgSelectBox = document.createElement("div");
                        imgSelectBox.style.display = "flex";
                        imgSelectBox.style.gap = "0.9em";
                        imgSelectBox.style.marginBottom = "1em";
                        imgSelectBox.style.alignItems = "center";

                        const imgLabel = document.createElement("label");
                        imgLabel.textContent = "Manuscript page: ";
                        imgLabel.htmlFor = `img-page-select-${file.name.replace(/[^a-zA-Z0-9]/g, "_")}`;

                        const imgSelect = document.createElement("select");
                        imgSelect.id = imgLabel.htmlFor;
                        imageNames.forEach((name, idx) => {
                            const opt = document.createElement("option");
                            opt.text = `Page ${idx + 1}`;
                            opt.value = name;
                            imgSelect.appendChild(opt);
                        });
                        imgSelectBox.appendChild(imgLabel);
                        imgSelectBox.appendChild(imgSelect);
                        imgArea.appendChild(imgSelectBox);

                        // --- Zoomable image container (only one at a time) ---
                        const imgContainer = document.createElement("div");
                        imgContainer.className = "zoom-img-box";
                        imgArea.appendChild(imgContainer);

                        // Helper: load image for a given filename
                        function showZoomImg(name) {
                            imgContainer.innerHTML = ""; // Remove previous image
                            const imgFile = imageFiles.find(f => f.name === name);
                            if (imgFile) {
                                const img = document.createElement("img");
                                img.src = imgFile.download_url;
                                img.alt = name;
                                img.style.display = "block";
                                img.style.width = "100%";
                                img.style.maxWidth = "100%";
                                img.style.maxHeight = "650px";
                                img.style.cursor = "grab";
                                imgContainer.appendChild(img);
                                img.addEventListener('load', function () {
                                    Panzoom(imgContainer, {
                                        contain: 'outside',
                                        maxScale: 8,
                                        minScale: 1,
                                        step: 0.07,
                                        canvas: true,
                                    });
                                });
                            } else {
                                imgContainer.textContent = "Image not found: " + name;
                                imgContainer.style.color = "#b33";
                            }
                        }
                        showZoomImg(imgSelect.value);
                        imgSelect.onchange = function () {
                            showZoomImg(imgSelect.value);
                        };

                        // --- Synced Scroll: Poem <--> codeColumn or ms image ---
                        let programmaticScroll = false;
                        poemColumn.addEventListener("scroll", function() {
                            if (!teiVisible && !imgVisible) return;
                            if (programmaticScroll) { programmaticScroll = false; return; }
                            const maxScroll = poemColumn.scrollHeight - poemColumn.clientHeight;
                            const percent = maxScroll ? poemColumn.scrollTop / maxScroll : 0;
                            // Choose which to sync to
                            let target = teiVisible ? codeColumn : imgArea;
                            const tgtMax = target.scrollHeight - target.clientHeight;
                            programmaticScroll = true;
                            target.scrollTop = percent * tgtMax;
                        });
                        codeColumn.addEventListener("scroll", function() {
                            if (!teiVisible) return;
                            if (programmaticScroll) { programmaticScroll = false; return; }
                            const maxScroll = codeColumn.scrollHeight - codeColumn.clientHeight;
                            const percent = maxScroll ? codeColumn.scrollTop / maxScroll : 0;
                            const poemMaxScroll = poemColumn.scrollHeight - poemColumn.clientHeight;
                            programmaticScroll = true;
                            poemColumn.scrollTop = percent * poemMaxScroll;
                        });
                        imgArea.addEventListener("scroll", function() {
                            if (!imgVisible) return;
                            if (programmaticScroll) { programmaticScroll = false; return; }
                            const maxScroll = imgArea.scrollHeight - imgArea.clientHeight;
                            const percent = maxScroll ? imgArea.scrollTop / maxScroll : 0;
                            const poemMaxScroll = poemColumn.scrollHeight - poemColumn.clientHeight;
                            programmaticScroll = true;
                            poemColumn.scrollTop = percent * poemMaxScroll;
                        });

                        // --- Show nothing on start (images/code) ---
                        hideAllRight();

                    } catch (e) {
                        poemColumn.textContent = "Could not extract poem lines.";
                    }
                })
                .catch(err => {
                    poemColumn.textContent = "Failed to load or parse file: " + file.name;
                });
        });
    })
    .catch(err => {
        fileContentContainer.textContent = "Failed to load file list.";
        console.error(err);
    });

function escapeHtml(s) {
    if (typeof s !== "string") return s;
    return s.replace(/[&<>"']/g, function(m) {
        return ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[m];
    });
}
