---
title: "Features"
---

<style>
.post {
  max-width: 700px;
  margin: auto;
}
</style>

# Features

![](./imgs/features.svg)

## Inferred Configuration

Edam tracks the first matched configuration starting with `process.cwd()`, and lookup the parent `../` paths and so on like `.babelrc`. ([cosmiconfig](https://github.com/davidtheclark/cosmiconfig))

JSON file `.edamrc` supports human-like syntax like comment.([JSON5](https://github.com/json5/json5))

It's awesome that edam supports `extends` field like [`tsconfig.json`](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

```text
// root/.edamrc
{
  alias: {
    react: 'facebook/react'
  },
  plugins: ['edam-plugin-dulcet-prompt']
}
// root/tpl/.edamrc
{
  extends: ['../.edamrc']
  alias: {
    edam: {
      type: 'git',
      url: 'imcuttle/edam',
      config: {
        output: "./here"
      }
      // The config has higher priority when source equals `edam`
      // Support fields: cacheDir / output / plugins / storePrompts / pull
      // version >= 2.2
    }
  }
}
// root/tpl/.edamrc 
{
  alias: {
    edam: {
      type: 'git',
      url: 'imcuttle/edam',
      config: {
        output: "./here"
      }
    },
    react: 'facebook/react'
  },
  plugins: ['edam-plugin-dulcet-prompt']
}
```

## Three pull ways

Supports `npm/git/file`

### `npm`

Pulls template assets from `npm` like `npm:edam@1.1.1` or shape of the follow in file.

```text
{
  source: {
    type: 'npm',
    url: 'edam',
    version: 'latest'
  }
}
```

### git

`github:imcuttle/cuttle?checkout=master`

```text
{
  source: {
    type: 'git',
    url: 'https://github.com/imcuttle/edam.git',
    // branch / commit SHA / tag
    checkout: 'master'
  }
}
```

### file

It's easy to understand.

## Prompts-hold

Edam could save the latest user-input when `storePrompts` is on. and you can avoid the frequent input passing `yes` flag.

## Loader

Please checks out [here](./advanced/write-template.md).

## CLI auto-completer

[edam-completer](https://github.com/imcuttle/edam/blob/master/packages/edam-completer/Readme.md)
