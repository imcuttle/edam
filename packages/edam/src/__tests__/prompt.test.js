/* eslint-disable quotes */
/**
 * @file promptProcessor
 * @author Cuttle Cong
 * @date 2018/3/26
 * @description
 */
import prompt from '../core/promptProcessor'
import bdd from 'bdd-stdin'

const k = Object.freeze({
  up: '\u001b[A',
  down: '\u001b[B',
  left: '\u001b[D',
  right: '\u001b[C',
  enter: '\n',
  space: ' '
})

describe('prompt', function() {
  it('should prompt works on simple case', async () => {
    bdd('cuttle', k.enter)
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
})
