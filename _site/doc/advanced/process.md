---
title: Principle
order: 1
---

There are about edam internal principles and processing.
![](../imgs/edam-process.svg)

1. Reads User-Configuration(`.edam.rc/edam.config.js`).
2. Registers [Plugins](./write-plugin.md).
3. Checks the config is legal by [walli](https://github.com/imcuttle/walli)
4. Pulls the template from exact source.
5. Installs template's dependencies.
6. Gets the configuration of template.
7. Gets values through interactive communication.
8. Loads template assets.
9. [Transforms](./write-loader.md) and triggers life cycle hooks.
10. Output the result to file.
11. Triggers `usefulHooks` and `post` hooks.
12. End


### User Configuration

The configuration declaring template sources is suit for users.

Please check out [Options](../usage/options.md) for more information.

### Template (Development) Configuration

There are located in template files, Please check out ["How to write a template"](./write-template.md) for more information.

### Three Pull Ways

1. git
2. npm
3. local files

Checks out ["Features"](../features.md)。
