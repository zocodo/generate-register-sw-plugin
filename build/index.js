/* eslint-disable */
const fs = require('fs')
const path = require('path')
const url = require('url')


class GenerateRegisterSwPlugin {
  // 将 `apply` 定义为其原型方法，此方法以 compiler 作为参数
  constructor(option = {}) {
    this.tplData = option.tplData || {}
    this.injectHtmlPath = option.injectHtmlPath
    this.inject = option.inject || false
    this.swRegisterFileName = option.swRegisterFileName || 'js/swRegister.js'
    this.swFilePath = option.swFilePath || './service-worker.js'
    this.tplData.swFilePath = this.swFilePath
    this.tplPath = option.tplPath || path.resolve(__dirname, './swTpl.js')
    this.analysisTpl.bind(this)
    this.injectToHtml.bind(this)
  }

  apply(compiler) {
    // 指定要附加到的事件钩子函数
    compiler.hooks.emit.tapAsync(
      'GenerateRegisterSwPlugin',
      (compilation, callback) => {

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
        callback()
      }
    );
  }

  analysisTpl() {
    const { tplPath, tplData } = this
    let files = fs.readFileSync(tplPath, 'utf8')
    Object.keys(tplData).forEach((key) => {
      const rex = new RegExp('{{' + key + '}}', 'g')
      files = files.replace(rex, tplData[key])
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
