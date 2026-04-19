import type { Component } from 'vue'

const templateModules = import.meta.glob('~/templates/*/Template.vue', { eager: true }) as Record<string, { default: Component }>
const frameModules = import.meta.glob('~/templates/*/Frame.vue', { eager: true }) as Record<string, { default: Component }>
const blogHomeModules = import.meta.glob('~/templates/*/blog/BlogHome.vue', { eager: true }) as Record<string, { default: Component }>
const blogCategoryModules = import.meta.glob('~/templates/*/blog/BlogCategory.vue', { eager: true }) as Record<string, { default: Component }>
const blogPostModules = import.meta.glob('~/templates/*/blog/BlogPost.vue', { eager: true }) as Record<string, { default: Component }>
const productHomeModules = import.meta.glob('~/templates/*/product/ProductHome.vue', { eager: true }) as Record<string, { default: Component }>
const productCategoryModules = import.meta.glob('~/templates/*/product/ProductCategory.vue', { eager: true }) as Record<string, { default: Component }>
const productDetailModules = import.meta.glob('~/templates/*/product/ProductDetail.vue', { eager: true }) as Record<string, { default: Component }>

function templateNameFromPath(filepath: string) {
  const match = filepath.match(/\/templates\/([^/]+)\//)
  return match?.[1] || ''
}

function registryFromModules(modules: Record<string, { default: Component }>) {
  const registry: Record<string, Component> = {}
  for (const [filepath, mod] of Object.entries(modules)) {
    const name = templateNameFromPath(filepath)
    if (!name || !mod?.default) continue
    registry[name] = mod.default
  }
  return registry
}

const templateRegistry = registryFromModules(templateModules)
const frameRegistry = registryFromModules(frameModules)
const blogHomeRegistry = registryFromModules(blogHomeModules)
const blogCategoryRegistry = registryFromModules(blogCategoryModules)
const blogPostRegistry = registryFromModules(blogPostModules)
const productHomeRegistry = registryFromModules(productHomeModules)
const productCategoryRegistry = registryFromModules(productCategoryModules)
const productDetailRegistry = registryFromModules(productDetailModules)

export function getAvailableTemplateNames() {
  return Object.keys(templateRegistry).sort()
}

export function resolveTemplateComponent(template: string, fallback = 'corporate-basic') {
  return templateRegistry[template] || templateRegistry[fallback]
}

export function resolveFrameComponent(template: string, fallback = 'corporate-basic') {
  return frameRegistry[template] || frameRegistry[fallback]
}

export function resolveBlogComponent(template: string, mode: 'home' | 'category' | 'post', fallback = 'corporate-basic') {
  const source = mode === 'home' ? blogHomeRegistry : mode === 'category' ? blogCategoryRegistry : blogPostRegistry
  return source[template] || source[fallback]
}

export function resolveProductComponent(template: string, mode: 'home' | 'category' | 'product', fallback?: string) {
  const source = mode === 'home' ? productHomeRegistry : mode === 'category' ? productCategoryRegistry : productDetailRegistry
  return source[template] || (fallback ? source[fallback] : undefined)
}
