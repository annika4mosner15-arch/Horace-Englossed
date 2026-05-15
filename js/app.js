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
            // SECTION for each file
            const section = document.createElement("section");
            section.style.marginBottom = "2em";

            // File name/title
            const title = document.createElement("h2");
            title.textContent = file.name;
            section.appendChild(title);

            // Gloss toggle button and poem container
            const glossesBtn = document.createElement("button");
            glossesBtn.textContent = "Show glosses and metamarks";
            section.appendChild(glossesBtn);

            const poemContainer = document.createElement("div");
            poemContainer.className = "poem-container";
            section.appendChild(poemContainer);

            // TEI code toggle (optional: keep if you want to show full XML)
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

            // Fetch and process XML file
            fetch(file.download_url)
                .then(res => res.text())
                .then(xmlText => {
                    // FULL TEI (for TEI code toggle)
                    teiPre.textContent = xmlText;

                    let poemHtmlLines = [];
                    try {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

                        // Find all lines <l> (adapt this if you use other tag names)
                        const lines = Array.from(xmlDoc.getElementsByTagNameNS("*", "l"));
                        // If you use a different element for lines, modify above selector

                        // Build both plain and with-gloss-version lines for toggling
                        poemHtmlLines = lines.map(lTag => {
                            // Recursively render line
                            function processNode(node, showGloss) {
                                if (node.nodeType === Node.TEXT_NODE) {
                                    return escapeHtml(node.textContent);
                                }
                                if (node.nodeType === Node.ELEMENT_NODE) {
                                    const tag = node.tagName.toLowerCase();
                                    if (tag.includes("note")) {
                                        return showGloss 
                                            ? `<span class="poem-gloss">(${escapeHtml(node.textContent)})</span>` 
                                            : "";
                                    }
                                    if (tag.includes("metamark")) {
                                        return showGloss 
                                            ? `<span class="poem-metamark">${escapeHtml(node.textContent)}</span>`
                                            : "";
                                    }
                                    // For all other elements: descend recursively
                                    let html = "";
                                    node.childNodes.forEach(child => {
                                        html += processNode(child, showGloss);
                                    });
                                    return html;
                                }
                                return "";
                            }
                            return {
                                plain: processNode(lTag, false),
                                withGloss: processNode(lTag, true)
                            }
                        });

                        // Render function
                        function renderPoem(glossMode = false) {
                            poemContainer.innerHTML = "";
                            poemHtmlLines.forEach(line => {
                                const lineDiv = document.createElement("div");
                                lineDiv.className = "poem-line";
                                lineDiv.innerHTML = glossMode ? line.withGloss : line.plain;
                                poemContainer.appendChild(lineDiv);
                            });
                        }

                        // Initial render: glosses/metamarks hidden
                        renderPoem(false);

                        // Glosses button logic
                        let glossesVisible = false;
                        glossesBtn.onclick = function() {
                            glossesVisible = !glossesVisible;
                            renderPoem(glossesVisible);
                            glossesBtn.textContent = glossesVisible ? "Hide glosses and metamarks" : "Show glosses and metamarks";
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

// Helper to escape for safe HTML
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
