const owner = "annika4mosner15-arch";
const repo = "Horace-Englossed";
const dataPath = "data";
const filesApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}`;

const fileContentContainer = document.getElementById("file-content");

// Utility: Map a TEI file to its associated manuscript image names
function getImageNamesForTei(teiFile) {
    return ["010.jpg", "011.jpg"];
}

fetch(filesApiUrl)
    .then(res => res.json())
    .then(files => {
        const xmlFiles = files.filter(file => file.name.endsWith(".xml"));

        // Process each XML file with its content fetched in sequence
        return Promise.all(xmlFiles.map(file =>
            fetch(file.download_url)
                .then(res => res.text())
                .then(xmlText => ({ file, xmlText }))
        ));
    })
    .then(xmlDataArray => {
        // Now process all fetched XML files
        xmlDataArray.forEach(({ file, xmlText }) => {
            // ---- SECTION per poem/TEI file ----
            const section = document.createElement("section");
            section.style.marginBottom = "2em";

            // --- Button row (at top!) ---
            document.querySelector(".button-container button:nth-child(1)")
              .addEventListener("click", showGlosses);
            
            document.querySelector(".button-container button:nth-child(2)")
              .addEventListener("click", showTEI);
            
            document.querySelector(".button-container button:nth-child(3)")
              .addEventListener("click", showManuscript);
            
            // --- Title ---
            const title = document.createElement("h2");

            // --- Order: BUTTONS, TITLE, SPLIT VIEW ---
            section.appendChild(btnBox);
            section.appendChild(title);

            // --- Split view: poem | code/image column ---
            const split = document.createElement("div");
            split.className = "tei-poem-split";

            // Left: Poem column
            const poemColumn = document.createElement("div");
            poemColumn.className = "tei-poem-column";
            split.appendChild(poemColumn);

            // Right: TEI code or images
            const codeColumn = document.createElement("div");
            codeColumn.className = "tei-code-column";
            codeColumn.style.display = "none";
            
            // TEI code (hidden by default)
            const teiPre = document.createElement("pre");
            teiPre.style.display = "none";
            codeColumn.appendChild(teiPre);

            // Manuscript image area (hidden by default)
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

            // --- PROCESS XML (already fetched) ---
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

                    // Build (stack) both images, zoomable
                    imgArea.innerHTML = "";
                    const imageNames = getImageNamesForTei(file);
                    imageNames.forEach(name => {
                        // Build image URL directly without needing to search file list
                        const imgUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${dataPath}/${name}`;
                        
                        const imgContainer = document.createElement("div");
                        imgContainer.className = "zoom-img-box";
                        imgContainer.style.marginBottom = "1em";
                        imgContainer.style.background = "#f5f0e9";
                        imgContainer.style.border = "1px solid #e0d8cc";
                        
                        const img = document.createElement("img");
                        img.src = imgUrl;
                        img.alt = name;
                        img.style.width = "100%";
                        img.style.maxWidth = "100%";
                        img.style.height = "auto";
                        img.style.display = "block";
                        img.style.cursor = "grab";
                        imgContainer.appendChild(img);
                        imgArea.appendChild(imgContainer);

                        img.addEventListener('load', function () {
                            Panzoom(imgContainer, {
                                contain: 'outside',
                                maxScale: 8,
                                minScale: 1,
                                step: 0.07,
                                canvas: true,
                            });
                        });
                    });
                }

                teiBtn.onclick = function () {
                    if (!teiVisible) {
                        showTeiCode();
                    } else {
                        hideAllRight();
                    }
                };
                imgBtn.onclick = function () {
                    if (!imgVisible) {
                        showImages();
                    } else {
                        hideAllRight();
                    }
                };

                // --- Synced Scroll: Poem <--> codeColumn or ms images ---
                let programmaticScroll = false;
                poemColumn.addEventListener("scroll", function() {
                    if (!teiVisible && !imgVisible) return;
                    if (programmaticScroll) { programmaticScroll = false; return; }
                    const maxScroll = poemColumn.scrollHeight - poemColumn.clientHeight;
                    const percent = maxScroll ? poemColumn.scrollTop / maxScroll : 0;
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
