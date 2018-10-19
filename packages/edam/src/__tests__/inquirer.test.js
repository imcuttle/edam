/**
 * @file inquirer
 * @author Cuttle Cong
 * @date 2018/10/19
 * @description
 */
const realInquirer = require.requireActual('inquirer')
const inquirer = require('../core/inquirer')

describe('inquirer', function() {
  it("should the rest properties of realInquirer equals inquirer's", () => {
    for (let key in realInquirer) {
      if ('prompt' === key) {
        expect(realInquirer[key]).not.toBe(inquirer[key])
        continue
      }
      expect(realInquirer[key]).toBe(inquirer[key])
    }
    expect(Object.keys(realInquirer)).toEqual(Object.keys(inquirer))
  })
})
