/**
 * @file extendsConfig
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import extendsConfig from '../core/extendsConfig'
import * as nps from 'path'

describe('extendsConfig', function() {
  it('should extendsConfig throw error when syntax is illegal', async () => {
    try {
      await extendsConfig(
        {
          extends: './fixture/loadConfig/a/.errorrc'
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
    const plugins = [
      function () {

      },
      'abc'
    ]

    const { config, track } = await extendsConfig(
      {
        extends: ['./fixture/loadConfig/a/.edamrc'],
        alias: {
          'react-a': 'aa',
          'b.react': 'b.react.origin'
        },
        plugins: [
          plugins
        ]
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

    expect(config).toEqual({
      extends: ['./fixture/loadConfig/a/.edamrc', './b/.edamrc', './rc'],
      source: 'a.edamrc',
      plugins: [
        plugins
      ],
      output: nps.resolve(__dirname, 'fixture/loadConfig/a'),
      alias: {
        'react-a': 'aa',
        react: 'b.react',
        'b.react': 'b.react.origin',
        rc: 'rc'
      }
    })
  })

  it('should works on circle extends', async function() {
    const { config, track } = await extendsConfig(
      {
        extends: ['./fixture/loadConfig/a/.circlerc'],
        plugins: [
          [{}, { a: 'psource' }]
        ],
        alias: {
          'react-a': 'aa',
          'b.react': 'b.react.origin'
        }
      },
      {
        cwd: __dirname
      }
    )
    expect(config).toEqual({
      extends: [
        './fixture/loadConfig/a/.circlerc',
        './circle/.edamrc',
        './rc',
        '.edamrc'
      ],
      plugins: [
        [{}, { a: 'psource' }]
      ],
      source: 'a.edamrc',
      alias: {
        'react-a': 'aa',
        react: 'b.react',
        'b.react': 'b.react.origin',
        rc: 'rc'
      }
    })
    expect(Object.keys(track)).toEqual([
      nps.resolve(__dirname, './fixture/loadConfig/a/.circlerc'),
      nps.resolve(__dirname, './fixture/loadConfig/a', './circle/.edamrc'),
      nps.resolve(__dirname, './fixture/loadConfig/a', './circle/rc.json')
    ])
  })
})
