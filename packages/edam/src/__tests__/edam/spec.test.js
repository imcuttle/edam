/* eslint-disable quotes */
/**
 * @file spec
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */
import { mockPrompts } from '../../index'
import { join } from 'path'

describe('spec', function() {
  const tplPath = join(__dirname, '../fixture/edam')
  const outputRoot = join(__dirname, '../fixture/edam-output')

  it('should spec', async () => {
    const ft = await mockPrompts(
      join(tplPath, 'spec'),
      {
        value: 'ojbk'
      },
      join(outputRoot, 'spec')
    )

    expect(Object.keys(ft.tree).length).toBe(3)
  })
})
