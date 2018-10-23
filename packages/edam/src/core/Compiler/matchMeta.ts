import parseQueryString from '../../lib/parseQueryString'

export type Meta = {
  loader?: {
    name: string
    query: object
  }
  [name: string]: any
}

function matchMeta(content: string): Meta {
  let meta: Meta = {}

  function fillMeta(str: string) {
    meta.loader = {
      ...parseQueryString(str)
    }
  }
  let regList = [
    new RegExp(
      // # //
      '^[\\t ]*(?:#|//)' +
        '[\\t ]*' +
        // @loader
        '\\@loader[\\t ]+' +
        // name name
        '(.+)[\\t ]*\\n?'
    ),
    new RegExp(
      // <!--  -->
      '^[\\t ]*<!--' +
        '[\\t ]*' +
        // @loader
        '\\@loader[\\t ]+' +
        // name name
        '(.+)[\\t ]*-->[\\t ]*\\n?'
    ),
    new RegExp(
      // /*  */
      '^[\\t ]*/\\*' +
        '[\\t ]*' +
        // @loader
        '\\@loader[\\t ]+' +
        // name name
        '(.+)[\\t ]*\\*/[\\t ]*\\n?'
    )
  ]

  regList.some(reg => {
    let matched = false
    content = content.replace(reg, (_, $1) => {
      let str = $1.trim()
      fillMeta(str)
      matched = true
      return ''
    })
    return matched
  })

  return {
    content,
    meta
  }
}

export default matchMeta
