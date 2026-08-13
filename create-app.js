import { execSync } from 'node:child_process'
import { copyFileSync, cpSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'
import Arborist from '@npmcli/arborist'
import packlist from 'npm-packlist'

// This script enhances source files inside /app with a fresh React Native template.
const appName = 'InlineApp'

execSync(`bunx @react-native-community/cli init ${appName} --skip-git-init true --install-pods true`, { stdio: 'inherit' })
copyFileSync('app/App.tsx', `${appName}/App.tsx`)
rmSync('app', { recursive: true })
renameSync(appName, 'app')

const packageDirectory = resolve('./app/node_modules/epic-inline')
const arborist = new Arborist({ path: process.cwd() })
const tree = await arborist.loadActual()
const files = await packlist(tree)

mkdirSync(packageDirectory, { recursive: true })
for (const file of files) {
  cpSync(join(process.cwd(), file), join(packageDirectory, file), {
    recursive: true,
  })
}

// TODO load dependencies from "dependencies" field.
execSync('bun install color-convert parse-color simple-swizzle', { cwd: join(process.cwd(), 'app') })

// biome-ignore lint/suspicious/noConsole: Used for development only.
console.log('🍞 React Native App created inside /app.')
