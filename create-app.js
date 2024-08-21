// biome-ignore lint/correctness/noNodejsModules: Used for development only.
import { execSync } from 'node:child_process'
// biome-ignore lint/correctness/noNodejsModules: Used for development only.
import { copyFileSync, cpSync, mkdirSync, renameSync, rmSync } from 'node:fs'
// biome-ignore lint/correctness/noNodejsModules: Used for development only.
import { join, resolve } from 'node:path'
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

// biome-ignore lint/suspicious/noConsoleLog: Used for development only.
console.log('🍞 React Native App created inside /app.')
