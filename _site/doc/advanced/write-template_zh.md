---
title: "书写模板"
order: 2
---

模板是 Edam 一个重要的概念，可以说核心就是模板处理。

流程如下：

1. 根据模板配置中的 `prompts` 数组字段来进行用户输入交互，获取用户输入；  
   使用 [inquirer.js](https://github.com/SBoudrias/Inquirer.js/)

2. 模板配置中的 `root` 值，root 为模板文件夹的目录，默认为 `./template`；
3. 读取 `root` 中的文件数据
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
