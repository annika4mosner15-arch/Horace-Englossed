const owner = "annika4mosner15-arch";
const repo = "Horace-Englossed";
const dataPath = "data";
const filesApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}`;

const fileContentContainer = document.getElementById("file-content");

fetch(filesApiUrl)
    .then(res => res.json())
    .then(files => {
        const xmlFiles = files.filter(file => file.name.endsWith(".xml"));
        xmlFiles.forEach(file => {
            // ---- SECTION for each poem/TEI file ----
            const section = document.createElement("section");
            section.style.marginBottom = "2em";

            // --- Title placeholder (set after parsing XML) ---
            const title = document.createElement("h2");
            section.appendChild(title);

            // --- Split view container ---
            const split = document.createElement("div");
            split.className = "tei-poem-split";

            // Poem column
            const poemColumn = document.createElement("div");
            poemColumn.className = "tei-poem-column";
            split.appendChild(poemColumn);

            // TEI code column (hidden by default)
            const codeColumn = document.createElement("div");
            codeColumn.className = "tei-code-column";
            codeColumn.style.display = "none";
            const teiPre = document.createElement("pre");
            codeColumn.appendChild(teiPre);
            split.appendChild(codeColumn);

            section.appendChild(split);

            // --- Control buttons ---
            const glossesBtn = document.createElement("button");
            glossesBtn.textContent = "Show glosses and metamarks";
            section.appendChild(glossesBtn);

            const teiBtn = document.createElement("button");
            teiBtn.textContent = "Show TEI code";
            section.appendChild(teiBtn);

            fileContentContainer.appendChild(section);

            // --- FETCH and PROCESS XML ---
            fetch(file.download_url)
                .then(res => res.text())
                .then(xmlText => {
                    teiPre.textContent = xmlText;

                    let poemHtmlLines = [];

                    try {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

                        // --- Set heading from <fw><hi>... ---
                        const hiEl = xmlDoc.querySelector('fw > hi');
                        title.textContent = hiEl ? hiEl.textContent.replace(/[\.·]$/, "").trim() : "";

                        // Find all <ab> blocks (these group lines and glosses/metamarks)
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

                        // ***** Button Toggle Logic *****
                        renderPoem(false);

                        let glossesVisible = false;
                        glossesBtn.onclick = function() {
                            glossesVisible = !glossesVisible;
                            renderPoem(glossesVisible);
                            glossesBtn.textContent = glossesVisible
                                ? "Hide glosses and metamarks"
                                : "Show glosses and metamarks";
                        };

                        // TEI code toggle (show/hide right column)
                        let teiVisible = false;
                        teiBtn.addEventListener("click", function() {
                            teiVisible = !teiVisible;
                            codeColumn.style.display = teiVisible ? "block" : "none";
                            teiBtn.textContent = teiVisible ? "Hide TEI code" : "Show TEI code";
                        });

                        // ***** Synchronized Scrolling *****
                        let programmaticScroll = false;
                        poemColumn.addEventListener("scroll", function() {
                            if (!teiVisible) return;
                            if (programmaticScroll) { programmaticScroll = false; return; }
                            const maxScroll = poemColumn.scrollHeight - poemColumn.clientHeight;
                            const percent = maxScroll ? poemColumn.scrollTop / maxScroll : 0;
                            const codeMaxScroll = codeColumn.scrollHeight - codeColumn.clientHeight;
                            programmaticScroll = true;
                            codeColumn.scrollTop = percent * codeMaxScroll;
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
