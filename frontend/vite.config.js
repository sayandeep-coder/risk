// Vite config for GitHub Pages deployment
// Sets the correct base path for project pages hosted at https://<user>.github.io/<repo>/
// Repo: sayandeep-coder/risk -> base must be "/risk/"

import { defineConfig } from 'vite'

export default defineConfig({
  // IMPORTANT: keep trailing slash
  base: '/risk/',
})
