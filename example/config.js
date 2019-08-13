var GenerateRegisterSWJS = require('../build/index.js')
var path = require('path')

module.exports = {
  entry: path.resolve(__dirname, './file.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'my-first-webpack.bundle.js'
  },
  plugins: [
    new GenerateRegisterSWJS({
      swFilePath: './service-worker.js',
      swRegisterFileName: 'js/swRegister.js',
      tplPath: undefined,
      inject: false,
      injectHtmlPath: './example/index.html',
      tplData: {
        version: Date.now(),
        isOpenPWA: true
      },
      workboxGenrateSWOption: {
        swDest: 'service-worker1.js',
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
            urlPattern: /(png|jpe?g|gif|svg|webp|^((?!(service-worker\.(dev|gray|prod)\.js)).)*$|css)/,      // Apply a network-first strategy.
            handler: 'CacheFirst',
            options: {}
          }
        ]
      },
      workboxInjectManifestOption: false
    })
  ]
};
