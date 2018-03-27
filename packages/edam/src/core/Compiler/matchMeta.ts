import parseQuery from '../../lib/parseQuery'

export type Meta = {
  loader?: {
    name: string
    query: object
  }
  [name: string]: any
}

function matchMeta(content: string, path?: string): Meta {
  let meta: Meta = {}
  let query = {}
  let loaderName

  function fillMeta(str: string) {
    loaderName = str
    let i = str.lastIndexOf('?')
    if (i >= 0) {
      query = parseQuery(str.slice(i + 1))
      loaderName = str.substring(0, i)
    }
    meta.loader = {
      name: loaderName,
      query
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
