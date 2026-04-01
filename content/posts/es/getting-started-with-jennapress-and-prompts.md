---
slug: getting-started-with-jennapress-and-prompts
title: Cómo crear un sitio JennaPress con GitHub Fork + AI Prompt
summary: Aunque no tengas experiencia en programación, puedes construir y mantener un sitio web multilingüe completo con JennaPress usando solo GitHub y ChatGPT.
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
  title: Cómo crear un sitio JennaPress con GitHub Fork + AI Prompt | Jenna Press
  description: Aunque no tengas experiencia en programación, puedes construir y mantener un sitio web multilingüe con JennaPress usando GitHub y ChatGPT.
  canonical: https://www.example.com/blog/usage/getting-started-with-jennapress-and-prompts
bodyTitle: Construye tu sitio web diez veces más rápido con IA
bodyBlocks:
  - type: cta-banner
    title: Ver los archivos Prompt
    description: TEMPLATE_PROMPT y CONTENT_PROMPT son las herramientas centrales de este flujo.
    action:
      label: Ver en GitHub
      to: https://github.com/zanghongtu2006/JennaPress
---
JennaPress fue diseñado para que usuarios sin conocimientos técnicos puedan tener una web multilingüe profesional rápidamente. Combinado con GitHub Fork y herramientas de IA, todo el proceso se reduce a unos treinta minutos.

## Lo que necesitas

- Una cuenta de GitHub (gratis)
- ChatGPT o cualquier asistente de IA que soporte contexto largo
- Aproximadamente 30 minutos

Sin conocimientos de código. Sin instalar Node.js. Sin línea de comandos Git.

## Paso 1: Hacer Fork del proyecto

Abre el repositorio JennaPress en GitHub y haz clic en el botón **Fork** arriba a la derecha. Esto copia el repositorio completo a tu cuenta de GitHub.

## Paso 2: Encontrar los dos archivos más importantes

En la raíz de tu repositorio clonado encontrarás:

**CONTENT_PROMPT_ES.md** — Indica a la IA cómo escribir contenidos web: estructura de páginas, cómo escribir artículos de blog, cómo manejar contenido multilingüe y cómo填写 campos SEO.

**TEMPLATE_PROMPT_ES.md** — Indica a la IA cómo generar y modificar plantillas: cómo se organizan los archivos, cómo escribir el componente Header y cómo funciona el CSS de temas.

## Paso 3: Generar contenido con IA

Abre ChatGPT yenvía esta indicación:

> Eres un especialista en contenido de JennaPress CMS. Comienza cada respuesta escribiendo el contenido de CONTENT_PROMPT_ES.md y síguelo exactamente.

Luego describe lo que necesitas. La IA generará contenido siguiendo las reglas. Solo tienes que copiar el resultado al archivo Markdown correspondiente.

## Paso 4: Publicar y desplegar automáticamente

GitHub Actions detecta los cambios automáticamente. Después de hacer commit, GitHub compilará y desplegará tu sitio en pocos minutos.

## Filosofía de JennaPress

Los creadores de contenido se concentran en el contenido, el sistema y la IA se encargan del resto.
