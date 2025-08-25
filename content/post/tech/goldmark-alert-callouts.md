---
title: "Goldmark Extension for GitHub Alerts & Obsidian Callouts"
summary: "An extension for Goldmark, a markdown parser and HTML rendering library for the Go language."
slug: "gm-alert-callouts"
type: "post"
date: 2025-08-18T18:46:00-04:00
lastmod: 2025-08-18T18:57:00-04:00
draft: false
authors: ["djsweeney"]
aliases:
    - /2025/08/gm-alert-callouts/
    - /posts/tech/gm-alert-callouts/
categories: ["Technology"]
tags: ["development", "go", "golang", "markdown", "goldmark"]
---

ZMT Creative LLC has released an extension for Goldmark that provides GitHub-Style Alerts and Obsidian-Style
Callouts (*GitHub calls them __Alerts__ but they work mostly the same way as Obsidian Callouts -- see
the [GitHub](https://github.com/ZMT-Creative/gm-alert-callouts) page for more info*).

This extension uses the syntax:

```markdown
> [!NOTE]
> This is a note.
```

...which will generate HTML code that looks like this:

```html
<div class="callout callout-note iconset-gfmplus" data-callout="note">
  <div class="callout-title">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-info-icon lucide-info">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 16v-4"></path><path d="M12 8h.01"></path>
    </svg>
    <p class="callout-title-text">Note</p>
  </div>
    <div class="callout-body">
      <p>This is a note.</p>
    </div>
</div>
```

... which then renders an alert/callout that can look like this:

![Note Callout](/img/gm-alert-callouts_note.png)

(*This extension only generates the HTML element wrappers for the callout -- __you__ still
have to create the necessary CSS to style it into something like the above.*)

The package is available via:

- **Go Package Repository:** [github.com/ZMT-Creative/gm-alert-callouts](https://pkg.go.dev/github.com/ZMT-Creative/gm-alert-callouts)
- **GitHub:** [https://github.com/ZMT-Creative/gm-alert-callouts](https://github.com/ZMT-Creative/gm-alert-callouts/releases/latest).
