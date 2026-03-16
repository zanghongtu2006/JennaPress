---
slug: /principles
title: Prinzipien
summary: Die Gestaltungsprinzipien hinter Jenna Press
bodyTitle: Projektregeln zum Schutz des Frameworks
seo:
  title: Prinzipien | Jenna Press
  description: Die Grundregeln, die Jenna Press als static-first mehrsprachiges Framework definieren.
  canonical: https://example.com/principles
blocks:
  - type: feature-grid
    title: Kernprinzipien
    items:
      - title: Standardmäßig static-only
        description: Jenna Press benötigt weder Runtime-APIs noch einen eingebauten Server, um Kernseiteninhalte zu rendern.
      - title: Themes sind gleichrangig
        description: Kein Template darf eine versteckte Prioritätsreihenfolge zwischen dark, light und pink kodieren. Theme-Logik gehört in gemeinsame Framework-Regeln.
      - title: Content ist die Quelle der Wahrheit
        description: Redakteure ändern Markdown-Quelldateien. Generierte Dateien dürfen existieren, sind aber Ausgaben und nicht die handgeschriebene Wahrheit.
  - type: feature-grid
    title: Regeln für die Zusammenarbeit
    items:
      - title: Minimale Codeänderungen
        description: Codeänderungen sollen eng, nachvollziehbar und review-freundlich bleiben statt Fehlerbehebungen mit Nebenrefaktoren zu mischen.
      - title: Templates bleiben isoliert
        description: Template-Änderungen gehören in Template-Verzeichnisse. Framework-Änderungen dürfen nicht beiläufig zu Content-Entscheidungen werden.
      - title: Routing und Persistenz bleiben vorhersagbar
        description: Sprach- und Theme-Persistenz sollen sich über Refresh, interne Navigation und statisches Hosting stabil verhalten.
---
Diese Prinzipien existieren, um einen typischen Fehlmodus zu verhindern: Ein Projekt startet einfach und verliert dann schrittweise seine Grenzen.

In Jenna Press darf es eine generierte Datei geben, aber sie muss als generiert behandelt werden. Ein Template ist erlaubt, darf aber das Framework nicht heimlich neu definieren. Eine Content-Datei ist editierbar, soll aber keine Anwendungslogik verstecken.

Das Framework bleibt nur dann nützlich, wenn diese Linien sichtbar bleiben.
