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
            // ---- SECTION per poem/TEI file ----
            const section = document.createElement("section");
            section.style.marginBottom = "2em";

            // --- Title (filled in after loading XML) ---
            const title = document.createElement("h2");
            section.appendChild(title);

            // --- Button row at the top ---
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

            section.appendChild(btnBox);

            // --- Split view: poem | code ---
            const split = document.createElement("div");
            split.className = "tei-poem-split";

            // Poem column
            const poemColumn = document.createElement("div");
            poemColumn.className = "tei-poem-column";
            split.appendChild(poemColumn);

            // TEI code column (right, hidden by default)
            const codeColumn = document.createElement("div");
            codeColumn.className = "tei-code-column";
            codeColumn.style.display = "none";
            const teiPre = document.createElement("pre");
            codeColumn.appendChild(teiPre);
            split.appendChild(codeColumn);

            section.appendChild(split);

            fileContentContainer.appendChild(section);

            // --- FETCH/PROCESS XML for this file ---
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
                        // Only active when TEI code is visible
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
                            const maxScroll*

