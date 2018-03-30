/**
 * @file fs
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import fs from '../lib/fileSystem'
import * as nps from 'path'
import * as mkdirp from 'mkdirp'

describe('fs', function() {
  it('fs.readdirDeep', async () => {
    expect(
      await fs.readdirDeep(
        nps.join(__dirname, 'fixture'),
        {
          filter: ['*.fs', `!${nps.join(__dirname, 'fixture', 'fs', 'b.fs')}`]
        }
      )
    ).toEqual([
      nps.join(__dirname, 'fixture', 'fs', 'a.fs')
      // nps.join(__dirname, 'fixture', 'fs', 'b.fs')
    ])
  })

  it('fs.cleanDir', async () => {
    const dir = nps.join(__dirname, 'fixture', 'fs', 'cleanDir')
    mkdirp.sync(dir)
    expect(fs.isDirectory(dir)).toBeTruthy()
    await fs.cleanDir(dir)
    expect(fs.existsSync(dir)).toBeFalsy()
  })
})
