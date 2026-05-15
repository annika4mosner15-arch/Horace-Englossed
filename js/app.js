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

            // Use all <l> elements as lines
            const lines = Array.from(xmlDoc.getElementsByTagNameNS("*", "l"));

            // Plain & gloss views for each line:
            poemHtmlLines = lines.map(lTag => ({
                plain: renderLineWithGlosses(lTag, false),
                withGloss: renderLineWithGlosses(lTag, true)
            }));

            function renderPoem(glossMode = false) {
                poemContainer.innerHTML = "";
                poemHtmlLines.forEach(line => {
                    const lineDiv = document.createElement("div");
                    lineDiv.className = "poem-line";
                    lineDiv.innerHTML = glossMode ? line.withGloss : line.plain;
                    poemContainer.appendChild(lineDiv);
                });
            }

            // Helper: render an <l> line as HTML with/without glosses/metamarks
            function renderLineWithGlosses(node, showGloss) {
                let html = "";
                node.childNodes.forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) {
                        html += escapeHtml(child.textContent);
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        const tag = child.tagName.toLowerCase();
                        if (tag.includes("note")) {
                            html += showGloss
                                ? `<span class="poem-gloss">(${escapeHtml(child.textContent)})</span>`
                                : "";
                        } else if (tag.includes("metamark")) {
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
