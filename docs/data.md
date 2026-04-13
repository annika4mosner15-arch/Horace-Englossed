# Data Documentation for the Horace Englossed Project

## Project Data Materials
This repository contains various data materials relevant to the Horace Englossed project, including TEI XML files, PAGE XML digitalisates, and manuscript metadata.

## Data Formats
1. **TEI XML Files**: These files follow the Text Encoding Initiative (TEI) guidelines, which provide a standard for representing texts in digital form.
2. **PAGE XML Digitalisates**: PAGE XML files are used for representing page layout and other features of the digitized documents.
3. **Manuscript Metadata**: This includes descriptive elements about the manuscripts, such as authorship, creation date, and physical characteristics.

## Data Conversions
- **TEI XML to PAGE XML**: Conversions may be necessary to transform text-based documents into a structured page layout.
- **Metadata Formats**: Manuscript metadata may be converted to various formats depending on project needs (e.g., JSON, CSV).

## Missing Data
- **Untranscribed Manuscripts**: Some manuscripts have not yet been transcribed into TEI XML.
- **Incomplete Metadata**: Additional metadata elements are required for certain manuscripts.

## Data Structure
### TEI XML Files
- Elements include `<text>`, `<head>`, `<body>`, and various `<seg>` tags for delineating sections and annotations.

### PAGE XML Digitalisates
- Contain layout information such as `<Page>`, `<TextRegion>`, and `<Graphic>` elements corresponding to the manuscript pages.

### Manuscript Metadata
- Structured as key-value pairs, typically including fields like `title`, `author`, `date`, and `provenance`.

## Additional Data Needs
- Detailed mapping of TEI XML elements to PAGE XML formats.
- Comprehensive collection of missing manuscript metadata, particularly for co-authored works.

This documentation will evolve as the project progresses, reflecting updates to the data and any newly identified needs.
