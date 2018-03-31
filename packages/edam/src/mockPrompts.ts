/**
 * @file mockPrompts
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */

import { Edam } from './index'
import FileProcessor from './core/TreeProcessor/FileProcessor'
import TemplateConfig from './types/TemplateConfig'

export default async function mockPrompts(
  template: string | TemplateConfig,
  promptValues = {},
  output?: string
): Promise<FileProcessor> {
  const em: Edam = new Edam({ userc: false, yes: true, storePrompts: false })
  em.config.output = output
  em.once('prompt:after', variables => {
    variables.assign(promptValues)
  })

  if (typeof template === 'string') {
    return await em.process(template)
  }
  em.templateConfig = template
  return await em.process()
}
