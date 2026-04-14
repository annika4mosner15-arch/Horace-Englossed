# HTML Tutorial

## Understanding the Structure of index.html

### 1. DOCTYPE Declaration
The `<!DOCTYPE html>` declaration defines the document type and version of HTML being used. It should be the first line in your HTML document.

### 2. `<html>` Element
The `<html>` tag is the root element of an HTML page. The `lang` attribute specifies the language of the document's content. For example:
```html
<html lang="en">
```

### 3. The `<head>` Section
The `<head>` section contains meta-information about the document. Here are some important elements you might include:
- `<meta charset="UTF-8">` - Defines the character encoding.
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` - Makes your website responsive.
- `<title>Your Page Title</title>` - Sets the title of the document, shown in the browser tab.

### 4. The `<body>` Structure
The `<body>` contains the visible content of your page. Here are the main semantic elements that can be included:

- `<header>`: Typically contains introductory content or navigational links.
- `<nav>`: Contains the navigation links of the website.
- `<aside>`: Contains content related to the main content, like a sidebar.
- `<main>`: Contains the dominant content of the `<body>`.
- `<footer>`: Contains information about the author, copyright, links to terms of use, etc.

### Example Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title</title>
</head>
<body>
    <header>
        <h1>Welcome to My Website</h1>
    </header>
    <nav>
        <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
        </ul>
    </nav>
    <aside>
        <h3>Related Links</h3>
        <ul>
            <li><a href="#">Link 1</a></li>
        </ul>
    </aside>
    <main>
        <h2>Main Content Header</h2>
        <p>This is where the main content of the page will go.</p>
    </main>
    <footer>
        <p>&copy; 2026 Your Name. All rights reserved.</p>
    </footer>
</body>
</html>
```

### 5. Semantic HTML
Using semantic HTML tags helps with accessibility, search engine optimization (SEO), and makes your content more understandable.

### 6. Accessibility Features
To enhance accessibility, consider adding:
- `alt` attributes to images.
- `aria-labels` for better screen reader support.

### Practical Examples
- Create a simple webpage layout using the structure discussed.

In conclusion, understanding the structure of an HTML document ensures proper organization and helps in creating accessible and semantic web pages.
