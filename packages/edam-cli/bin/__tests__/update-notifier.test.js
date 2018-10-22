/**
 * @file update-notifier
 * @author Cuttle Cong
 * @date 2018/10/22
 * @description
 */
const upt = require('update-notifier')

describe('update-notifier', function() {
  afterEach(() => {
  })

  it('should update-notifier', () => {
    const notifier = upt({
      pkg: { name: 'edam', version: '1.0.0' },
      updateCheckInterval: 0
    })

    const old = process.stdout.isTTY
    process.stdout.isTTY = true
    notifier.notify({ defer: false })
    process.stdout.isTTY = old

    expect(notifier.update).not.toBeNull()
  })
})
