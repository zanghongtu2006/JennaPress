---
slug: content-and-multilingual-updates
title: JennaPress-Inhalte kontinuierlich aktualisieren
summary: Mit dem GitHub-Browser-Editor und KI-Assistenten kannst du deine JennaPress-Website ohne Programmierkenntnisse in fünf Sprachen pflegen.
publishedAt: "2026-04-01"
category: Usage
tags:
  - jennapress
  - content-management
  - multilingual
  - github
author:
  name: Jenna Press
seo:
  title: JennaPress-Inhalte kontinuierlich aktualisieren | Jenna Press
  description: Mit dem GitHub-Browser-Editor und KI kannst du deine JennaPress-Website ohne Programmierkenntnisse in fünf Sprachen pflegen.
  canonical: https://www.example.com/blog/usage/content-and-multilingual-updates
bodyTitle: Praktischer Workflow für Content und mehrsprachige Updates
bodyBlocks:
  - type: cta-banner
    title: Bereit loszulegen?
    description: Verwende KI und den GitHub-Editor, um deine JennaPress-Website zu pflegen.
    action:
      label: Blog durchsuchen
      to: /blog
---
Der vorherige Artikel beschrieb, wie man eine JennaPress-Website mit Fork und KI aufsetzt. Dieser Artikel erklärt, wie du die Website kontinuierlich aktualisierst und mehrsprachige Inhalte korrekt pflegst.

## Änderungen direkt im GitHub-Browser-Editor

Nach dem Fork brauchst du keine lokalen Tools. GitHub bietet einen vollständigen Browser-Editor. Finde die Datei, die du ändern möchtest, klicke auf den Stift-Icon und committe die Änderung. Jeder Commit löst automatisch einen neuen Build und ein Deployment aus.

## So nutzt du KI richtig für Content

Gib der KI immer den vollständigen CONTENT_PROMPT als Kontext. Dann beschreibe genau, was du brauchst: „Schreibe eine Produktseite", „Schreibe drei Blogartikel" oder „Übersetze die Startseite ins Deutsche".

## Mehrsprachige Inhalte korrekt hinzufügen

Für jede übersetzte Seite oder jeden Artikel gilt: Erstelle die entsprechende Datei im Sprachunterverzeichnis (z.B. `content/posts/de/mein-artikel.md`) mit demselben `slug` wie die englische Version. Die `canonical`-URL zeigt auf die englische Originalseite.

## Zusammenfassung

Schreibe Inhalte mit KI nach CONTENT_PROMPT, ändere das Design mit TEMPLATE_PROMPT, bearbeite die Site-Konfiguration direkt in `content/site.md`, committe mit wenigen Klicks im GitHub-Editor — der Rest läuft automatisch.

JennaPress-Kernziel: Inhaltsersteller konzentrieren sich auf Inhalte, das System übernimmt den Rest.
