/**
 * @file ejs
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */

import * as nps from 'path'

async function moduleLoader(content: string, variables): Promise<string> {
  const root = this.compiler.root
  const path = this.path
  const options = this.options
  const filename = nps.join(root, path)

  let data = await require(filename)(variables)

  if (Buffer.isBuffer(data)) {
    data = data.toString()
  }

  if (typeof data === 'string') {
    return data
  }

  return JSON.stringify(data, null, parseInt(options.indent || 2))
}

module.exports = moduleLoader
