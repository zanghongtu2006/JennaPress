---
slug: theme-and-language-rules
title: Theme- und Sprachregeln
summary: Die erwarteten Regeln für Theme-Gleichrangigkeit, Sprachrouting und browserseitige Persistenz in Jenna Press.
publishedAt: "2026-03-21"
category: Usage
tags:
  - jenna-press
  - usage
author:
  name: Jenna Press
seo:
  title: Theme- und Sprachregeln | Jenna Press
  description: Die Regeln, die Theme- und Sprachverhalten vorhersagbar halten.
  canonical: https://example.com/blog/usage/theme-and-language-rules
bodyTitle: Persistenz sollte stabil und unspektakulär wirken
bodyBlocks:
  - type: cta-banner
    title: Weiterlesen innerhalb von Jenna Press
    description: Nutze die Blog-Kategorien, um zwischen Projektkontext und praktischer Anwendung zu wechseln.
    action:
      label: Zurück zum Blog
      to: /blog
---
Themes sind in Jenna Press gleichrangige Bürger. Dark, light und pink sollen als gleichwertig behandelt werden und nicht als ein echtes Theme plus zwei Sonderfälle. Dieses Prinzip ist wichtig, weil versteckte Prioritätsregeln typischerweise Refresh-Bugs und Wartungschaos erzeugen.

Das Sprachverhalten sollte genauso vorhersagbar sein. Englisch ist der Standard-Raum der Routen, während Deutsch und Chinesisch explizite Locale-Präfixe verwenden. Browser-Persistenz soll die Nutzerwahl wiederherstellen, ohne das Routenmodell selbst zu verändern.

Kurz gesagt: Routing gehört ins Framework, Content gehört in Content-Dateien, und Persistenz soll beides unterstützen, ohne Überraschungen zu erzeugen.
