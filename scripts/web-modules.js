import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"))
const dependencies = packageJson.dependencies || {}

for (const name of Object.keys(dependencies)) {
  const filePath = path.join("web_modules", `${name}.js`)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })

  console.log(`Bundling ${name} -> ${filePath}`)

  const command = `npx esbuild "${name}" --bundle --format=esm --platform=browser --minify --sourcemap --outfile=${filePath}`
  execSync(command, { encoding: "utf-8" })
}
