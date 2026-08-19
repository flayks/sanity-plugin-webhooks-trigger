import pluginKitOxlint from '@sanity/plugin-kit/oxlint'
import {defineConfig} from 'oxlint'

// The preset enables react/react-compiler, which oxlint 1.79 does not ship yet
const rules = {...pluginKitOxlint.rules}
delete (rules as Record<string, unknown>)['react/react-compiler']

export default defineConfig({
  ...pluginKitOxlint,
  rules,
  overrides: [
    ...(pluginKitOxlint.overrides ?? []),
    {
      files: ['test/**'],
      // node:test returns a promise that is not meant to be awaited
      rules: {'typescript/no-floating-promises': 'off'},
    },
  ],
})
