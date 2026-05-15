const owner = "annika4mosner15-arch";
const repo = "Horace-Englossed";
const dataPath = "data";
const filesApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}`;

const fileContentContainer = document.getElementById("file-content");

fetch(file.download_url)
    .then(res => res.text())
    .then(xmlText => {
        teiPre.textContent = xmlText;

        let poemHtmlLines = [];

        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "application/xml");
            // Find all <ab> blocks (groupings of lines + possible glosses/metamarks)
            const abs = Array.from(xmlDoc.getElementsByTagNameNS("*", "ab"));

            // For each <ab>, process as one block.
            abs.forEach(ab => {
                let block = []; // Each block is an array of {type, htmlPlain, htmlWithGloss}
                Array.from(ab.childNodes).forEach(node => {
                    // Verse line
                    if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === "l") {
                        block.push({
                            type: "line",
                            htmlPlain: renderLineWithGlosses(node, false),
                            htmlWithGloss: renderLineWithGlosses(node, true)
                        });
                    }
                    // Metamark or Note, not inside a line
                    else if (node.nodeType === Node.ELEMENT_NODE && (node.tagName.toLowerCase() === "note" || node.tagName.toLowerCase() === "metamark")) {
                        // Place metamarks/notes only when glosses are ON
                        let css = node.tagName.toLowerCase() === "note" ? "poem-gloss" : "poem-metamark";
                        block.push({
                            type: node.tagName.toLowerCase(),
                            htmlPlain: "", // hidden when gloss is off
                            htmlWithGloss: `<span class="${css}">${escapeHtml(node.textContent.trim())}</span>`
                        });
                    }
                    // Others (e.g. <seg>), possible: ignore or handle as needed – here we skip
                });
                poemHtmlLines.push(...block);
            });

            function renderPoem(glossMode = false) {
                poemContainer.innerHTML = "";
                poemHtmlLines.forEach(part => {
                    if (!glossMode && part.type !== 'line') return; // Only show gloss/metamark when toggle ON
                    if (part.type === "line") {
                        const lineDiv = document.createElement("div");
                        lineDiv.className = "poem-line";
                        lineDiv.innerHTML = glossMode ? part.htmlWithGloss : part.htmlPlain;
                        poemContainer.appendChild(lineDiv);
                    } else if (glossMode && part.type !== 'line') {
                        // For gloss/metamark, output inline after lines
                        const div = document.createElement("div");
                        div.className = part.type === "note" ? "poem-gloss" : "poem-metamark";
                        div.innerHTML = part.htmlWithGloss;
                        poemContainer.appendChild(div);
                    }
                });
            }

            // Helper: output a line <l>, recursively including seg, etc., always omitting gloss/metamarks unless children!
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

            renderPoem(false);

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

       
}
