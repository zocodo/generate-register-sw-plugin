/* eslint-disable */
const fs = require('fs')
const path = require('path')
const url = require('url')
const { GenerateSW, InjectManifest } = require('workbox-webpack-plugin')

class GenerateRegisterSwPlugin {
  // 将 `apply` 定义为其原型方法，此方法以 compiler 作为参数
  constructor(option = {}) {
    this.workboxInjectManifestOption = option.workboxInjectManifestOption || false
    this.workboxGenrateSWOption = option.workboxGenrateSWOption || false
    this.tplData = option.tplData || {}
    this.injectHtmlPath = option.injectHtmlPath
    this.inject = option.inject || false
    this.swRegisterFileName = option.swRegisterFileName || 'js/swRegister.js'
    this.swFilePath = option.swFilePath || './service-worker.js'
    this.tplData.swFilePath = this.swFilePath
    this.tplPath = option.tplPath || path.resolve(__dirname, './swTpl.js')
    this.analysisTpl.bind(this)
    this.injectToHtml.bind(this)
    this.handleEmit.bind(this)
  }

  apply(compiler) {
    // 指定要附加到的事件钩子函数

    if (this.workboxGenrateSWOption) {
      const sw = new GenerateSW(this.workboxGenrateSWOption)
      sw.apply(compiler)
    }

    if (this.workboxInjectManifestOption) {
      const preManifest = new InjectManifest(this.workboxInjectManifestOption)
      preManifest.apply(compiler)
    }

    if ('hooks' in compiler) {
      // We're in webpack 4+.
      compiler.hooks.emit.tapPromise(
        'GenerateRegisterSwPlugin',
        compilation => this.handleEmit(compilation)
      );
    } else {
      // We're in webpack 2 or 3.
      compiler.plugin('emit', (compilation, callback) => {
        this.handleEmit(compilation).then(callback).catch(callback);
      });
    }
  }

  handleEmit(compilation) {
    return new Promise((res, rej) => {
      const { injectHtmlPath } = this
      if (injectHtmlPath) {
        let files = fs.readFileSync(injectHtmlPath, 'utf8')
        this.injectToHtml(files, injectHtmlPath, compilation)
      } else {
        Object.keys(compilation.assets).forEach((item) => {
          if (/html/.test(item)) {
            let html = compilation.assets[item].source()
            this.injectToHtml(html, item, compilation)
          }
        })
      }
      res()
    })
  }

  analysisTpl() {
    const { tplPath, tplData } = this
    let files = fs.readFileSync(tplPath, 'utf8')
    Object.keys(tplData).forEach((key) => {
      const rex = new RegExp('(\'|\"){{' + key + '}}(\'|\")', 'g')
      let keyObj = tplData[key]
      if (typeof keyObj === 'string') {
        keyObj = `'${keyObj}'`
      }
      files = files.replace(rex, keyObj)
    })
    return files
  }

  injectToHtml(html, name, compilation) {

    const swjs = this.analysisTpl()
    compilation.assets[this.swRegisterFileName] = {
      source: () => {
        return swjs;
      },
      size: () => {
        return swjs.length;
      }
    }

    const bodyRegExp = /(<\/html>(\s*|\n*)$)/i;
    if (html.length) {
      // Append assets to body element
      if (this.inject) {
        html = html.replace(bodyRegExp, match => {
          return `\n<script>\n${swjs}\n</script>\n${match}`
        });
      } else {
        let staticPath = compilation.outputOptions.publicPath || '/'
        const jsPath = url.resolve(staticPath, this.swRegisterFileName)
        html = html.replace(bodyRegExp, match => {
          return `\n<script src="${jsPath}?v=${this.tplData.version}" crossorigin="anonymous"></script>\n${match}`
        });
      }
    }
    compilation.assets[name] = {
      source: () => {
        return html;
      },
      size: () => {
        return html.length;
      }
    }
  }
}

module.exports = GenerateRegisterSwPlugin;
