/**
 * @file examples
 * @author Cuttle Cong
 * @date 2018/3/30
 * @description
 */
const inquirer = require('./')

inquirer(require('./prompts'))
  .then(console.log)
  .catch(console.error)
