# CSS Tutorial

## 1. Font Imports
To start using custom fonts in your CSS, you can import fonts from sources like Google Fonts. Here's an example:

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
```
This line imports the Roboto font, allowing you to use it in your styles.

## 2. Body Styling
The body styling sets the overall look of your webpage. You can define the font, background color, and margin. For example:

```css
body {
    font-family: 'Roboto', sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 0;
}
```

## 3. Typography
Typography is essential for readability. Set styles for headings and paragraphs like this:

```css
h1, h2, h3 {
    font-weight: bold;
    color: #333;
}

p {
    line-height: 1.6;
    color: #666;
}
```

## 4. 3-Column Layout
A responsive 3-column layout can be created using CSS Grid or Flexbox. Here's an example with Flexbox:

```css
.container {
    display: flex;
}

.column {
    flex: 1;
    padding: 10px;
}
```

## 5. Responsive Design
Ensure your design looks good on all devices using media queries:

```css
@media (max-width: 768px) {
    .container {
        flex-direction: column;
    }
}
```

## 6. Buttons and Links
Style your buttons and links to make them visually appealing:

```css
button {
    background-color: #007BFF;
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

a {
    color: #007BFF;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
```

## 7. Color Scheme
Choose a color scheme that enhances usability. Here's a simple light scheme:

```css
:root {
    --primary-color: #007BFF;
    --secondary-color: #6c757d;
    --background-color: #f0f0f0;
    --text-color: #212529;
}
```

## 8. WCAG Accessibility
Make your site accessible by ensuring color contrast and keyboard navigability:

- Always provide sufficient contrast between text and background colors.
- Use semantic HTML and ARIA roles as needed.

## 9. Practical Tips
- Keep your CSS organized using comments and sections.
- Use a preprocessor like SASS for better management.
- Test on multiple devices to ensure responsiveness.

This comprehensive tutorial covers essential CSS concepts for creating visually appealing and accessible web pages.
