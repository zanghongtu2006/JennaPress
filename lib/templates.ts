import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

export type TemplateMeta = {
  name: string
  label: string
  description?: string
  author?: string
  authorUrl?: string
  category?: string
  tags?: string[]
  previewImages?: string[]
  downloadCount?: number
  createdAt?: string
  updatedAt?: string
}

const templatesDir = path.resolve(process.cwd(), 'templates')

export function getAllTemplateMetas(): TemplateMeta[] {
  if (!existsSync(templatesDir)) return []

  const dirs = readdirSync(templatesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

  return dirs.map((dir) => {
    const metaPath = path.join(templatesDir, dir, 'template.meta.json')

    if (!existsSync(metaPath)) {
      return {
        name: dir,
        label: dir
      }
    }

    try {
      const raw = readFileSync(metaPath, 'utf-8')
      const meta = JSON.parse(raw)

      return {
        name: dir,
        label: typeof meta?.label === 'string' && meta.label.trim() ? meta.label.trim() : dir,
        description: typeof meta?.description === 'string' && meta.description.trim()
          ? meta.description.trim()
          : undefined,
        author: typeof meta?.author === 'string' && meta.author.trim() ? meta.author.trim() : undefined,
        authorUrl: typeof meta?.authorUrl === 'string' && meta.authorUrl.trim() ? meta.authorUrl.trim() : undefined,
        category: typeof meta?.category === 'string' && meta.category.trim() ? meta.category.trim() : undefined,
        tags: Array.isArray(meta?.tags) ? meta.tags.filter((tag: unknown) => typeof tag === 'string') : undefined,
        previewImages: Array.isArray(meta?.previewImages) ? meta.previewImages.filter((img: unknown) => typeof img === 'string') : undefined,
        downloadCount: typeof meta?.downloadCount === 'number' ? meta.downloadCount : undefined,
        createdAt: typeof meta?.createdAt === 'string' && meta.createdAt.trim() ? meta.createdAt.trim() : undefined,
        updatedAt: typeof meta?.updatedAt === 'string' && meta.updatedAt.trim() ? meta.updatedAt.trim() : undefined
      }
    } catch {
      return {
        name: dir,
        label: dir
      }
    }
  })
}

export function ensureTemplateExists(templateName: string) {
  const found = getAllTemplateMetas().some((item) => item.name === templateName)
  if (!found) {
    throw new Error(`Unknown template: ${templateName}`)
  }
}
