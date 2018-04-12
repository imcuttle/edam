---
title: "执行流程"
order: 1
---

本文将讲解 Edam 的内部原理。流程如下图：
![](../imgs/edam-process.svg)

1. 读取用户配置
2. [插件](./write-plugin_zh.md)注册
3. 校验配置是否合法（使用[walli](https://github.com/imcuttle/walli)）
4. 获取模板来源
5. 安装模板中的依赖
6. 读取模板配置
7. 用户交互输入
8. 载入模板文件资源
9. [处理转换](./write-loader_zh.md)模板文件资源文本，触发生命钩子
10. 输出文件
11. 触发 usefulHooks, post 钩子
12. 结束

### 用户配置

该配置用于用户，用于定义一下模板来源`source/alias`。

详细的定义在[选项一节](../usage/options_zh.md).

### 模板（开发者）配置

该配置用于一个模板中，详细请看[如何书写模板](./write-template_zh.md)

### 三种预设模板拉取方式

1. git
2. npm
3. 本地文件

更多介绍参看[特性一节](../features_zh.md)。
