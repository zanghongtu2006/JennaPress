---
slug: generated-files-and-source-of-truth
title: Archivos generados y fuente de verdad
summary: Cómo trata Jenna Press los archivos generados y por qué el contenido markdown sigue siendo la fuente de verdad.
publishedAt: "2026-03-18"
category: Project
tags:
  - jenna-press
  - project
author:
  name: Jenna Press
seo:
  title: Archivos generados y fuente de verdad | Jenna Press
  description: Entiende por qué existen archivos generados y cómo tratarlos de forma segura.
  canonical: https://www.jennapress.com/blog/project/generated-files-and-source-of-truth/
bodyTitle: Lo generado está permitido, pero lo generado no es verdad editable
bodyBlocks:
  - type: cta-banner
    title: Sigue leyendo dentro de Jenna Press
    description: Usa las categorías del blog para moverte entre el contexto del proyecto y la guía práctica de uso.
    action:
      label: Volver al blog
      to: /es/blog
---
En Jenna Press puede existir un archivo generado porque la publicación estática todavía necesita un puente práctico entre el contenido fuente y el renderizado en tiempo de ejecución. Eso no convierte al archivo generado en el lugar donde deberían trabajar los editores.

La fuente de verdad sigue siendo el contenido markdown y la lógica de generación que lo transforma. La salida generada puede versionarse por comodidad, pero debe tratarse como salida, revisarse como salida y regenerarse cuando cambie la fuente real.

Esta distinción importa porque protege tanto la claridad de autoría como la claridad en la revisión de código.
