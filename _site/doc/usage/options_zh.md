---
title: 选项
---

### offlineFallback

- Type: `boolean`

当离线状态下，是否使用本地模板缓存作为兼容方案

| default | cli                             |
| ------- | ------------------------------- |
| `true`  | `--offline-fallback=true|false` |

### updateNotify

- Type: `boolean`

是否提示升级 [update-notifier](https://github.com/yeoman/update-notifier)

| default | cli                          |
| ------- | ---------------------------- |
| `true`  | `--update-notify=true|false` |

### cacheDir

- Type: `string|boolean`

缓存存放的目录路径

| default           | cli                    |
| ----------------- | ---------------------- |
| an computed value | `--cache-dir=<string>` |

### includes

- Type: `string|string[]|Function|RegExp`

哪些文件需要被覆盖（默认包括所有文件）

当你需要覆盖某些文件的时候，可以用该字段，如 `--includes=README.md`

| default      | cli                            |
| ------------ | ------------------------------ |
| `() => true` | `--includes=<string>,<string>` |

### excludes

- Type: `string|string[]|Function|RegExp`

相反与 `inlcudes`

| default       | cli                            |
| ------------- | ------------------------------ |
| `() => false` | `--excludes=<string>,<string>` |

### extends

- Type: `Array<string | { source: string, pick?: string[], omit?: string[] }>`

继承额外的 edam 配置文件；`pick` 和 `omit` 是用来过滤一些额外的配置项的，如只需要继承 alias 字段，则需要配置 `pick: ['alias']` 

| default | cli                         |
| ------- | --------------------------- |
| `[]`    | `--extends=<string,string>` |

### plugins

- Type: `string[]|[[Function, object]]|Function[]`

插件注册列表

| default | cli                         |
| ------- | --------------------------- |
| `[]`    | `--plugins=<string,string>` |

### debug

- Type: `boolean`

开启 debug 模式，当 --silent 开启时不会生效

| default | cli                      |
| ------- | ------------------------ |
| `false` | `-d, --debug=true|false` |

### pull.npmClient

- Type: `npm|yarn`

指定安装 npm 包的客户端

| default | cli                          |
| ------- | ---------------------------- |
| `npm`   | `--pull.npm-client=<string>` |

### pull.npmClientArgs

- Type: `npm|yarn`

指定安装 npm 包时的参数，如 `--pull.npm-client-args="--registry=http://example.com"`

| default  | cli                               |
| -------- | --------------------------------- |
| string[] | `--pull.npm-client-args=<string>` |

### pull.git

- Type: `clone|download`

指定拉取 git 仓库的方式；
- clone: 使用 git clone
- download: download tar 包

| default | cli                   |
| ------- | --------------------- |
| `clone` | `--pull.git=<string>` |

### userc

- Type: `boolean`

是否使用 运行时配置文件，如 `.edamrc` / package.json 中 `edam` 配置

| default | cli                  |
| ------- | -------------------- |
| `true`  | `--userc=true|false` |

### yes

- Type: `boolean`

使用默认值问答，而不是需要输入交互

| default | cli         |
| ------- | ----------- |
| `false` | `-y, --yes` |

### storePrompts

- Type: `boolean`

是否存储问答交互

| default | cli                          |
| ------- | ---------------------------- |
| `true`  | `--store-prompts=true|false` |

### output

- Type: `string`

输出文件夹

| default         | cli                              |
| --------------- | -------------------------------- |
| `process.cwd()` | `-o <string>, --output=<string>` |

### silent

- Type: `boolean`

静默模式

| default | cli            |
| ------- | -------------- |
| `false` | `-s, --silent` |

### overwrite

- Type: `boolean`

是否覆盖已经存在的文件

| default | cli               |
| ------- | ----------------- |
| `false` | `-w, --overwrite` |

### clean

- Type: `boolean`

在写入之前，是否清空输出目录

| default | cli       |
| ------- | --------- |
| `false` | `--clean` |
