/**
 * @file ejs
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */

import { template } from 'lodash'


function ejsLoader (content: string, variables: object): string {
  return template(content, {})(variables)
}

module.exports = ejsLoader
