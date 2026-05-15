App Concept (Current State and Future Plans)

This project, "Horace Englossed," is a digital scholarly edition that presents Horace’s Carmen 1,12 using a modern, user-friendly side-by-side interface. The application is built as a web page using custom JavaScript and HTML/CSS, creating an interactive and accessible environment for viewing encoded poetry, glosses, manuscript images, and underlying TEI-XML.

Implemented Features

Split-Screen UI: The page is structured into a two-column split view: the left column always displays the poem (with the option to toggle glosses and metamarks on or off), while the right column dynamically displays either the raw TEI-XML code or high-resolution manuscript images.

Gloss/Metamark Toggle: Readers can show or hide glosses and metamarks embedded within the poem, supporting different reading needs and research interests.

TEI/Manuscript Toggle: Dedicated buttons allow users to switch between viewing the TEI code and the manuscript facsimiles, ensuring the digital edition’s critical apparatus and material sources are both accessible.

Stacked Manuscript Images: Both manuscript images relevant to the poem are displayed, stacked vertically within a scrollable container with zoom capabilities (via Panzoom), enabling close examination of manuscript details.

Dynamic Content Loading: All content is fetched dynamically from the project’s GitHub repository, supporting flexibility for multiple poems/files in the future.

Responsive, Accessible Design: The site layout is responsive for desktop and mobile, headings are structured for accessibility, and captioning/attribution (including an improved "Impressum" footer) meets scholarly and legal standards.

Possible and Planned Extensions

Abbreviation Resolution: Integrate a feature to automatically detect and resolve manuscript abbreviations (expansions or tooltips), possibly via a dictionary popup or inline expansions within the text.

Word-Analysis Tool: Implement close description of the poem. 

Interlinear/Parallel Translation Display: Add support for a parallel translation or grammatical notes, with toggles or hover popups.

Search & Navigation: Implement searching across the poem text, glosses, and/or inline TEI queries for specific forms, lines, or manuscript features.

Download/Share Features: Allow users to download the TEI-XML, manuscript image(s), or generate printable views.

Accessibility Improvements: Options for high-contrast display, font scaling, and ARIA labeling throughout.
