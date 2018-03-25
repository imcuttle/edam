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
          extends: './fixture/loadConfig/a/.errorrc'
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
          source: './a'
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
          'github': 'github:tele/rele',
          'file': 'fixture/source'
        },
        source: 'react'
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
        extends: ['./fixture/loadConfig/a/.edamrc', './b/.edamrc', './rc'],
        source: {
          type: 'npm',
          url: 'b.react'
        },
        plugins: [
          [{}, {}]
        ],
        alias: {
          'file': {
            type: 'file',
            url: nps.join(__dirname, 'fixture/source/package.json')
          },
          'react-a': {
            type: 'npm',
            url: 'aa'
          },
          react: {
            type: 'npm',
            url: 'b.react'
          },
          'b.react': {
            type: 'npm',
            url: 'b.react.origin'
          },
          rc: {
            type: 'npm',
            url: 'rc'
          },
          'github': {
            type: 'git',
            url: 'https://github.com/tele/rele.git',
            branch: 'master'
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
          'github': 'github:tele/rele'
        },
        source: 'react',
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
          type: 'npm',
          url: 'b.react'
        },
        alias: {
          edam: {
            type: 'npm',
            url: 'edam'
          },
          'edam-github': {
            type: 'git',
            url: 'abc.git',
            branch: 'master'
          },
          'react-a': {
            type: 'npm',
            url: 'aa'
          },
          react: {
            type: 'npm',
            url: 'b.react'
          },
          'b.react': {
            type: 'npm',
            url: 'b.react.origin'
          },
          rc: {
            type: 'npm',
            url: 'rc'
          },
          'github': {
            type: 'git',
            url: 'https://github.com/tele/rele.git',
            branch: 'master'
          }
        }
      })
    )
  })
})
