/**
 * @file mockPrompts
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */

import { Edam } from './index'
import FileProcessor from './core/TreeProcessor/FileProcessor'
import { EdamConfig } from './types/Options'

export default async function mockPrompts(
  template: string,
  promptValues = {},
  config: EdamConfig | string = {}
): Promise<FileProcessor> {
  const em: Edam = new Edam({ userc: false, yes: true, storePrompts: false })

  // Compatible with edam@<=2
  if (typeof config === 'string') {
    config = { output: config }
  }
  Object.assign(em.config, config)
  em.once('prompt:after', variables => {
    variables.assign(promptValues)
  })

  return await em.process(template)
}
