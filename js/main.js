/* ========================================
   HORACE ENGLOSSED - MAIN SCRIPT
   Interactive Digital Edition
   TEI-XML Parser Version
   ======================================== */

/* ========================================
   1. APPLICATION STATE
   ======================================== */

const appState = {
  currentPage: 0,
  showGlosses: true,
  expandAbbreviations: false,
  editionMode: 'diplomatic', // 'diplomatic' or 'normalized'
  selectedGlosses: [],
  glossFilter: 'all',
  manuscriptData: null // Will be populated by XML parser
};

/* ========================================
   2. DOM ELEMENT REFERENCES
   ======================================== */

const domElements = {
  // Toggles
  toggleGlossesCheckbox: document.getElementById('toggle-glosses'),
  toggleAbbreviationsCheckbox: document.getElementById('toggle-abbreviations'),
  editionModeSelect: document.getElementById('edition-mode'),

  // Text Display
  manuscriptTextContainer: document.getElementById('manuscript-text'),

  // Page Navigation
  prevPageBtn: document.getElementById('prev-page'),
  nextPageBtn: document.getElementById('next-page'),
  currentFolioSpan: document.getElementById('current-folio'),
  pageProgressBar: document.getElementById('page-progress'),
  pageCounterSpan: document.getElementById('page-counter'),

  // Gloss Filter & Display
  glossFilterSelect: document.getElementById('gloss-type-filter'),
  glossesListContainer: document.getElementById('glosses-list')
};

/* ========================================
   3. TEI-XML PARSER
   ======================================== */

class TEIParser {
  constructor() {
    this.parser = new DOMParser();
  }

  /**
   * Load and parse TEI-XML from URL
   */
  async loadXML(url) {
    try {
      console.log('📖 Loading TEI-XML from:', url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const xmlText = await response.text();
      const xmlDoc = this.parser.parseFromString(xmlText, 'application/xml');

      if (xmlDoc.getElementsByTagName('parsererror').length) {
        throw new Error('XML Parsing Error');
      }

      console.log('✅ TEI-XML loaded successfully');
      return xmlDoc;
    } catch (error) {
      console.error('❌ Error loading XML:', error);
      domElements.manuscriptTextContainer.innerHTML = `<p>Error loading manuscript: ${error.message}</p>`;
      return null;
    }
  }

  /**
   * Parse TEI-XML and extract manuscript data
   */
  parseManuscript(xmlDoc) {
    console.log('🔍 Parsing manuscript data...');

    const manuscript = {
      metadata: this.extractMetadata(xmlDoc),
      pages: this.extractPages(xmlDoc),
      glosses: this.extractGlosses(xmlDoc),
      abbreviations: this.extractAbbreviations(xmlDoc)
    };

    console.log('✅ Parsing complete. Data:', manuscript);
    return manuscript;
  }

  /**
   * Extract manuscript metadata from teiHeader
   */
  extractMetadata(xmlDoc) {
    const title = xmlDoc.querySelector('titleStmt title')?.textContent || 'Untitled';
    const msIdentifier = xmlDoc.querySelector('msIdentifier');

    return {
      title: title,
      repository: msIdentifier?.querySelector('repository')?.textContent || '',
      collection: msIdentifier?.querySelector('collection')?.textContent || '',
      idno: msIdentifier?.querySelector('idno')?.textContent || '',
      settlement: msIdentifier?.querySelector('settlement')?.textContent || '',
      origDate: xmlDoc.querySelector('origDate')?.textContent || '',
      origPlace: xmlDoc.querySelector('origPlace')?.textContent || ''
    };
  }

  /**
   * Extract text pages/folios
   */
  extractPages(xmlDoc) {
    const pages = [];
    const body = xmlDoc.querySelector('body');

    if (!body) {
      console.warn('⚠️ No body element found in XML');
      return pages;
    }

    // Split content by <pb> (page break) elements
    const pageBreaks = Array.from(body.querySelectorAll('pb'));
    const absElements = Array.from(body.querySelectorAll('ab'));

    let currentPageIndex = 0;
    let currentPage = {
      id: `page-${currentPageIndex}`,
      folio: 'Unknown',
      pageBreak: null,
      text: [],
      lineElements: []
    };

    // Process page breaks and content
    pageBreaks.forEach((pb) => {
      if (currentPage.text.length > 0) {
        pages.push(currentPage);
        currentPageIndex++;
        currentPage = {
          id: `page-${currentPageIndex}`,
          folio: pb.getAttribute('n') || `Folio ${currentPageIndex}`,
          pageBreak: pb,
          text: [],
          lineElements: []
        };
      }
      currentPage.folio = pb.getAttribute('n') || currentPage.folio;
    });

    // Extract lines from <l> elements
    const lineElements = Array.from(body.querySelectorAll('l'));
    lineElements.forEach((lineEl, index) => {
      const lineId = lineEl.getAttribute('xml:id') || `line-${index}`;
      const lineContent = this.extractLineContent(lineEl);

      currentPage.text.push({
        id: lineId,
        content: lineContent,
        element: lineEl
      });
      currentPage.lineElements.push(lineEl);
    });

    // Add last page
    if (currentPage.text.length > 0) {
      pages.push(currentPage);
    }

    console.log(`✅ Extracted ${pages.length} pages`);
    return pages;
  }

  /**
   * Extract text content from a line element
   * Handles nested <seg> and other elements
   */
  extractLineContent(lineEl) {
    let content = '';

    lineEl.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        content += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'seg') {
          content += node.textContent;
        } else if (node.tagName === 'hi') {
          content += node.textContent;
        } else {
          content += node.textContent;
        }
      }
    });

    return content.trim();
  }

  /**
   * Extract glosses with their targets
   */
  extractGlosses(xmlDoc) {
    const glosses = [];
    const noteElements = Array.from(xmlDoc.querySelectorAll('note'));

    noteElements.forEach((noteEl, index) => {
      const target = noteEl.getAttribute('target');
      const type = noteEl.getAttribute('type') || 'commentary';
      const content = noteEl.textContent.trim();

      // Extract text content, handling <p> tags
      let glossContent = '';
      const pElement = noteEl.querySelector('p');
      if (pElement) {
        glossContent = pElement.textContent.trim();
      } else {
        glossContent = content;
      }

      if (target && glossContent) {
        const targetElement = xmlDoc.querySelector(`[xml\\:id="${target.substring(1)}"],[id="${target.substring(1)}"]`);

        if (targetElement) {
          const glossWord = targetElement.textContent.trim();

          glosses.push({
            id: `gloss-${index}`,
            target: target,
            word: glossWord,
            type: type,
            content: glossContent,
            targetElement: targetElement
          });
        }
      }
    });

    console.log(`✅ Extracted ${glosses.length} glosses`);
    return glosses;
  }

  /**
   * Extract abbreviations from encodingDesc
   */
  extractAbbreviations(xmlDoc) {
    const abbreviations = {};
    const interpretationNote = xmlDoc.querySelector('interpretation p');

    if (interpretationNote) {
      const text = interpretationNote.textContent;
      // Parse abbreviations from text like "ꝓ = pro; ꝑ = per/par; ..."
      const matches = text.match(/([ꝓꝑꝗꝙ÷⁊ꝰꝯꝵũãẽ])\s*=\s*([^;]+)/g);

      if (matches) {
        matches.forEach((match) => {
          const [abbr, exp] = match.split('=').map(s => s.trim());
          abbreviations[abbr] = exp;
        });
      }
    }

    // Fallback: hardcoded abbreviations if not found in XML
    if (Object.keys(abbreviations).length === 0) {
      Object.assign(abbreviations, {
        'ꝓ': 'pro',
        'ꝑ': 'per/par',
        'ꝗ': 'qui',
        'ꝙ': 'quod',
        '÷': 'est',
        '⁊': 'et/etiam',
        'ꝰ': 'us',
        'ꝯ': 'con',
        'ꝵ': 'rum',
        'ũ': 'um/us',
        'ã': 'am/as',
        'ẽ': 'em/es'
      });
    }

    console.log('✅ Abbreviations extracted:', abbreviations);
    return abbreviations;
  }
}

/* ========================================
   4. INITIALIZATION
   ======================================== */

async function init() {
  console.log('🚀 Initializing Horace Englossed...');

  // Load saved preferences from LocalStorage
  loadPreferences();

  // Parse TEI-XML
  const teiParser = new TEIParser();
  const xmlDoc = await teiParser.loadXML('data/De-laudibus-deorum-vel-hominum.xml');

  if (!xmlDoc) {
    console.error('❌ Failed to load XML');
    return;
  }

  // Parse manuscript data
  appState.manuscriptData = teiParser.parseManuscript(xmlDoc);

  // Check if data was loaded
  if (!appState.manuscriptData || appState.manuscriptData.pages.length === 0) {
    console.error('❌ No pages extracted from XML');
    domElements.manuscriptTextContainer.innerHTML = '<p>Error: No manuscript data found.</p>';
    return;
  }

  // Render initial content
  renderManuscriptText();
  renderGlosses();

  // Attach event listeners
  attachEventListeners();

  // Update UI
  updatePageNavigation();
  updateToggleStates();

  console.log('✅ Initialization complete');
}

/* ========================================
   5. RENDER FUNCTIONS
   ======================================== */

function renderManuscriptText() {
  if (!appState.manuscriptData || !appState.manuscriptData.pages[appState.currentPage]) {
    domElements.manuscriptTextContainer.innerHTML = '<p>Seite nicht gefunden.</p>';
    return;
  }

  const currentPage = appState.manuscriptData.pages[appState.currentPage];
  let html = '';

  currentPage.text.forEach((line) => {
    let lineContent = line.content;

    // Apply abbreviation expansion if toggled
    if (appState.expandAbbreviations) {
      lineContent = expandAbbreviations(lineContent);
    }

    // Find glosses that target this line
    const lineGlosses = appState.manuscriptData.glosses.filter((gloss) => {
      // Check if gloss target matches line ID
      return gloss.targetElement && gloss.targetElement.closest('l') === line.element;
    });

    // Wrap gloss words with interactive spans
    lineGlosses.forEach((gloss) => {
      const regex = new RegExp(`\\b(${gloss.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
      lineContent = lineContent.replace(regex, `<span class="gloss-word" data-gloss-id="${gloss.id}">$1</span>`);
    });

    html += `<p data-line-id="${line.id}">${lineContent}</p>`;
  });

  domElements.manuscriptTextContainer.innerHTML = html || '<p>Keine Textinhalte verfügbar.</p>';

  // Attach click listeners to gloss words
  attachGlossWordListeners();
}

function renderGlosses() {
  if (!appState.manuscriptData) {
    domElements.glossesListContainer.innerHTML = '<p>Keine Glossen verfügbar.</p>';
    return;
  }

  const currentPage = appState.manuscriptData.pages[appState.currentPage];

  // Filter glosses by type
  let filteredGlosses = appState.glossFilter === 'all'
    ? appState.manuscriptData.glosses
    : appState.manuscriptData.glosses.filter(g => g.type === appState.glossFilter);

  // Filter by current page (glosses that target elements on this page)
  const pageGlosses = filteredGlosses.filter((gloss) => {
    return gloss.targetElement && gloss.targetElement.closest('ab') === currentPage.lineElements[0]?.closest('ab');
  });

  if (pageGlosses.length === 0) {
    domElements.glossesListContainer.innerHTML = '<p>Keine Glossen auf dieser Seite.</p>';
    return;
  }

  let html = '';

  pageGlosses.forEach((gloss) => {
    // Clean up gloss content (remove XML tags, trim)
    const cleanContent = gloss.content
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    html += `
      <div class="gloss-item" data-gloss-id="${gloss.id}">
        <h4 class="gloss-word">[${gloss.word}]</h4>
        <p class="gloss-type">${gloss.type}</p>
        <p class="gloss-content">${cleanContent}</p>
      </div>
    `;
  });

  domElements.glossesListContainer.innerHTML = html;

  // Attach click listeners to gloss items
  attachGlossItemListeners();
}

function updatePageNavigation() {
  if (!appState.manuscriptData) return;

  const totalPages = appState.manuscriptData.pages.length;
  const currentPage = appState.currentPage;

  // Update folio display
  domElements.currentFolioSpan.textContent = `Folio ${appState.manuscriptData.pages[currentPage].folio}`;

  // Update progress bar
  domElements.pageProgressBar.value = currentPage + 1;
  domElements.pageProgressBar.max = totalPages;

  // Update page counter
  domElements.pageCounterSpan.textContent = `Seite ${currentPage + 1} von ${totalPages}`;

  // Disable buttons at boundaries
  domElements.prevPageBtn.disabled = currentPage === 0;
  domElements.nextPageBtn.disabled = currentPage === totalPages - 1;
}

function updateToggleStates() {
  domElements.toggleGlossesCheckbox.checked = appState.showGlosses;
  domElements.toggleAbbreviationsCheckbox.checked = appState.expandAbbreviations;
  domElements.editionModeSelect.value = appState.editionMode;

  // Show/Hide glosses sidebar
  const glossesSidebar = document.querySelector('.sidebar-glosses');
  if (glossesSidebar) {
    glossesSidebar.style.display = appState.showGlosses ? 'block' : 'none';
  }
}

/* ========================================
   6. EVENT LISTENERS
   ======================================== */

function attachEventListeners() {
  // Toggle: Show/Hide Glosses
  domElements.toggleGlossesCheckbox.addEventListener('change', (e) => {
    appState.showGlosses = e.target.checked;
    updateToggleStates();
    savePreferences();
  });

  // Toggle: Abbreviations
  domElements.toggleAbbreviationsCheckbox.addEventListener('change', (e) => {
    appState.expandAbbreviations = e.target.checked;
    renderManuscriptText(); // Re-render to apply abbreviation expansion
    savePreferences();
  });

  // Edition Mode
  domElements.editionModeSelect.addEventListener('change', (e) => {
    appState.editionMode = e.target.value;
    renderManuscriptText(); // Re-render with new edition mode
    savePreferences();
  });

  // Page Navigation
  domElements.prevPageBtn.addEventListener('click', previousPage);
  domElements.nextPageBtn.addEventListener('click', nextPage);

  // Gloss Filter
  domElements.glossFilterSelect.addEventListener('change', (e) => {
    appState.glossFilter = e.target.value;
    renderGlosses();
  });

  // Keyboard Navigation (Arrow Keys)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') previousPage();
    if (e.key === 'ArrowRight') nextPage();
  });
}

function attachGlossWordListeners() {
  const glossWords = document.querySelectorAll('.gloss-word');

  glossWords.forEach((word) => {
    word.addEventListener('click', (e) => {
      e.preventDefault();
      const glossId = word.dataset.glossId;
      scrollToGloss(glossId);
      highlightGloss(glossId);
    });

    word.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const glossId = word.dataset.glossId;
        scrollToGloss(glossId);
        highlightGloss(glossId);
      }
    });
  });
}

function attachGlossItemListeners() {
  const glossItems = document.querySelectorAll('.gloss-item');

  glossItems.forEach((item) => {
    item.addEventListener('click', () => {
      const glossId = item.dataset.glossId;
      highlightGloss(glossId);
    });
  });
}

/* ========================================
   7. PAGE NAVIGATION
   ======================================== */

function previousPage() {
  if (appState.currentPage > 0) {
    appState.currentPage--;
    renderManuscriptText();
    renderGlosses();
    updatePageNavigation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function nextPage() {
  if (!appState.manuscriptData) return;

  const totalPages = appState.manuscriptData.pages.length;
  if (appState.currentPage < totalPages - 1) {
    appState.currentPage++;
    renderManuscriptText();
    renderGlosses();
    updatePageNavigation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ========================================
   8. GLOSS INTERACTIONS
   ======================================== */

function scrollToGloss(glossId) {
  const glossItem = document.querySelector(`[data-gloss-id="${glossId}"]`);
  if (glossItem) {
    glossItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function highlightGloss(glossId) {
  // Remove previous highlights
  document.querySelectorAll('.gloss-item').forEach(item => {
    item.style.backgroundColor = '';
    item.style.boxShadow = '';
  });

  // Highlight current gloss
  const glossItem = document.querySelector(`[data-gloss-item][data-gloss-id="${glossId}"]`);
  if (glossItem) {
    glossItem.style.backgroundColor = '#FFFBF5';
    glossItem.style.boxShadow = '0 0 8px rgba(212, 165, 116, 0.5)';
  }

  // Also highlight corresponding word in text
  document.querySelectorAll('.gloss-word').forEach(word => {
    word.style.textDecoration = '';
  });

  const glossWord = document.querySelector(`.gloss-word[data-gloss-id="${glossId}"]`);
  if (glossWord) {
    glossWord.style.textDecoration = 'underline solid #1A3A52';
  }
}

/* ========================================
   9. UTILITY FUNCTIONS
   ======================================== */

function expandAbbreviations(text) {
  if (!appState.expandAbbreviations || !appState.manuscriptData) {
    return text;
  }

  let expandedText = text;
  const abbreviations = appState.manuscriptData.abbreviations;

  for (const [abbr, expansion] of Object.entries(abbreviations)) {
    const regex = new RegExp(abbr, 'g');
    expandedText = expandedText.replace(regex, expansion);
  }

  return expandedText;
}

/* ========================================
   10. LOCALSTORAGE (Preferences Persistence)
   ======================================== */

function savePreferences() {
  const preferences = {
    showGlosses: appState.showGlosses,
    expandAbbreviations: appState.expandAbbreviations,
    editionMode: appState.editionMode
  };
  localStorage.setItem('horaceEnglossedPreferences', JSON.stringify(preferences));
  console.log('✅ Preferences saved:', preferences);
}

function loadPreferences() {
  const savedPreferences = localStorage.getItem('horaceEnglossedPreferences');

  if (savedPreferences) {
    try {
      const prefs = JSON.parse(savedPreferences);
      appState.showGlosses = prefs.showGlosses ?? true;
      appState.expandAbbreviations = prefs.expandAbbreviations ?? false;
      appState.editionMode = prefs.editionMode ?? 'diplomatic';
      console.log('✅ Preferences loaded:', prefs);
    } catch (e) {
      console.error('❌ Error loading preferences:', e);
    }
  }
}

/* ========================================
   11. START APPLICATION
   ======================================== */

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
