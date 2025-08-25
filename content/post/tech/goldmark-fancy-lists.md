---
title: "Goldmark Extension for Fancy Lists"
summary: "An extension for Goldmark, a markdown parser and HTML rendering library for the Go language."
slug: "gm-fancy-lists"
type: "post"
date: 2025-08-17T10:10:00-04:00
lastmod: 2025-08-17T10:11:00-04:00
draft: false
authors: ["djsweeney"]
aliases:
    - /2025/08/gm-fancy-lists/
    - /posts/tech/gm-fancy-lists/
categories: ["Technology"]
tags: ["development", "go", "golang", "markdown", "goldmark"]
---

ZMT Creative LLC has released an extension for Goldmark that provides Fancy Lists using the syntax style used by Pandoc.

A more detailed description of the extension can be found on the [GitHub](https://github.com/ZMT-Creative/gm-fancy-lists) page for the extension.

This extension uses the syntax:

```markdown
A. List item 1
A. List item 2
   i. Roman number item 1
   #. Roman number item 2
   #. Roman number item 3
A. List item 3
   a. Item 3.1
   #. Item 3.2
```

...which will generate HTML code that looks like this:

```html
<ol class="fancy fl-ucalpha" type="A" start="1">
  <li>List item 1</li>
  <li>List item 2
    <ol class="fancy fl-lcroman" type="i" start="1">
      <li>Roman number item 1</li>
      <li>Roman number item 2</li>
      <li>Roman number item 3</li>
    </ol>
  </li>
  <li>List item 3
    <ol class="fancy fl-lcalpha" type="a" start="1">
      <li>Item 3.1</li>
      <li>Item 3.2</li>
    </ol>
  </li>
</ol>
```

... which then renders a list that can look like this:

![Fancy List](/img/gm-fancy-lists_simple.png)

This extension modifies the basic list handling that Goldmark already does (bullet lists and number lists), adding
alphabetic characters and roman numerals, in both uppercase and lowercase for both. It adds classes to the `<ol>` elements
so you can customize the CSS styling, but the use of the `type` and `start` attributes ensures that even without styling
the HTML output should be correct (*the above example output had no custom styling applied*).

The package is available via:

- **Go Package Repository:** [github.com/ZMT-Creative/gm-fancy-lists](https://pkg.go.dev/github.com/ZMT-Creative/gm-fancy-lists)
- **GitHub:** [https://github.com/ZMT-Creative/gm-fancy-lists](https://github.com/ZMT-Creative/gm-fancy-lists/releases/latest).
