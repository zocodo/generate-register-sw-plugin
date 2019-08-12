### 使用方法
* swFilePath： service-worker 的规则文件路径，该字段会 替换模版中的 {{swFilePath}} 字符串，具体请看 build/swTpl.js 文件

* swRegisterFileName：生成的注册 service-worker 的 js 文件路径，没有默认使用 js/swRegister.js 路径

* tplPath：生成的注册 service-worker 的 js 文件的参照模版路径，没有即将使用默认 build/swTpl.js 文件

* inject：是否注册 service-worker 的代码直接插入到 html 的最后面，默认 false ，false 将会以外链的方式插入到最后面，使用该功能需要把该插件放到 html-webpack-plugin 后面，否则会找不到 html 文件

* tplData：模版所需要的字段，{{env}} 会被替换成 env 值的字符串，具体请看 build/swTpl.js 文件

* injectHtmlPath: 存在该字段的时候,会在这个 html 下注入js 代码,并且忽略 html-webpack-plugin 的 html
```
new GenerateRegisterSWJS({
    swFilePath: './service-worker.' + process.env.BUILD_ENV + '.js',
    swRegisterFileName: 'js/swRegister.js',
    tplPath: undefined,
    inject: false,
    injectHtmlPath: './example/index.html',
    tplData: {
      env: process.env.BUILD_ENV,
      version: BUILD_VERSION,
      isOpenPWA: process.env.BUILD_ENV === 'dev' ? true : true
    }
  })
})
```
