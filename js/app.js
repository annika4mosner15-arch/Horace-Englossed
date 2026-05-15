// Name: tei-viewer.js
// Simple script to list and display TEI XML files from the 'data' folder of your GitHub repository

const owner = "annika4mosner15-arch";
const repo = "Horace-Englossed";
const dataPath = "data";
const filesApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}`;

const fileListContainer = document.getElementById("file-list");
const fileContentContainer = document.getElementById("file-content");

// Helper: create element & set text/content
function el(tag, text) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    return node;
}

// Fetch list of files in data/
fetch(filesApiUrl)
    .then(res => res.json())
    .then(files => {
        files
            .filter(file => file.name.endsWith(".xml"))
            .forEach(file => {
                const btn = el("button", file.name);
                btn.addEventListener("click", () => fetchAndDisplayFile(file.download_url));
                fileListContainer.appendChild(btn);
            });
    })
    .catch(err => {
        fileListContainer.textContent = "Failed to load file list.";
        console.error(err);
    });

// Fetch and display file content
function fetchAndDisplayFile(url) {
    fetch(url)
        .then(res => res.text())
        .then(xmlText => {
            fileContentContainer.textContent = xmlText; // Display raw TEI XML
            // or: fileContentContainer.innerText = xmlText;
        })
        .catch(err => {
            fileContentContainer.textContent = "Failed to load file.";
            console.error(err);
        });
}

/*
 * In your HTML, ensure you have:
 * <div id="file-list"></div>
 * <pre id="file-content"></pre>
 */
