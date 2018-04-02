# edam-prettier-loader

edam Loader for prettier text.

## Why requires it?

* Input

```ejs
<% if (name === '123') {%>
var name = "abc";
<%}%>
```

* Output

```ejs
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
  mappers: {
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
  }
}
```
