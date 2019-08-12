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
      inject: true,
      injectHtmlPath: './example/index.html',
      tplData: {
        version: Date.now(),
        isOpenPWA: true
      }
    })
  ]
};
