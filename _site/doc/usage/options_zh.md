---
title: 选项
---

### offlineFallback

- Type: `boolean`

Fallback to local cache assets when you are offline.

| default | cli                             |
| ------- | ------------------------------- |
| `true`  | `--offline-fallback=true|false` |

### updateNotify

- Type: `boolean`

Notifies the latest upgrade information like npm
By [update-notifier](https://github.com/yeoman/update-notifier)

| default | cli                          |
| ------- | ---------------------------- |
| `true`  | `--update-notify=true|false` |

### cacheDir

- Type: `string|boolean`

Appoints to the cache where to store. It should be a directory path.

| default          | cli                    |
| ---------------- | ---------------------- |
| a computed value | `--cache-dir=<string>` |

### extends

- Type: `string[]`

Extends external edam configuration files.

| default | cli                         |
| ------- | --------------------------- |
| `[]`    | `--extends=<string,string>` |

### plugins

- Type: `string[]|[[Function, object]]|Function[]`

The plugins you requires.

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
