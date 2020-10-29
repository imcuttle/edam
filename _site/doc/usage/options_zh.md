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

- Type: `string[]`

Extends external edam configuration files.

| default | cli                         |
| ------- | --------------------------- |
| `[]`    | `--extends=<string,string>` |

### plugins

- Type: `string[]|[[Function, object]]|Function[]`

插件注册

| default | cli                         |
| ------- | --------------------------- |
| `[]`    | `--plugins=<string,string>` |

### debug

- Type: `boolean`

Enable debug mode for verbose log (Don't works when silent is true).

| default | cli                      |
| ------- | ------------------------ |
| `false` | `-d, --debug=true|false` |

### pull.npmClient

- Type: `npm|yarn`

Appoints to the command when installing package form npmjs.com.

| default | cli                          |
| ------- | ---------------------------- |
| `npm`   | `--pull.npm-client=<string>` |

### pull.npmClientArgs

- Type: `npm|yarn`

Appoints to the command's arguments when installing package. eg. `--pull.npm-client-args="--registry=http://example.com"`

| default  | cli                               |
| -------- | --------------------------------- |
| string[] | `--pull.npm-client-args=<string>` |

### pull.git

- Type: `clone|download`

Uses which way to pull git repo.

| default | cli                   |
| ------- | --------------------- |
| `clone` | `--pull.git=<string>` |

### userc

- Type: `boolean`

Edam can deduce the configuration file from current work directory like `.babelrc`.

| default | cli                  |
| ------- | -------------------- |
| `true`  | `--userc=true|false` |

### yes

- Type: `boolean`

Uses stored prompt's values instead of typing arduously.

| default | cli         |
| ------- | ----------- |
| `false` | `-y, --yes` |

### storePrompts

- Type: `boolean`

Disables storing latest prompt's values.

| default | cli                          |
| ------- | ---------------------------- |
| `true`  | `--store-prompts=true|false` |

### output

- Type: `string`

The output directory.

| default         | cli                              |
| --------------- | -------------------------------- |
| `process.cwd()` | `-o <string>, --output=<string>` |

### silent

- Type: `boolean`

Just shut up.

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
