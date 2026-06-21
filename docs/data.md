# Data Documentation for the Horace Englossed Project
# Project Data Materials
This repository organizes a curated set of scholarly data materials supporting the interactive digital edition of Horace's Carmen 1.12. The core data assets consist of structured transcription models, high-definition manuscript image files, and contextual definition dictionaries.

# Data Assets & Formats
# 1. TEI XML Transcription Files
The primary transcription documents are modeled using the semantic guidelines of the Text Encoding Initiative (TEI). These files capture structural, linguistic, and historical details of the classical poetry verses and their corresponding medieval annotations.

# 2. Digital Manuscript Images (JPEG)
High-definition image files representing the historical witnesses of the text. These assets are pulled dynamically at runtime to feed the interactive manuscript workspace.

# 3. Structural Glossary Dictionary (JSON)
A data dictionary file (glossary.json) mapping specific string identifiers to historical, biographical, and mythological explanations. This serves as the content database for the client-side tooltip system.

# Data Structure & Semantic Elements
TEI XML Architecture
The transcription files use localized tag mappings to track textual anomalies, translations, and scribal interventions:

```<fw> and <hi>```: Used at the text boundaries to isolate, clean, and extract the primary poem titles.

```<ab> (Anonymous Blocks)```: Serve as semantic structural wrappers grouping lines of poetry (<l>) together with their matching peripheral notes.

```<note type="gloss">```: Captures medieval margin or interlinear glosses added by historical readers.

```<metamark>```: Isolates non-textual structural or operational signs added by scribes.

```<choice>```: Encloses parallel scribal states, wrapping original contractions (<abbr>) alongside editorial structural expansions (<expan>).

```<seg type="translation">```: Stores line-by-line modern translations mapped directly to individual verses.

```<name key="..."> & <rs key="...">```: Tag human names, places, or referenced symbols. The key attribute stores an identifier used to cross-reference entries in the glossary file.

# Glossary Dictionary Layout (JSON)
The dictionary uses a straightforward key-value pair map. The unique identifiers stored in the TEI XML key attributes serve as the lookup keys, while the values store clean string explanations:

```"key_identifier"```: "Comprehensive historical or mythological definition string text."

# Data Pipeline & Interaction Handling
Live Repository Fetching
The application treats the GitHub REST API as a live database pipeline. Instead of running heavy file transformations on the server side, the system fetches the file arrays directly from the /data/ repository folder at runtime.

# Runtime Transformation & DOM Parsing
XML Parsing: The raw TEI XML text string is processed on the client side using the browser's native DOMParser engine. This converts the string data into a traversable XML Document Object Model, eliminating the need to pre-render static HTML versions of the poems.

Dynamic Tooltip Merging: During the text rendering phase, when the engine encounters a ```<name>``` or ```<rs>```element, it automatically intercepts the key value, looks up the corresponding definition string inside the glossary.json data array, and embeds it safely inside a data-tooltip attribute.

# Error Boundaries & Data Resilience
Glossary Fail-Safe: The application implements an isolated error catching routine for the JSON dictionary asset. If glossary.json fails to load, is missing, or contains syntax formatting bugs, the system throws a console warning and defaults to an empty object wrapper ```({})```. This keeps the primary text rendering engine from crashing, allowing poems to display correctly even if tooltips are temporarily unavailable.

Escape Character Security: An integrated utility tracking module (escapeHtml) intercepts all text nodes inside both the TEI string and glossary variables. It automatically transforms special characters (&, <, >, ", ') into clean HTML entity symbols, avoiding layout truncation issues or cross-site scripting bugs.
