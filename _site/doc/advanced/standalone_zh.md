---
title: "独立cli"
order: 6
---

本文介绍如何使用 edam 去书写自己的 project init cli(类似于 create-react-app)。

* 安装 edam

```bash
npm install edam --save
```

* 书写模板

如文件结构目录如下：

```
template/
  ...
edam.js
cli.js
```

`edam.js` 为 edam 模板的配置

* cli.js

```javascript
const edam = require('edam').default

const em = edam({
  source: './edam.js',
  output: process.args[2],
  userc: false
}, { cwd: process.cwd() })

em
  .run()
  .then(fp =>
    fp.writeToFile(void 0, { overwrite: false, clean: false })
  )
  .then(passed => passed && console.log('Done!'))
  .catch(console.error)
```
