/**
 * @file main
 * @author Cuttle Cong
 * @date 2018/4/3
 * @description
 */
import * as nps from 'path'
import normalizeConfig from '../../core/normalizeConfig'

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
      plugins: [[require('edam'), {}]],
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
        }
      }
    })
  )
})
