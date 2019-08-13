module.exports = {
  swDest: 'service-worker.js',
  precacheManifestFilename: 'precacheManifest.[manifestHash].js',
  importWorkboxFrom: 'disabled',
  importScripts: 'js/workbox-sw.js',
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [
    {
      urlPattern: /\.html|activity2019/,
      handler: 'NetworkFirst',
      options: {        // Fall back to the cache after 2 seconds.
        networkTimeoutSeconds: 4,
        cacheableResponse: {
          statuses: [200]
        }
      }
    },
    {
      urlPattern: /(png|jpe?g|gif|svg|webp|^((?!(service-worker.*\.js)).)*$|css)/,  // Apply a network-first strategy.
      handler: 'CacheFirst',
      options: {}
    }
  ]
}