/**
 * @file inquirer
 * @author Cuttle Cong
 * @date 2018/10/19
 *
 */
const inquirer = require('inquirer')

module.exports = {
  ...inquirer,
  prompt: inquirer.createPromptModule()
}
