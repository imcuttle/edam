---
title: "书写Loader"
order: 3
---

模板配置中与 Loader 相关的字段有 `mappers` `loaders`

* `loaders` 形如
```text
{
  module: require('./loaders/module'),
  foo: [require('./loaders/foo')],
  LoDash: [
    [require('./loaders/lodash'), { /*options*/ }]
  ]
}
```
用于定义 loader 集合，预设两种 Loader: [`LoDash`](https://lodash.com/docs/4.17.5#template) `module`.

LoDash 为模板替换 Loader，在文本中书写 `<%= name %>` 将会被替换。

而 `module` Loader 较为特殊，不是模板引擎替换，而是以 commonjs 的规范处理输出 JSON 数据，所以非常适合于json文本的处理。

如，书写一个名为 `package.json.js` 的文件

```javascript
// @loader module?indent=2

module.exports = function({ _, test, description, name } = {}) {
  const pkg = {
    name,
    version: '0.0.1',
    dependencies: {},
    main: 'edam.js',
    description: description,
    author: _.git.name,
    scripts: {
      test: 'jest'
    },
    keywords: ['edam-template'],
    repository: _.git.name + '/' + name
  }

  if (!test) {
    delete pkg.scripts.test
  }

  return pkg
}
```

module Loader 将会输出为 `JSON.stringify(pkg, null, indent)`.

* `mappers` 形如

```text
[
  {
    // glob
    test: '*.ts',
    loader: 'LoDash?query'
  }
]
```

用于分发文件使用哪个`loader`，默认都采用 LoDash Loader 和 hbs Loader。

**注意：Edam@3 将会移除 LoDash Loader，默认引入 [Plop Handlebar](https://plopjs.com/documentation/#built-in-helpers) Loader**
Plop Handlebar 使用 Handlebar 模板，注入了一些 helper:

- camelCase: changeFormatToThis
- snakeCase: change_format_to_this
- dashCase/kebabCase: change-format-to-this
- dotCase: change.format.to.this
- pathCase: change/format/to/this
- properCase/pascalCase: ChangeFormatToThis
- lowerCase: change format to this
- sentenceCase: Change format to this,
- constantCase: CHANGE_FORMAT_TO_THIS
- titleCase: Change Format To This

介绍完 loader 相关的概念后，进入正文：书写Loader

## 怎么书写Loader

官方提供两种预设Loader，可以提供参考
* [LoDash](https://github.com/imcuttle/edam/blob/master/packages/edam/src/core/Compiler/loaders/lodash.ts)
* [module](https://github.com/imcuttle/edam/blob/master/packages/edam/src/core/Compiler/loaders/module.ts)


### Raw Loader

Raw Loader 中第一个接受的值为 Buffer 类型。如下 Base64 Loader 就是一个 Raw Loader
```javascript
module.export = function (buffer, variables) {
  // const options = this.options
  return buffer.toString('base64')
}
// NOTE
module.export.raw = true
```

### Synchronization

如不指定 `raw` 为 `true`，则第一个接受值为字符串。如下Loader将小写转大写。

```javascript
module.exports = function (string) {
  return string.toUpperCase()
}
```

### Asynchronization

同时Loader支持异步返回，如下：
```javascript
module.exports = function (string) {
  return new Promise(resolve => resolve(string.toUpperCase()))
}
```

### allowError (>=2.3.5)

如果 loader 对于最终结果产生影响不大的话，使用 `allowError` 表示loader允许错误发生，不会对输出的结果产生影响
如 `edam-prettier-loader` 只是对最终结果美化，对于最终结果没有影响

//```javascript
module.exports = function (string) {
  return new Promise(resolve => resolve(string.toUpperCase()))
}
module.exports.allowError = true
```
