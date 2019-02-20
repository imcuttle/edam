/**
 * @file main
 * @author Cuttle Cong
 * @date 2018/4/3
 * @description
 */
import * as nps from 'path'
import normalizeConfig from '../../core/normalizeConfig'
import { edam as edamType } from '../../types/Options'

it('inferrable-configuration test', async () => {
  expect(
    (await normalizeConfig(
      {
        userc: true
      },
      { cwd: nps.join(__dirname, './par/cwd') }
    )).config
  ).toEqual(
    expect.objectContaining({
      plugins: [[require('./foo/edamrc'), {}]],
      output: nps.join(__dirname, './par/output'),
      storePrompts: false,
      alias: {
        par: {
          type: 'npm',
          url: 'par',
          version: ''
        },
        foo: {
          type: 'npm',
          url: 'foo',
          version: ''
        },
        bar: {
          type: 'npm',
          url: 'bar',
          version: ''
        },
        'standalone.config': {
          config: {
            pull: {
              npmClientArgs: ['--version']
            },
            output: nps.join(__dirname, './par/abc/output'),
            storePrompts: true
          },
          type: 'file',
          url: nps.join(__dirname, './par/cwd')
        }
      }
    })
  )
})

it('inferrable-configuration source.config', async () => {
  expect(
    (await normalizeConfig(
      {
        userc: true,
        source: 'standalone.config'
      },
      { cwd: nps.join(__dirname, './par/cwd') }
    )).config
  ).toEqual(
    expect.objectContaining({
      plugins: [[require('./foo/edamrc'), {}]],
      output: nps.join(__dirname, './par/abc/output'),
      storePrompts: true,
      pull: {
        git: "clone",
        npmClient: "npm",
        npmClientArgs: ['--version']
      },
      alias: {
        par: {
          type: 'npm',
          url: 'par',
          version: ''
        },
        foo: {
          type: 'npm',
          url: 'foo',
          version: ''
        },
        bar: {
          type: 'npm',
          url: 'bar',
          version: ''
        },
        'standalone.config': {
          config: {
            pull: {
              npmClientArgs: ['--version']
            },
            output: nps.join(__dirname, './par/abc/output'),
            storePrompts: true
          },
          type: 'file',
          url: nps.join(__dirname, './par/cwd')
        }
      }
    })
  )
})

it('inferrable-configuration walli check', done => {
  normalizeConfig({
    userc: false,
    source: 'abc',
    alias: {
      abc: {
        type: 'file',
        url: nps.join(__dirname, './par/cwd'),
        config: {
          alias: {}
        }
      }
    },
    pull: {
      git: 'clone'
    },
    output: '/'
  }).then(({ config }) => {
    expect(edamType.check(config).toString()).not.toBeNull()
    done()
  })
})
