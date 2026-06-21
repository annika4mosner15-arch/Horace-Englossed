const owner = "annika4mosner15-arch";
const repo = "Horace-Englossed";
const dataPath = "data";
const filesApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}`;

const fileContentContainer = document.getElementById("file-content");

// Utility: Map a TEI file to its associated manuscript image names
function getImageNamesForTei(teiFile) {
    return ["010.jpg", "011.jpg"];
}

let glossary = {};

// Load both the glossary and the GitHub file list at the same time safely
Promise.all([
    fetch('./data/glossary.json')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .catch(err => {
            console.warn("Glossary JSON failed to load or has a syntax typo. Tooltips will be empty, but files will still load.", err);
            return {}; 
        }),
    fetch(filesApiUrl)
        .then(res => res.json())
])
.then(([glossaryData, files]) => {
    glossary = glossaryData;

    const xmlFiles = files.filter(file => file.name.endsWith(".xml"));
    
    // Process each XML file with its content fetched in sequence
    return Promise.all(xmlFiles.map(file =>
        fetch(file.download_url)
            .then(res => res.text())
            .then(xmlText => ({ file, xmlText }))
    ));
    })
    .then(xmlDataArray => {
        xmlDataArray.forEach(({ file, xmlText }) => {
            // ---- SECTION per poem/TEI file ----
            const section = document.createElement("section");
            section.style.marginBottom = "2em";

            // --- Button row (at top!) ---            
            const btnBox = document.createElement("div");
            btnBox.className = "button-row";

            const glossesBtn = document.createElement("button");
            glossesBtn.textContent = "Show glosses and metamarks";
            btnBox.appendChild(glossesBtn);

            const expanBtn = document.createElement("button");   
            expanBtn.textContent = "Show expanded abbreviations";
            btnBox.appendChild(expanBtn);

            const transBtn = document.createElement("button");
            transBtn.textContent = "Show translation";
            btnBox.appendChild(transBtn);

            const teiBtn = document.createElement("button");
            teiBtn.textContent = "Show TEI code";
            btnBox.appendChild(teiBtn);

            const imgBtn = document.createElement("button");
            imgBtn.textContent = "Show manuscript";
            btnBox.appendChild(imgBtn);

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

            // --- PROCESS XML ---
            teiPre.textContent = xmlText;

            let poemHtmlLines = [];
            let glossesVisible = false;
            let expanMode = false;
            let transVisible = false; // Steuert den Anzeige-Zustand der Übersetzung
            let teiVisible = false;
            let imgVisible = false;
            let programmaticScroll = false;

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
                                node: node   
                            });
                        }
                        else if (node.nodeType === Node.ELEMENT_NODE &&
                                 (node.tagName.toLowerCase() === "note" || node.tagName.toLowerCase() === "metamark")) {
                            block.push({
                                type: node.tagName.toLowerCase(),
                                node: node
                            });
                        }
                    });
                    poemHtmlLines.push(...block);
                });

                // --- HILFSFUNKTION FÜR GLOSSEN UND METAMARKS ---
                function renderGlossWithExpansions(node) {
                    let html = "";
                    node.childNodes.forEach(child => {
                        if (child.nodeType === Node.TEXT_NODE) {
                            html += escapeHtml(child.textContent);
                        } else if (child.nodeType === Node.ELEMENT_NODE) {
                            const tag = child.tagName.toLowerCase();
                            if (tag === "choice") {
                                const abbr = child.querySelector("abbr");
                                const expan = child.querySelector("expan");
                                html += expanMode
                                    ? (expan ? escapeHtml(expan.textContent) : "")
                                    : (abbr ? escapeHtml(abbr.textContent) : "");
                            } else {
                                html += renderGlossWithExpansions(child);
                            }
                        }
                    });
                    return html;
                }

                // --- RENDER POEM FUNCTION ---
                function renderPoem(glossMode = false) {
                    poemColumn.innerHTML = "";
                    poemHtmlLines.forEach(part => {
                        if (!glossMode && part.type !== 'line') return;
                        
                        if (part.type === "line") {
                            const lineDiv = document.createElement("div");
                            lineDiv.className = "poem-line";
                            lineDiv.innerHTML = renderLineWithGlosses(part.node, glossesVisible);
                            poemColumn.appendChild(lineDiv);
                        } else if (glossMode && part.type !== 'line') {
                            const div = document.createElement("div");
                            const css = part.type === "note" ? "poem-gloss" : "poem-metamark";
                            div.className = css;
                            div.innerHTML = `<span class="${css}">${renderGlossWithExpansions(part.node).trim()}</span>`;
                            poemColumn.appendChild(div);
                        }
                    });
                }

                // --- RENDER LINES FUNCTION ---
                function renderLineWithGlosses(node, showGloss) {
                    let html = "";
                    let translationHtml = ""; 

                    node.childNodes.forEach(child => {
                        if (child.nodeType === Node.TEXT_NODE) {
                            html += escapeHtml(child.textContent);
                        } else if (child.nodeType === Node.ELEMENT_NODE) {
                            const tag = child.tagName.toLowerCase();

                            // ---- TEI choice (abbr / expan) ----
                            if (tag === "choice") {
                                const abbr = child.querySelector("abbr");
                                const expan = child.querySelector("expan");

                                html += expanMode
                                    ? (expan ? escapeHtml(expan.textContent) : "")
                                    : (abbr ? escapeHtml(abbr.textContent) : "");

                            // ---- gloss ----
                            } else if (tag === "note") {
                                html += showGloss
                                    ? `<span class="poem-gloss">(${renderGlossWithExpansions(child)})</span>`
                                    : "";

                            // ---- metamark ----
                            } else if (tag === "metamark") {
                                html += showGloss
                                    ? `<span class="poem-metamark">${renderGlossWithExpansions(child)}</span>`
                                    : "";

                            // ---- translation ----
                            } else if (tag === "seg" && child.getAttribute("type") === "translation") {
                                if (transVisible) {
                                    translationHtml = `<div class="line-translation">${escapeHtml(child.textContent.trim())}</div>`;
                                }

                            // =========================================================================
                            // 3. ADDED: Intercept your newly added <name> and <rs> elements for tooltips
                            // =========================================================================

                            // ---- tooltips / glossary names (name and rs) ----
                            } else if (tag === "name" || tag === "rs") {
                                const key = child.getAttribute("key");
                                const explanation = glossary[key] || `Definition for "${key}" not found.`;
                                const safeExplanation = escapeHtml(explanation);
                                const innerContent = renderLineWithGlosses(child, showGloss);
                                
                                
                                html += `<span class="tooltip-trigger" data-tooltip="${safeExplanation}">${innerContent}</span>`;                              
                             // ---- recursion ----
                            } else {
                                html += renderLineWithGlosses(child, showGloss);
                            }
                        }
                    });

                    return html + translationHtml;
                }
            

                // ***** RENDER poem initially *****
                renderPoem(glossesVisible);

                // --- Button Click Actions ---
                glossesBtn.onclick = function() {
                    glossesVisible = !glossesVisible;
                    renderPoem(glossesVisible);
                    glossesBtn.textContent = glossesVisible
                        ? "Hide glosses and metamarks"
                        : "Show glosses and metamarks";
                };

                expanBtn.onclick = function () {
                    expanMode = !expanMode;
                    renderPoem(glossesVisible);
                    expanBtn.textContent = expanMode
                        ? "Hide expanded abbreviations"
                        : "Show expanded abbreviations";
                };

                
                transBtn.onclick = function () {
                    transVisible = !transVisible;
                    renderPoem(glossesVisible);
                    transBtn.textContent = transVisible
                        ? "Hide translation"
                        : "Show translation";
                };

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

                    imgArea.innerHTML = "";
                    const imageNames = getImageNamesForTei(file);
                    imageNames.forEach(name => {
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
                    if (!teiVisible) { showTeiCode(); } else { hideAllRight(); }
                };
                imgBtn.onclick = function () {
                    if (!imgVisible) { showImages(); } else { hideAllRight(); }
                };

                // --- Synced Scroll ---
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

