import { defineConfig } from "cypress"
import task from '@cypress/code-coverage/task'
import getCompareSnapshotsPlugin from 'cypress-image-diff-js/dist/plugin'

export default defineConfig({
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
    setupNodeEvents(on, config) {
      task(on, config)
      // include any other plugin code...
      getCompareSnapshotsPlugin(on, config)
      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config
    }
  },
  video: false,
  env: {
    preserveOriginalScreenshot: true
  },
  viewportWidth: 1000,
  viewportHeight: 660
})
