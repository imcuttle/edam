/* eslint-disable quotes */
/**
 * @file spec
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */
import { mockPrompts } from '../../index'
import { join } from 'path'

describe('functional', function() {
  const tplPath = join(__dirname, '../fixture/edam')
  const outputRoot = join(__dirname, '../fixture/edam-output')

  it('should functional', async () => {
    const ft = await mockPrompts(
      join(tplPath, 'functional'),
      {
        value: 'ojbk'
      },
      join(outputRoot, 'functional')
    )

    expect(Object.keys(ft.tree).length).toBe(3)
    expect(ft.tree).toMatchSnapshot()
  })

  it('should functional output', async function () {
    const ft = await mockPrompts(
      join(tplPath, 'functional'),
      {
        value: 'ojbk'
      },
      join(outputRoot, 'functional')
    )
    expect(await ft.writeToFile()).toBeTruthy()
  })
})
