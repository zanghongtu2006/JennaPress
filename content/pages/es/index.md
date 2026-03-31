---
slug: /
title: Inicio
summary: Página de inicio de Jenna Press
seo:
  title: Jenna Press | Un framework de contenido static-first
  description: Jenna Press es un framework multilingüe static-first para sitios de proyecto, páginas tipo documentación y publicación de blogs.
  canonical: https://www.jennapress.com/
blocks:
  - type: hero
    kicker: Jenna Press
    title: Un framework static-first para sitios de proyecto que necesitan estructura clara y entrega rápida
    description: Jenna Press separa contenido, plantillas y reglas del framework para que un equipo pequeño pueda publicar sitios multilingües sin convertir un sitio simple en una aplicación pesada dependiente del servidor.
    primaryAction:
      label: Leer el blog
      to: /es/blog
    secondaryAction:
      label: Acerca del proyecto
      to: /es/about
    panelTitle: Lo que este proyecto ya soporta
    panelLines:
      - Publicación de páginas y blog estáticos
      - Inglés por defecto, además de alemán, chino, español y griego
      - Persistencia de tema e idioma en el navegador
  - type: feature-grid
    title: Por qué existe este proyecto
    description: Jenna Press fue creado para equipos que quieren un flujo de publicación estática confiable en lugar de una promesa vaga de CMS todo en uno.
    items:
      - title: Entrega static-first
        description: El proyecto está diseñado para despliegue puramente estático, buen SEO y baja complejidad operativa.
      - title: Separación entre contenido y plantilla
        description: Los editores trabajan principalmente en markdown, mientras los cambios visuales permanecen dentro de las plantillas en lugar de filtrarse a cada archivo de página.
      - title: Multilingüe por estructura
        description: El inglés es la versión predeterminada, mientras que el alemán, el chino, el español y el griego son variantes de contenido de primera clase y no añadidos de último momento.
  - type: stats
    title: Nivel actual de soporte
    description: El framework es deliberadamente acotado, pero la superficie que ya soporta es práctica para sitios de proyecto.
    items:
      - value: '5'
        label: idiomas
        note: Inglés, alemán, chino, español y griego usan el mismo modelo de publicación.
      - value: '2'
        label: categorías del blog
        note: Project y Usage mantienen compacta la arquitectura de información.
      - value: '0'
        label: APIs en tiempo de ejecución
        note: El framework es static-only por regla del proyecto.
  - type: cta-banner
    title: Empieza por las páginas oficiales y luego continúa en el blog
    description: Inicio da la visión general, About explica el contexto, Principles define las reglas y el blog desarrolla los temas más profundos del proyecto y su uso.
    action:
      label: Ver artículos del proyecto
      to: /es/blog/project
bodyTitle: Lo que Jenna Press intenta demostrar
---
Jenna Press se construye sobre una idea simple: un sitio de proyecto puede seguir siendo **rápido, multilingüe y mantenible** sin convertirse en una plataforma dependiente del servidor.

El framework mantiene claras tres fronteras.

- **El contenido** vive en markdown.
- **Las plantillas** controlan la presentación.
- **Las reglas del framework** controlan el enrutamiento, la persistencia y la validación.

Esa separación es la razón por la que el proyecto puede seguir siendo pequeño y, al mismo tiempo, práctico.
