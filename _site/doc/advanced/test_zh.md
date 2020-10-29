---
title: "单元测试"
order: 7
---

```javascript
const { mockPrompts } = require("edam");

const fp = await mockPrompts(
  "/path/to/template",
  {
    // prompts 值
    name: "foo"
  },
  {
    // edam config
  }
);

// 输出结构内容
console.log(fp.tree);

// 写入到文件
await fp.writeToFile("/output/path", { overwrite: false, clean: false });
```
