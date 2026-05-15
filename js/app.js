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
            // Create a section for each poem/XML file
            const section = document.createElement("section");
            section.style.marginBottom = "2em";

            // File name/title for each poem
            const title = document.createElement("h2");
            title.textContent = file.name;
            section.appendChild(title);

            // Button for gloss/metamark toggling
            const glossesBtn = document.createElement("button");
            glossesBtn.textContent = "Show glosses and metamarks";
            section.appendChild(glossesBtn);

            // Container for the poem
            const poemContainer = document.createElement("div");
            poemContainer.className = "poem-container";
            section.appendChild(poemContainer);

            // Optional: Button and pre for the TEI code display
            const teiPre = document.createElement("pre");
            teiPre.style.display = "none"; // hidden by default
            section.appendChild(teiPre);

            const teiBtn = document.createElement("button");
            teiBtn.textContent = "Show TEI code";
            section.appendChild(teiBtn);

            let teiVisible = false;
            teiBtn.addEventListener("click", function() {
                teiVisible = !teiVisible;
                teiPre.style.display = teiVisible ? "block" : "none";
                teiBtn.textContent = teiVisible ? "Hide TEI code" : "Show TEI code";
            });

            fileContentContainer.appendChild(section);

            // --- PROCESS EACH TEI FILE ---
            fetch(file.download_url)
                .then(res => res.text())
                .then(xmlText => {
                    teiPre.textContent = xmlText; // always show raw code in TEI panel

                    let poemHtmlLines = [];

                    try {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
                        // Find all <ab> blocks (these group lines and glosses/metamarks)
                        const abs = Array.from(xmlDoc.getElementsByTagNameNS("*", "ab"));

                        // For each <ab>, process as a sequence
                        abs.forEach(ab => {
                            let block = []; // sequence of items in display order
                            Array.from(ab.childNodes).forEach(node => {
                                // Line (verse)
                                if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === "l") {
                                    block.push({
                                        type: "line",
                                        htmlPlain: renderLineWithGlosses(node, false),
                                        htmlWithGloss: renderLineWithGlosses(node, true)
                                    });
                                }
                                // Metamark or Note, not inside a line
                                else if (node.nodeType === Node.ELEMENT_NODE && (node.tagName.toLowerCase() === "note" || node.tagName.toLowerCase() === "metamark")) {
                                    // Display only when glosses are on
                                    let css = node.tagName.toLowerCase() === "note" ? "poem-gloss" : "poem-metamark";
                                    block.push({
                                        type: node.tagName.toLowerCase(),
                                        htmlPlain: "", // hidden when glosses are off
                                        htmlWithGloss: `<span class="${css}">${escapeHtml(node.textContent.trim())}</span>`
                                    });
                                }
                            });
                            // Add all this ab-block's lines and glosses to the main display array
                            poemHtmlLines.push(...block);
                        });

                        // Function: (re)render poem
                        function renderPoem(glossMode = false) {
                            poemContainer.innerHTML = "";
                            poemHtmlLines.forEach(part => {
                                if (!glossMode && part.type !== 'line') return; // Show only lines when glosses are off
                                if (part.type === "line") {
                                    const lineDiv = document.createElement("div");
                                    lineDiv.className = "poem-line";
                                    lineDiv.innerHTML = glossMode ? part.htmlWithGloss : part.htmlPlain;
                                    poemContainer.appendChild(lineDiv);
                                } else if (glossMode && part.type !== 'line') {
                                    // Insert gloss/metamark as its own line
                                    const div = document.createElement("div");
                                    div.className = part.type === "note" ? "poem-gloss" : "poem-metamark";
                                    div.innerHTML = part.htmlWithGloss;
                                    poemContainer.appendChild(div);
                                }
                            });
                        }

                        // Helper for rendering a line (<l>), including any inline gloss/metamark
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

                        // First render: glosses OFF
                        renderPoem(false);

                        // Button: toggle glosses/metamarks
                        let glossesVisible = false;
                        glossesBtn.onclick = function() {
                            glossesVisible = !glossesVisible;
                            renderPoem(glossesVisible);
                            glossesBtn.textContent = glossesVisible
                                ? "Hide glosses and metamarks"
                                : "Show glosses and metamarks";
                        };

                    } catch (e) {
                        poemContainer.textContent = "Could not extract poem lines.";
                    }
                })
                .catch(err => {
                    poemContainer.textContent = "Failed to load or parse file: " + file.name;
                });
        });
    })
    .catch(err => {
        fileContentContainer.textContent = "Failed to load file list.";
        console.error(err);
    });

// Helper to safely escape HTML
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
