const getStorage = (): Storage | null => {
  if (!("window" in globalThis) || !globalThis.window) {
    return null
  }

  return globalThis.window.localStorage ?? null
}

export const readJson = <T>(key: string): T | null => {
  const storage = getStorage()
  if (!storage) {
    return null
  }

  const raw = storage.getItem(key)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    storage.removeItem(key)
    return null
  }
}

export const writeJson = <T>(key: string, value: T) => {
  const storage = getStorage()
  if (!storage) {
    return
  }
  storage.setItem(key, JSON.stringify(value))
}

export const removeJson = (key: string) => {
  const storage = getStorage()
  if (!storage) {
    return
  }
  storage.removeItem(key)
}
