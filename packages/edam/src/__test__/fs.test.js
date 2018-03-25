/**
 * @file fs
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import fs from '../lib/fileSystem'
import * as nps from 'path'

describe('fs', function() {
  it('fs.readdirDeep', async () => {
    expect(
      await fs.readdirDeep(
        nps.join(__dirname, 'fixture'),
        {
          filter: ['!(a).fs', `!${nps.join(__dirname, 'fixture', 'fs', 'b.fs')}`]
        }
      )
    ).toEqual([
      // nps.join(__dirname, 'fixture', 'fs', 'a.fs'),
      // nps.join(__dirname, 'fixture', 'fs', 'b.fs')
    ])
  })
})
