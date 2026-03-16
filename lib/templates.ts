import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

export type TemplateMeta = {
  name: string
  label: string
  description?: string
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
          : undefined
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
