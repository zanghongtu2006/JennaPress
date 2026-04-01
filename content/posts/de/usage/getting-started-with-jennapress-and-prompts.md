---
slug: getting-started-with-jennapress-and-prompts
title: Website mit GitHub Fork + AI Prompt schnell aufsetzen
summary: Auch ohne Programmiererfahrung kannst du mit JennaPress, GitHub und ChatGPT eine vollständige mehrsprachige Website aufbauen und pflegen.
publishedAt: "2026-04-01"
category: Usage
tags:
  - jennapress
  - getting-started
  - ai-prompt
  - github
author:
  name: Jenna Press
seo:
  title: Website mit GitHub Fork + AI Prompt schnell aufsetzen | Jenna Press
  description: Auch ohne Programmiererfahrung kannst du mit JennaPress, GitHub und ChatGPT eine vollständige mehrsprachige Website aufbauen und pflegen.
  canonical: https://www.example.com/blog/usage/getting-started-with-jennapress-and-prompts
bodyTitle: Website mit AI zehnmal schneller aufbauen
bodyBlocks:
  - type: cta-banner
    title: Prompt-Dateien ansehen
    description: TEMPLATE_PROMPT und CONTENT_PROMPT sind die Kernwerkzeuge dieses Workflows.
    action:
      label: Auf GitHub ansehen
      to: https://github.com/zanghongtu2006/JennaPress
---
JennaPress wurde entwickelt, damit auch nicht-technische Nutzer schnell eine professionelle mehrsprachige Website erhalten. Kombiniert mit GitHub Fork und AI-Tools lässt sich der gesamte Prozess auf etwa dreißig Minuten压缩ieren.

Dieser Artikel beschreibt den vollständigen Workflow.

## Was du brauchst

- Ein GitHub-Konto (kostenlos)
- ChatGPT oder einen ähnlichen KI-Assistenten
- Etwa 30 Minuten Zeit

Keine Programmierkenntnisse. Keine Node.js-Installation. Keine Git-Kommandozeile.

## Schritt 1: Projekt forken

Öffne das JennaPress GitHub-Repository und klicke右上角的 **Fork**-Schaltfläche. Das kopiert das gesamte Repository in deinen eigenen GitHub-Account.

## Schritt 2: Die zwei wichtigsten Dateien finden

Im Hauptverzeichnis deines Forks befinden sich zwei wichtige Dateien:

**CONTENT_PROMPT_DE.md** — Sagt der KI, wie Website-Inhalte geschrieben werden: Seitenstruktur, Blogartikel, mehrsprachige Inhalte und SEO-Felder.

**TEMPLATE_PROMPT_DE.md** — Sagt der KI, wie Templates generiert und angepasst werden: Dateistruktur, Header-Komponente und CSS.

## Schritt 3: Inhalte mit KI generieren

Öffne ChatGPT und sende die folgende Anweisung:

> Du bist ein JennaPress CMS Content-Spezialist. Beginne jede Antwort mit dem Inhalt von CONTENT_PROMPT_DE.md und befolge die Regeln genau.

Beschreibe dann, was du brauchst. KI generiert Inhalte nach den CONTENT_PROMPT-Regeln. Du musst sie nur noch in die entsprechende Markdown-Datei kopieren.

## Schritt 4: Automatisch bauen und deployen

GitHub Actions erkennt Änderungen automatisch. Nach dem Commit baut und deployt GitHub die Website innerhalb weniger Minuten.

## JennaPress Philosophie

Inhaltsersteller konzentrieren sich auf Inhalte, das System und die KI übernehmen den Rest.
