# edam-prettier-loader
[![NPM version](https://img.shields.io/npm/v/edam-prettier-loader.svg?style=flat-square)](https://www.npmjs.com/package/edam-prettier-loader)
[![NPM Downloads](https://img.shields.io/npm/dm/edam-prettier-loader.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/edam-prettier-loader)

Edam loader for prettier text.

## Why requires it?

* Input

```handlebar
{{#is name '123'}}
var name = "abc";
{{/is}
```

* Output

```javascript
var name = "abc";
```

The output text contains two empty lines between `var name = "abc";`
So we could use `edam-prettier-loader` to format the empty line.

## Usage


### Options
#### filePath? `string`
prettier config file path

**NOTE: The reset options inherit [prettier's options](https://prettier.io/docs/en/options.html#docsNav)**

### Configuring
```javascript
// template config file
module.exports = {
  // ...
  mappers: [{
    test: '*.{jsx,js}',
    loader: [
      'LoDash', // preset loader
      [
        require('edam-prettier-loader'),
        {
          // options
        }
      ]
    ]
  }]
}
```
