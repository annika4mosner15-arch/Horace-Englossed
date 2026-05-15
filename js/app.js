const owner = "annika4mosner15-arch";
const repo = "Horace-Englossed";
const dataPath = "data";
const filesApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}`;

const fileContentContainer = document.getElementById("file-content");

// Fetch list of XML files in /data
fetch(filesApiUrl)
    .then(res => res.json())
    .then(files => {
        // Filter for .xml files
        const xmlFiles = files.filter(file => file.name.endsWith(".xml"));
        xmlFiles.forEach(file => {
            // Title for the file
            const section = document.createElement("section");
            section.style.marginBottom = "2em";

            const title = document.createElement("h2");
            title.textContent = file.name;
            section.appendChild(title);

            // Container for plain text and TEI code
            const plainDiv = document.createElement("div");
            section.appendChild(plainDiv);

            const teiPre = document.createElement("pre");
            teiPre.style.display = "none"; // hidden by default
            teiPre.style.background = "#f5f5f5";
            teiPre.style.border = "1px solid #ccc";
            teiPre.style.padding = "8px";
            section.appendChild(teiPre);

            // Toggle button
            const toggleBtn = document.createElement("button");
            toggleBtn.textContent = "Show TEI code";
            section.appendChild(toggleBtn);

            let teiVisible = false;
            toggleBtn.addEventListener("click", () => {
                teiVisible = !teiVisible;
                teiPre.style.display = teiVisible ? "block" : "none";
                toggleBtn.textContent = teiVisible ? "Hide TEI code" : "Show TEI code";
            });

            fileContentContainer.appendChild(section);

            // Fetch and process XML
            fetch(file.download_url)
                .then(res => res.text())
                .then(xmlText => {
                    // Show raw TEI XML in <pre>
                    teiPre.textContent = xmlText;

                    // Parse XML and get the plain text version
                    let plainText = "";
                    try {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
                        // Try to get <body> in any namespace
                        let body = xmlDoc.getElementsByTagNameNS("*", "body")[0];
                        if (!body) {
                            // Try <text>
                            body = xmlDoc.getElementsByTagNameNS("*", "text")[0];
                        }
                        if (body) {
                            plainText = getTextFromNode(body).trim();
                        } else {
                            plainText = xmlDoc.documentElement.textContent.trim();
                        }
                    } catch (e) {
                        plainText = "(Plain text could not be extracted)";
                    }
                    // Helper: Recursively extract only text
                    function getTextFromNode(node) {
                        let text = "";
                        for (let child of node.childNodes) {
                            if (child.nodeType === Node.TEXT_NODE) text += child.textContent;
                            if (child.nodeType === Node.ELEMENT_NODE) text += getTextFromNode(child);
                        }
                        return text;
                    }
                    plainDiv.textContent = plainText;
                })
                .catch(err => {
                    plainDiv.textContent = "Failed to load or parse file: " + file.name;
                    teiPre.textContent = "";
                });
        });
    })
    .catch(err => {
        fileContentContainer.textContent = "Failed to load file list.";
        console.error(err);
    });

/*
 * HTML required:
 * <div id="file-content"></div>
 */
