export class SplitVendorChunkCache {
  cache: Map<string, any>
  constructor() {
    this.cache = new Map()
  }
  reset() {
    this.cache = new Map()
  }
}
export function staticImportedByEntry(id: string, getModuleInfo: Function, cache: Map<string, any>, importStack: string[] = []) {
  if (cache.has(id)) {
    return !!cache.get(id)
  }
  if (importStack.includes(id)) {
    cache.set(id, false)
    return false
  }
  const mod = getModuleInfo(id)
  if (!mod) {
    cache.set(id, false)
    return false
  }
  if (mod.isEntry) {
    cache.set(id, true)
    return true
  }
  const someImporterIs = mod.importers.some((importer) => staticImportedByEntry(importer, getModuleInfo, cache, importStack.concat(id)))
  cache.set(id, someImporterIs)
  return someImporterIs
}
