/**
 * @file test
 * @author Cuttle Cong
 * @date 2018/3/31
 * @description
 */
const { Compiler } = require('edam')

const compiler = new Compiler()
compiler.assets = {
  'test.js': {
    value: `
  var a = '{{{ v }}}'
  if (a === '123') {
    console.log(1)
  } 
`.trim()
  }
}

it('should passed options works', async function() {
  compiler.mappers = [
    {
      test: '*',
      loader: [[require('./'), { semi: true, tabWidth: 4, singleQuote: true }]]
    }
  ]
  const tree = await compiler.run()
  expect(tree['test.js'].output).toBe(
    `var a = '{{{ v }}}';
if (a === '123') {
    console.log(1);
}\n`.trimLeft()
  )
})

it('should passed filePath works', async function() {
  compiler.mappers = [
    {
      test: '*.js',
      loader: [
        'hbs',
        [require('./'), { filePath: __dirname, semi: true }]
      ]
    }
  ]
  compiler.variables.set('v', '123')
  const tree = await compiler.run()
  expect(tree['test.js'].output).toBe(
    `var a = '123';
if (a === '123') {
  console.log(1);
}\n`.trimLeft()
  )
})
