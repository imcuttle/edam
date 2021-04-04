/* eslint-disable quotes */
/**
 * @file Compiler
 * @author Cuttle Cong
 * @date 2018/3/27
 * @description
 */
import Compiler from '../../core/Compiler'
import DefaultLogger from '../../core/DefaultLogger'
import { join } from 'path'
import fileSystem from '../../lib/fileSystem'

describe('Compiler', function() {
  let cer,
    cwd = join(__dirname, '../fixture')

  beforeEach(function() {
    cer = new Compiler({
      hookCwd: cwd
    })
    cer.logger = new DefaultLogger()
    // cer.loaders = {
    //   LoDash: require('../../core/Compiler/loaders/lodash')
    // }
    cer.variables.setStore({
      name: 'pig'
    })
  })

  if (process.platform !== 'win32') {
    it('should Compiler hook worker instance of function', () => {
      const h = cer.addHook('hook', 'echo abc')
      expect(h).toBeInstanceOf(Function)
    })

    it('should Compiler hook worker on script once', async () => {
      const date = new Date().getTime()
      cer.addHook(
        'hook',
        'echo $HOOK_PARAMS && echo $HOOK_PARAMS ' + date + ' > compiler/date',
        { type: 'once' }
      )
      const params = ['2222', ['2', '23']]
      await cer.emit.apply(cer, ['hook'].concat(params))
      await cer.emit('hook', 'hhh')

      expect(
        await fileSystem.readFile(join(cwd, 'compiler/date'), {
          encoding: 'utf8'
        })
      ).toBe(JSON.stringify(params) + ' ' + date + '\n')
    })

    it('should Compiler hook worker on script always', async () => {
      const date = new Date().getTime()
      const h = cer.addHook(
        'hook',
        'echo $HOOK_PARAMS && echo $HOOK_PARAMS ' + date + ' > compiler/date',
        { type: 'on' }
      )
      let params = ['2222', ['2', '23']]
      await cer.emit.apply(cer, ['hook'].concat(params))
      expect(
        await fileSystem.readFile(join(cwd, 'compiler/date'), {
          encoding: 'utf8'
        })
      ).toBe(JSON.stringify(params) + ' ' + date + '\n')

      params = ['abc']
      await cer.emit.apply(cer, ['hook'].concat(params))
      expect(
        await fileSystem.readFile(join(cwd, 'compiler/date'), {
          encoding: 'utf8'
        })
      ).toBe(JSON.stringify(params) + ' ' + date + '\n')

      cer.removeHook('hook', h)
      params = ['abc', 'xxx']
      await cer.emit.apply(cer, ['hook'].concat(params))
      expect(
        await fileSystem.readFile(join(cwd, 'compiler/date'), {
          encoding: 'utf8'
        })
      ).not.toBe(JSON.stringify(params) + ' ' + date + '\n')
    })
  }

  it("should compiler's loader works normal", async function() {
    cer.variables.setStore({
      name: 'pigAbc'
    })
    cer.assets = {
      'test.js': {
        value: 'Hello,{{name}}',
        // load
      },
      'test.a.js': {
        value: 'Hello,A,{{name}} {{paramCase name}}',
      }
    }

    const tree = await cer.run()
    expect(tree).toEqual(
      expect.objectContaining({
        'test.js': expect.objectContaining({
          output: 'Hello,pigAbc',
          input: 'Hello,{{name}}',
          loaders: ['hbs']
        }),
        'test.a.js': expect.objectContaining({
          input: 'Hello,A,{{name}} {{paramCase name}}',
          output: 'Hello,A,pigAbc pig-abc',
          loaders: ['hbs']
        })
      })
    )
  })

  it('should works on custom loader', async function() {
    cer.mappers = [
      {
        test: '*',
        loader: [
          function(content, variables) {
            const options = this.options
            return JSON.stringify({
              name: variables.name,
              content,
              options
            })
          }
        ]
      },
      {
        test: '*.js',
        loader: 'hbs'
      }
    ]

    cer.variables.assign({
      _: {abc: 'abc'}
    })

    cer.assets = {
      'test.js': {
        value: new Buffer('Hello,{{ name}}'),
        // load
      },
      'test.a.js': {
        value: '// @loader hbs?v=1.2.3 \nHello,A,{{ name}} {{_.abc}}'
        // load
      }
    }

    const tree = await cer.run()
    expect(tree).toEqual(
      expect.objectContaining({
        'test.js': expect.objectContaining({
          output: JSON.stringify({
            name: 'pig',
            content: 'Hello,{{ name}}',
            options: {}
          }),
          input: new Buffer('Hello,{{ name}}')
        }),
        'test.a.js': expect.objectContaining({
          input: 'Hello,A,{{ name}} {{_.abc}}',
          output: 'Hello,A,pig abc',
          loaders: 'hbs'
        })
      })
    )
  })

  it('should loaders works on outside options', async function() {
    cer.mappers = [
      {
        test: '*',
        loader: [
          [
            function() {
              const options = this.options
              return 'options:' + options.name
            },
            {
              name: 'haha'
            }
          ]
        ]
      },
      {
        test: '*.js',
        loader: 'hbs'
      }
    ]

    cer.assets = {
      'test.js': {
        value: 'Hello,{{ name}}'
        // load
      }
    }

    const tree = await cer.run()
    expect(tree).toEqual(
      expect.objectContaining({
        'test.js': expect.objectContaining({
          output: 'options:' + 'haha',
          input: 'Hello,{{ name}}'
        })
      })
    )
  })

  it('should loaders works on inline options', async function() {
    cer.loaders = {
      cus: [
        [
          function() {
            const options = this.options
            return 'options:' + options.name
          },
          {
            name: 'haha'
          }
        ]
      ]
    }
    cer.mappers = [
      {
        test: '*.js',
        loader: 'hbs'
      }
    ]

    cer.assets = {
      'test.js': {
        value: '/* @loader cus?name=abc */ Hello,{{ name}}'
        // load
      }
    }

    const tree = await cer.run()
    expect(tree).toEqual(
      expect.objectContaining({
        'test.js': expect.objectContaining({
          output: 'options:' + 'abc',
          input: 'Hello,{{ name}}'
        })
      })
    )
  })

  it('should loaders works on assets loaders', async function() {
    cer.loaders = {
      cus: [
        [
          function() {
            const options = this.options
            return 'options:' + options.name
          },
          {
            name: 'haha'
          }
        ]
      ]
    }

    cer.assets = {
      'test.js': {
        value: 'Hello,{{ name}}',
        loaders: 'cus?name=abc'
      }
    }

    const tree = await cer.run()
    expect(tree).toEqual(
      expect.objectContaining({
        'test.js': expect.objectContaining({
          output: 'options:' + 'abc',
          input: 'Hello,{{ name}}'
        })
      })
    )
  })

  it('should detect legacy lodash loader', async function() {
    cer.logger.error = jest.fn(cer.logger.error)

    cer.assets = {
      'test.js': {
        value: 'Hello, <%=name%> \n <%=name%>  \n {{ name}}',
        loaders: 'hbs'
      }
    }
    cer.variables.setStore({ name: '<foo></foo>' })

    const tree = await cer.run()
    expect(tree).toEqual(
      expect.objectContaining({
        'test.js': expect.objectContaining({
          output: 'Hello, <%=name%> \n <%=name%>  \n &lt;foo&gt;&lt;/foo&gt;',
          input: 'Hello, <%=name%> \n <%=name%>  \n {{ name}}'
        })
      })
    )

    expect(cer.logger.error).toHaveBeenCalledTimes(2)
    expect(cer.logger.error).toBeCalledWith(
      expect.stringContaining('test.js:2:2'),
      'Detected using the deprecated Lodash loader, please replace it (https://bit.ly/2CYM8lC) by handlebar.'
    )
  })

  it('should handlebar helps works', async function() {
    cer.assets = {
      'test.js': {
        value: 'Hello, {{#is name "foo"}}heihei{{/is}}',
        loaders: 'hbs'
      }
    }
    cer.variables.setStore({ name: 'foo' })

    const tree = await cer.run()
    expect(tree).toEqual(
      expect.objectContaining({
        'test.js': expect.objectContaining({
          output: 'Hello, heihei'
        })
      })
    )

    cer.variables.setStore({ name: 'bar' })
    expect(await cer.run()).toEqual(
      expect.objectContaining({
        'test.js': expect.objectContaining({
          output: 'Hello, '
        })
      })
    )
  })

  it('should `includes` works', async function() {
    cer.assets = {
      'test.js': {
        value: 'Hello, test.js'
      },
      'test.jsx': {
        value: 'Hello, test.jsx'
      },
      'main.test.js': {
        value: 'Hello, main.test.js'
      }
    }
    cer.includes = '*.js'

    const tree = await cer.run()
    expect(Object.keys(tree)).toEqual(['test.js', 'main.test.js'])
  })

  it('should `excludes` works', async function() {
    cer.assets = {
      'test.js': {
        value: 'Hello, test.js'
      },
      'test.jsx': {
        value: 'Hello, test.jsx'
      },
      'main.test.js': {
        value: 'Hello, main.test.js'
      }
    }
    cer.excludes = '*.js'

    const tree = await cer.run()
    expect(Object.keys(tree)).toEqual(['test.jsx'])
  })

  it('should `includes & excludes` works', async function() {
    cer.assets = {
      'test.js': {
        value: 'Hello, test.js'
      },
      'test.jsx': {
        value: 'Hello, test.jsx'
      },
      'main.test.js': {
        value: 'Hello, main.test.js'
      },
      'abc/main.js': {
        value: ''
      }
    }
    cer.includes = ['*.{jsx,js}', '!*/*']
    cer.excludes = '*.jsx'

    const tree = await cer.run()
    expect(Object.keys(tree)).toEqual(['test.js', 'main.test.js'])
  })
})
