import { readFileSync, existsSync, statSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"
import vm from "node:vm"
import ts from "typescript"

const require = createRequire(import.meta.url)
const root = fileURLToPath(new URL("../../", import.meta.url))

export const createSourceLoader = (mocks = {}) => {
  const cache = new Map()

  const load = (filename) => {
    const resolved = path.resolve(root, filename)
    if (cache.has(resolved)) return cache.get(resolved).exports

    const loadedModule = { exports: {} }
    cache.set(resolved, loadedModule)
    const { outputText } = ts.transpileModule(readFileSync(resolved, "utf8"), {
      fileName: resolved,
      compilerOptions: {
        target: ts.ScriptTarget.ES2017,
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    })
    const localRequire = (id) => {
      if (Object.hasOwn(mocks, id)) return mocks[id]
      if (!id.startsWith("@/") && !id.startsWith(".")) return require(id)

      const target = id.startsWith("@/")
        ? path.join(root, "src", id.slice(2))
        : path.resolve(path.dirname(resolved), id)
      const source = [
        target,
        `${target}.ts`,
        `${target}.tsx`,
        path.join(target, "index.ts"),
      ].find((file) => existsSync(file) && statSync(file).isFile())
      if (!source) throw new Error(`Source module not found: ${id}`)
      return load(source)
    }

    vm.runInThisContext(`(require, module, exports) => {${outputText}\n}`, {
      filename: resolved,
    })(localRequire, loadedModule, loadedModule.exports)
    return loadedModule.exports
  }

  return load
}
