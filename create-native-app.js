import { execSync } from 'node:child_process'
import { copyFileSync, renameSync } from 'node:fs'
import { join } from 'node:path'

const appName = 'InlineApp'

console.log('⌛ Initializing a fresh RN project...')

execSync(`bunx react-native init ${appName} --skip-git-init true --install-pods true`, {
  stdio: 'inherit',
})

renameSync(appName, 'app')

copyFileSync('native/App.tsx', 'app/App.tsx')
// Enable experimental support for package "exports".
copyFileSync('native/metro.config.js', 'app/metro.config.js')

// Install this package locally, avoiding symlinks.
execSync('npm install $(npm pack .. | tail -1) --legacy-peer-deps', {
  cwd: join(process.cwd(), 'app'),
  stdio: 'inherit',
})

console.log('')
console.log('🍞 React Native App created inside /app.')
console.log('🛠️  To run the example with the plugin included:')
console.log('🐚 cd app')
console.log('🐚 npm run ios / npm run android')
console.log('🌪️  To copy over the changes from the plugin source run:')
console.log('🐚 npm run watch')
console.log('🛠️  This will copy changes over to the app.')
