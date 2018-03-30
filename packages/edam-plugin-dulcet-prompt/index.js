/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/3/29
 * @description
 */

const inquirer = require('./dulcet-inquirer')

/* eslint-disable */
module.exports = function dulcetPrompt({ port, silent } = {}) {
  const edam = this

  edam.prompt = function(prompts, { context, yes } = {}) {
    return inquirer(prompts, { yes })
  }

}
