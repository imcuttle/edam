/**
 * @file mockPrompts
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */

import { Edam } from './index'
import FileProcessor from './core/TreeProcessor/FileProcessor'

export default async function mockPrompts(
  templatePath: string,
  promptValues = {},
  output?: string
): Promise<FileProcessor> {
  const em: Edam = new Edam({ userc: false, yes: true })
  em.config.output = output
  em.once('prompt:after', variables => {
    variables.assign(promptValues)
  })
  return await em.process(templatePath)
}
