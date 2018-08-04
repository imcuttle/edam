/**
 * @file normalizeConfig
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import normalize from '../core/normalizeConfig'
import * as nps from 'path'

describe('normalizeConfig', function() {
  it('should throw error when source is undefined', async () => {
    try {
      await normalize(
        {
          extends: './fixture/loadConfig/a/.errorrc',
          output: '',
          userc: false
        },
        {
          cwd: __dirname
        }
      )
    } catch (err) {
      expect(err.message).toEqual(
        expect.stringMatching('file requires `source`')
      )
    }
  })
  it('should throw error when syntax is illegal', async () => {
    try {
      await normalize(
        {
          extends: './fixture/loadConfig/a/.errorrc',
          source: './a',
          output: '',
          userc: false
        },
        {
          cwd: __dirname
        }
      )
    } catch (err) {
      expect(err.message).toEqual(
        expect.stringMatching('JSON5: invalid character')
      )
    }
  })

  it('should works on chain extends', async function() {
    const { config, track } = await normalize(
      {
        extends: ['./fixture/loadConfig/a/.edamrc'],
        alias: {
          'react-a': 'aa',
          'b.react': 'b.react.origin',
          github: 'github:tele/rele',
          file: './fixture/source'
        },
        source: 'react',
        userc: false
      },
      {
        cwd: __dirname
      }
    )

    expect(Object.keys(track)).toEqual([
      nps.resolve(__dirname, './fixture/loadConfig/a/.edamrc'),
      nps.resolve(__dirname, './fixture/loadConfig/a', './b/.edamrc'),
      nps.resolve(__dirname, './fixture/loadConfig/a', './b/rc.json')
    ])

    expect(config).toEqual(
      expect.objectContaining({
        output: nps.resolve(__dirname, './fixture/loadConfig/a'),
        extends: ['./fixture/loadConfig/a/.edamrc', './b/.edamrc', './rc'],
        source: {
          type: 'file',
          url: require.resolve('react')
        },
        plugins: [[{}, {}]],
        alias: {
          file: {
            type: 'file',
            url: nps.join(__dirname, 'fixture/source/package.json')
          },
          'react-a': {
            type: 'npm',
            url: 'aa',
            version: ''
          },
          react: {
            type: 'npm',
            url: 'b.react',
            version: ''
          },
          'b.react': {
            type: 'npm',
            url: 'b.react.origin',
            version: ''
          },
          json5: {
            type: 'file',
            url: require.resolve('json5')
          },
          github: {
            type: 'git',
            url: 'https://github.com/tele/rele.git',
            checkout: 'master'
          }
        }
      })
    )
  })

  it('should works on chain extends & userc', async function() {
    const { config } = await normalize(
      {
        extends: ['./loadConfig/a/.edamrc'],
        alias: {
          'react-a': 'aa',
          'b.react': 'b.react.origin',
          github: 'github:tele/rele'
        },
        source: 'react',
        output: '',
        userc: true
      },
      {
        cwd: nps.join(__dirname, 'fixture')
      }
    )

    expect(config).toEqual(
      expect.objectContaining({
        // extends: ['./loadConfig/a/.edamrc', './b/.edamrc', './rc'],
        source: {
          type: 'file',
          url: require.resolve('react')
        },
        alias: expect.objectContaining({
          edam: {
            type: 'npm',
            version: '',
            url: 'edam'
          },
          'edam-github': {
            type: 'git',
            url: 'abc.git',
            checkout: 'master'
          },
          'react-a': {
            type: 'npm',
            url: 'aa',
            version: ''
          },
          react: {
            type: 'npm',
            url: 'b.react',
            version: ''
          },
          'b.react': {
            type: 'npm',
            url: 'b.react.origin',
            version: ''
          },
          json5: {
            type: 'file',
            url: require.resolve('json5')
          },
          github: {
            type: 'git',
            url: 'https://github.com/tele/rele.git',
            checkout: 'master'
          }
        })
      })
    )
  })

  it('should alias works on chain extends & userc', async function() {
    const { config } = await normalize(
      {
        output: '',
        extends: ['./loadConfig/a/.edamrc'],
        alias: {
          'react-a': 'aa',
          'b.react': 'b.react.origin',
          github: 'github:tele/rele'
        },
        source: 'github?checkout=dev',
        userc: true
      },
      {
        cwd: nps.join(__dirname, 'fixture')
      }
    )

    expect(config).toEqual(
      expect.objectContaining({
        // extends: ['./loadConfig/a/.edamrc', './b/.edamrc', './rc'],
        source: {
          type: 'git',
          url: 'https://github.com/tele/rele.git',
          checkout: 'dev',
          config: {}
        },
        alias: expect.objectContaining({
          'edam-github': {
            type: 'git',
            url: 'abc.git',
            checkout: 'master'
          },
          github: {
            type: 'git',
            url: 'https://github.com/tele/rele.git',
            checkout: 'master'
          }
        })
      })
    )
  })

  it('should alias works querystring when not matching', async function() {
    const { config } = await normalize(
      {
        extends: ['./loadConfig/a/.edamrc'],
        alias: {
          'react-a': 'aa',
          'b.react': 'b.react.origin',
          github: 'github:tele/rele'
        },
        output: '',
        source: 'github:tele/abcrele?checkout=dev',
        userc: true
      },
      {
        cwd: nps.join(__dirname, 'fixture')
      }
    )

    expect(config).toEqual(
      expect.objectContaining({
        // extends: ['./loadConfig/a/.edamrc', './b/.edamrc', './rc'],
        source: {
          type: 'git',
          url: 'https://github.com/tele/abcrele.git',
          checkout: 'dev'
        }
      })
    )
  })
})
