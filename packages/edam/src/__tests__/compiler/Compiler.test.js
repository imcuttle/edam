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
    cer.loaders = {
      LoDash: require('../../core/Compiler/loaders/lodash')
    }
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
    cer.mappers = [
      {
        test: '*.js',
        loader: 'LoDash'
      }
    ]
    cer.assets = {
      'test.js': {
        value: 'Hello,<%= name%>'
        // load
      },
      'test.a.js': {
        value: 'Hello,A,<%= name%>'
        // load
      }
    }

    const tree = await cer.run()
    expect(tree).toEqual(
      expect.objectContaining({
        'test.js': expect.objectContaining({
          output: 'Hello,pig',
          input: 'Hello,<%= name%>',
          loaders: 'LoDash'
        }),
        'test.a.js': expect.objectContaining({
          input: 'Hello,A,<%= name%>',
          output: 'Hello,A,pig',
          loaders: 'LoDash'
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
        loader: 'LoDash'
      }
    ]

    cer.assets = {
      'test.js': {
        value: new Buffer('Hello,<%= name%>')
        // load
      },
      'test.a.js': {
        value: '// @loader LoDash?v=1.2.3 \nHello,A,<%= name%>'
        // load
      }
    }

    const tree = await cer.run()
    expect(tree).toEqual(
      expect.objectContaining({
        'test.js': expect.objectContaining({
          output: JSON.stringify({
            name: 'pig',
            content: 'Hello,<%= name%>',
            options: {}
          }),
          input: new Buffer('Hello,<%= name%>')
        }),
        'test.a.js': expect.objectContaining({
          input: 'Hello,A,<%= name%>',
          output: 'Hello,A,pig',
          loaders: 'LoDash'
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
        loader: 'LoDash'
      }
    ]

    cer.assets = {
      'test.js': {
        value: 'Hello,<%= name%>'
        // load
      }
    }

    const tree = await cer.run()
    expect(tree).toEqual(
      expect.objectContaining({
        'test.js': expect.objectContaining({
          output: 'options:' + 'haha',
          input: 'Hello,<%= name%>'
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
        loader: 'LoDash'
      }
    ]

    cer.assets = {
      'test.js': {
        value: '/* @loader cus?name=abc */ Hello,<%= name%>'
        // load
      }
    }

    const tree = await cer.run()
    expect(tree).toEqual(
      expect.objectContaining({
        'test.js': expect.objectContaining({
          output: 'options:' + 'abc',
          input: 'Hello,<%= name%>'
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
    cer.mappers = [
      {
        test: '*.js',
        loader: 'LoDash'
      }
    ]

    cer.assets = {
      'test.js': {
        value: 'Hello,<%= name%>',
        loaders: 'cus?name=abc'
      }
    }

    const tree = await cer.run()
    expect(tree).toEqual(
      expect.objectContaining({
        'test.js': expect.objectContaining({
          output: 'options:' + 'abc',
          input: 'Hello,<%= name%>'
        })
      })
    )
  })
})
