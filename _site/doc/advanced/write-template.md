---
title: "Write a template"
order: 2
---

Template is the most significant concept. the processing is follows.

1. Get user's answers by `prompts`.
2. Read `root` files, filter the files by `ignore`.
3. Transform file content using [Loader](./write-loader.md)

   * Rule one(top priority): matching the text from the file's first line.

   ```text
   // @loader ${LOADER_NAME}?${QUERY}
   /* @loader ${LOADER_NAME}?${QUERY} */
   # @loader ${LOADER_NAME}?${QUERY}
   <!-- @loader ${LOADER_NAME}?${QUERY} -->
   ```

   * Rule two(normal priority): matching loader from the `test` field of `mappers`.

4. Adjust files struction by `copy` and `move`.
5. Trigger `usefulHook` then `post` hooks

## Config

Allows exporting config object directly, or callable.

`module.exports = { /*config*/ }`
`module.exports = edam => ({ /*config*/ })`

### process

`edam >= 2.0.1`  Returns the object which excludes `prompts`.

* type: `function`

Eg：
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

### prompts

User's interaction definition.

* type: `[]`

  references to [inquirer.js](https://github.com/SBoudrias/Inquirer.js/)

### root

Template files' root.

* type: `string`
* default: `./template`

### ignore

Files' filter

* type: `string[]`

  Or `answers => []`

### variables

* type `{}`
* example

  ```javascript
  {
    date: new Date(),
    // NOTE: returns 'abc'
    val: () => 'abc'
  }
  // or
  (answers) => ({})
  ```

### hooks

```javascript
hooks: {
  'post': ['touch Readme.md', function () { ... }]
}
```

### loaders 和 mappers

Check out [Write a loader](./write-loader.md)

### move

```javascript
{
  'package.json.js': 'package.json',
  'test/**': 'tests/'
}
```

or `(answers) => ({})`

### copy

like `move`

### usefulHook

Some useful shortcuts of `post` hook. 

* gitInit

  `git init`

  * type: `boolean`
  * default: `false`

* installDependencies

  install dependencies of `package.json`

  * type: `boolean`
  * default: `false`

* installDevDependencies

  install devDependencies of `package.json`

  * type: `boolean`
  * default: `false`

或者 `(answers) => ({})`
