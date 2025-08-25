---
title: "Goldmark Extension for Wrapping Headings with Section Elements"
summary: "An extension for Goldmark, a markdown parser and HTML rendering library for the Go language."
slug: "gm-fancy-lists"
type: "post"
date: 2025-08-17T11:00:00-04:00
lastmod: 2025-08-17T11:05:00-04:00
draft: false
authors: ["djsweeney"]
aliases:
    - /2025/08/gm-sectionwrapper/
    - /posts/tech/gm-sectionwrapper/
categories: ["Technology"]
tags: ["development", "go", "golang", "markdown", "goldmark"]
---

ZMT Creative LLC has released an extension for Goldmark that inserts nested `<section>` HTML elements
around HTML Headings (*e.g., `<H1>`, `<H2>`, etc...*) and their contents. This extension transforms
the Markdown document structure into semantic HTML sections, making it easier to style

A more detailed description of the extension can be found on the [GitHub](https://github.com/ZMT-Creative/gm-sectionwrapper) page for the extension.

Given a basic markdown document like this:

```markdown
# Document Title

This is some text.

## This is a Level Two Section

This is some text in the new section.
```

...which will normally generate HTML code fragment that looks something like this:

```html
<h1>Document Title</h1>
  <p>This is some text</p>
<h2>This is a Level Two Section</h2>
  <p>This is some text in the new section.</p>
```

This works fine in situation where you don't need to style the document based on the section
headings and the content they contain, since the `<h?>` elements do not wrap the entirety of the
section they represent, they're just headings with no direct connection to the content that comes
after them.

In contrast, with the `gm-sectionwrapper` extension enabled in Goldmark, the following HTML is rendered:

```html
<section class="section-h1">
  <h1>Document Title</h1>
  <p>This is some text.</p>
  <section class="section-h2">
    <h2>This is a Level Two Section</h2>
    <p>This is some text in the new section.</p>
  </section>
</section>
```

This allows the user to use the class `section-h1` or `section-h2` to style the enclosing section
specifically based on the section level. It also makes it possible to implement section numbering
schemes in CSS using the CSS `counter()` and `content:` features.

The package is available via:

- **Go Package Repository:** [github.com/ZMT-Creative/gm-sectionwrapper](https://pkg.go.dev/github.com/ZMT-Creative/gm-sectionwrapper)
- **GitHub:** [https://github.com/ZMT-Creative/gm-sectionwrapper](https://github.com/ZMT-Creative/gm-sectionwrapper/releases/latest).
