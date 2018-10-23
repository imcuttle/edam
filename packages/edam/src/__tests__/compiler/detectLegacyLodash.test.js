/**
 * @file detectLegacyLodash
 * @author Cuttle Cong
 * @date 2018/10/23
 * @description
 */
import detectLegacyLodash from '../../core/Compiler/loaders/detectLegacyLodash'

describe('detectLegacyLodash', function() {
  it('should matchs <% any %>', () => {
    expect(detectLegacyLodash('<%hhh%>')).toEqual([
      { line: 1, column: 1, offset: 0 }
    ])
  })

  it('should matchs <%= name %>', () => {
    expect(detectLegacyLodash('hello! <%= name %> <%= un %>', { name: '' })).toEqual([
      { line: 1, column: 8, offset: 7 }
    ])
  })

  it('should matchs multiply <%= name %>', () => {
    expect(detectLegacyLodash('hello! <%= name %>\n <%= un %>', { name: '', un: '' })).toEqual([
      { line: 1, column: 8, offset: 7 }, { line: 2, column: 2, offset: 20 }
    ])
  })

  it('should matchs multiply <%- name %>', () => {
    expect(detectLegacyLodash('hello! <%- name %>\n <%= un %>', { name: '', un: '' })).toEqual([
      { line: 1, column: 8, offset: 7 }, { line: 2, column: 2, offset: 20 }
    ])
  })
})
