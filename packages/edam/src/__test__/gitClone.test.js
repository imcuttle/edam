/**
 * @file gitClone
 * @author Cuttle Cong
 * @date 2018/3/26
 * @description
 */
import gitClone from '../lib/gitClone'
import * as nps from 'path'
import fileSystem from '../lib/fileSystem'

const path = nps.join(__dirname, 'fixture', 'gitClone')

describe('gitClone', function() {

  afterAll(async function () {
    await fileSystem.cleanDir(path)
  })
  it('should gitClone', (done) => {
    expect(fileSystem.existsSync(nps.join(path, 'node-await-event-emitter'))).toBeFalsy()
    gitClone(
      'https://github.com/imcuttle/node-await-event-emitter',
      nps.join(path, 'node-await-event-emitter'),
      {}
    ).then(function () {
      expect(fileSystem.existsSync(nps.join(path, 'node-await-event-emitter'))).toBeTruthy()
      done()
    })
  })
})
