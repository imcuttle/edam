/* eslint-disable quotes */
/**
 * @file promptProcessor
 * @author Cuttle Cong
 * @date 2018/3/26
 * @description
 */
import prompt from '../core/promptProcessor'
import * as fs from 'fs'
import * as nps from 'path'
import * as os from 'os'

const tempy = require('tempy')
const { sync } = require('rimraf')
const tmpDir = tempy.directory()

jest.mock('inquirer')

const { op } = require('inquirer')

describe('prompt', function() {
  it('should prompt works on simple case', async () => {
    process.nextTick(async () => {
      op.type('cuttle')
      await op.enter()
      await op.enter()
    })

    const answers = await prompt(
      [
        {
          transformer: val => val.toUpperCase(),
          default: 'abc',
          name: 'username2',
          yes: false,
          message: "What's your name?"
        },
        {
          default: 'git:name${git.name}',
          name: 'username',
          // yes: false,
          message: "What's your name?"
        }
      ],
      {
        yes: true,
        context: {
          git: {
            name: 'hello'
          }
        }
      }
    )

    expect(answers).toEqual({
      username2: 'CUTTLE',
      username: 'git:namehello' //'CUTTLE'
    })
  })

  it('should prompt works on complex case', async () => {
    const answers = await prompt(
      [
        {
          transformer: val => val.toUpperCase(),
          default: 'abc',
          name: 'username',
          message: "What's your name?"
        },
        {
          // transformer: val => val.toUpperCase(),
          when: function(ctx) {
            return ctx.username === 'ABC'
          },
          // yes: true,
          default: '${git.name}',
          name: 'password',
          type: 'password',
          message: "What's your password?"
        },
        {
          transformer: val => val.toUpperCase(),
          when: 'password === "hello"',
          // yes: true,
          default: '${git.name}',
          name: 'password2',
          type: 'password',
          message: "What's your password?"
        },
        {
          transformer: val => val.toUpperCase(),
          when: "username === 'abc'",
          // yes: true,
          default: '${git.name}',
          name: 'password3',
          type: 'password',
          message: "What's your password?"
        }
      ],
      {
        yes: true,
        context: {
          git: {
            name: 'hello'
          }
        }
      }
    )

    expect(answers).toEqual({
      username: 'ABC',
      password: 'hello',
      password2: 'HELLO'
      // password3: 'HELLO'
    })
  })

  it('should prompt works on complex case', async () => {
    const answers = await prompt(
      [
        {
          transformer: val => val.toUpperCase(),
          default: 'abc',
          name: 'username',
          message: "What's your name?"
        },
        {
          // transformer: val => val.toUpperCase(),
          when: function(ctx) {
            return ctx.username === 'ABC'
          },
          // yes: true,
          default: '${git.name}',
          name: 'password',
          type: 'password',
          message: "What's your password?"
        },
        {
          transformer: val => val.toUpperCase(),
          when: 'password === "hello"',
          // yes: true,
          default: '${git.name}',
          name: 'password2',
          type: 'password',
          message: "What's your password?"
        },
        {
          transformer: val => val.toUpperCase(),
          when: "username === 'abc'",
          // yes: true,
          default: '${git.name}',
          name: 'password3',
          type: 'password',
          message: "What's your password?"
        }
      ],
      {
        yes: true,
        context: {
          git: {
            name: 'hello'
          }
        }
      }
    )

    expect(answers).toEqual({
      username: 'ABC',
      password: 'hello',
      password2: 'HELLO'
      // password3: 'HELLO'
    })
  })

  describe('store', () => {
    let storePath = nps.join(tmpDir, 'edam-prompts.json')
    beforeEach(() => {
      // remove fail in linux
      sync(tmpDir)
    })
    function readStore() {
      return JSON.parse(fs.readFileSync(storePath).toString())
    }

    it('should prompt works on store case', async () => {
      op.run([op.enter, op.enter])

      const answers = await prompt(
        [
          {
            default: 'abc',
            name: 'username',
            message: "What's your name?"
          },
          {
            default: 'pass',
            name: 'password',
            type: 'password',
            message: "What's your password?"
          }
        ],
        {
          yes: false,
          storePrompts: true,
          cacheDir: tmpDir,
          source: {
            type: 'npm',
            url: 'ttt',
            version: 'latest'
          },
          context: {
            git: {
              name: 'hello'
            }
          }
        }
      )

      expect(answers).toEqual({
        username: 'abc',
        password: 'pass'
      })

      expect(readStore()).toEqual({
        'ttt?version=latest': answers
      })
    })

    it('should prompt works on store case in assign mode', async () => {
      if (os.platform() !== 'darwin') {
        return
      }
      op.run([
        op.enter,
        async () => {
          expect(readStore()).toEqual({
            'ttt?version=latest': {
              username: 'abc'
            }
          })
          await op.enter()
        }
      ])

      const answers = await prompt(
        [
          {
            default: 'abc',
            name: 'username',
            message: "What's your name?"
          },
          {
            default: 'pass',
            name: 'password',
            type: 'password',
            message: "What's your password?"
          }
        ],
        {
          yes: false,
          storePrompts: true,
          cacheDir: tmpDir,
          source: {
            type: 'npm',
            url: 'ttt',
            version: 'latest'
          },
          context: {
            git: {
              name: 'hello'
            }
          }
        }
      )

      expect(answers).toEqual({
        username: 'abc',
        password: 'pass'
      })

      expect(readStore()).toEqual({
        'ttt?version=latest': answers
      })
    })
  })
})
