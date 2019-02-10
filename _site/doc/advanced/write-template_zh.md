---
title: "书写模板"
order: 2
---

模板是 Edam 一个重要的概念，可以说核心就是模板处理。

流程如下：

1. 根据模板配置中的 `prompts` 数组字段来进行用户输入交互，获取用户输入；  
   使用 [inquirer.js](https://github.com/SBoudrias/Inquirer.js/)
2. 模板配置中的 `root` 值，root 为模板文件夹的目录，默认为 `./template`；
3. 读取 `root` 中的文件数据，忽略掉 `ignore` 字段中的文件，规则同 `.gitignore`
4. 分析配置中的 loader，对文件数据进行处理转换  
    关于 Loader 描述请转至[书写 Loader](./write-loader_zh.md)
   * 规则一（最高优先）：文件文本，如首行匹配如下任意一种语法：
     ```text
     // @loader ${LOADER_NAME}?${QUERY}
     /* @loader ${LOADER_NAME}?${QUERY} */
     # @loader ${LOADER_NAME}?${QUERY}
     <!-- @loader ${LOADER_NAME}?${QUERY} -->
     ```
     则将使用 LOADER_NAME 进行处理，LOADER_NAME 对应与 `loaders` 中定义的 loader
   * 规则二：匹配 `mappers` 中的 `test`，第一个匹配到的 loader 将会被使用。
5. 得到转换后的文件目录结构，根据 `copy` `move` 进行文件的负责和移动；
6. 写入输出文件夹后，触发 usefulHook，调用 post 钩子。

**注意：在 edam 模板项目 `package.json` 中，匹配 fields 优先顺序为 `edam:main` > `main`**

## 配置项

允许直接 exports 配置，或者 `module.exports = edam => ({ /*config*/ })`

### prompts

用户输入值的交互定义

* type: `[]`

  参考[inquirer.js](https://github.com/SBoudrias/Inquirer.js/)
  
### process

`edam >= 2.0.1`  返回除去 `prompts` 配置以外的所有配置项

* type: `function`

如：
```javascript
{
  process(answer) {
    return {
      ignore: [],
      root: 'anc'
    }
  }
}
```



### root

* type: `string`

  模板文件夹的目录，默认为 `./template`
  或者 `answer => './template'`

### ignore

忽略哪些文件

* type: `string[]`

  或者 `(answers) => []`

### variables

* type `{}`
* example

  ```javascript
  {
    date: new Date(),
    val: 'abc'
  }
  // 或者
  (answers) => ({})
  ```

### hooks

一些生命周期绑定的钩子，常用的是 `post` (在输出文件之后触发).
允许 function 或者 script

```javascript
hooks: {
  'post': ['touch Readme.md']
}
```

或者 `(answers) => ({})`

### loaders 和 mappers

与 Loader 相关，请转至[书写 Loader](./write-loader_zh.md)查看详情。

### move

移动文件

* type: `{}`

```javascript
{
  'package.json.js': 'package.json',
  'test/**': 'tests/',
  // 特殊含义的占位符: [path] / [name] / [ext] / [base]
  // 如  root/abc.js -> 
  //   path: `root/`
  //   name: `abc`
  //   ext: `.js`
  //   base: `abc.js`
  '**/*.hbs': '[path][name].js'
}
```

或者 `(answers) => ({})`

### copy

复制文件，同 `move`

### usefulHook

一些常用的 hook 快捷方式

* gitInit

  是否 `git init`

  * type: `boolean`
  * default: `false`

* installDependencies

  是否安装 `package.json` 中的 Dependencies
  使用 `npm` 或 `yarn` 由用户配置中的 `pull.npmClient` 指定

  * type: `boolean`
  * default: `false`

* installDevDependencies

  是否安装 `package.json` 中的 Dev Dependencies

  * type: `boolean`
  * default: `false`

或者 `(answers) => ({})`

## 尾声

官方已经有的一个模板 repo: [edam-vendor](https://github.com/imcuttle/edam-vendor) 可以参考。

利用不同的分支进行管理。
