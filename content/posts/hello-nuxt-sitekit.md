---
slug: hello-nuxt-sitekit
title: Hello Nuxt SiteKit
summary: The first post in the demo explains why page content and blog content should be separated early.
publishedAt: "2026-03-06"
category: Architecture
tags:
  - nuxt
  - static-site
  - schema
author:
  name: Jenna Press
seo:
  title: Hello Nuxt SiteKit | Jenna Press
  description: An introduction to the Nuxt SiteKit demo and why its content models are intentionally narrow.
  canonical: https://example.com/blog/architecture/hello-nuxt-sitekit
bodyTitle: Why separate pages and posts
bodyBlocks:
  - type: cta-banner
    title: Want a marketing homepage too?
    description: The same project can now render a stronger SaaS-style landing page and a separate blog section at the same time.
    action:
      label: Back to home
      to: /
---
One common mistake in content-driven website projects is trying to represent every type of content with one giant schema. That usually feels flexible on day one, but becomes messy very quickly.

In this demo, pages and posts are intentionally separate. Pages are for the homepage, about, contact, product pages, and landing pages. Posts are for dated content such as blog entries, news, and updates.

That separation keeps routing, rendering, and future collections much easier to reason about.

## What this unlocks later

Once posts live in their own collection, it becomes natural to add pagination, RSS, tag pages, and category pages later. None of that has to pollute the simpler page model.

The result is a cleaner framework that still stays friendly to static deployment.
