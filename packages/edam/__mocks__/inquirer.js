/**
 * @file inquirer
 * @author Cuttle Cong
 * @date 2018/10/19
 *
 */
const inquirer = require.requireActual('inquirer')
const BaseUI = require('inquirer/lib/ui/baseUI')
const promptModule = inquirer.createPromptModule()
const Readline = require('./readline')

const rl = (BaseUI.prototype.rl = inquirer.ui.Prompt.prototype.rl = new Readline())

promptModule.prompt = function prompt(prompts) {
  var ui = new inquirer.ui.Prompt(promptModule.prompts, {})

  var promise = ui.run(prompts)

  // Monkey patch the UI on the promise object so
  // that it remains publicly accessible.
  promise.ui = ui

  return promise
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function type(chars) {
  chars.split('').forEach(function(char) {
    rl.line = rl.line + char
    rl.input.emit('keypress', char)
  })
}

function up() {
  rl.input.emit('keypress', '', { name: 'up' })
}

function down() {
  rl.input.emit('keypress', '', { name: 'down' })
}

async function enter(reset = true) {
  rl.emit('line', rl.line)
  // Yield for next process
  return delay().then(() => {
    reset && (rl.line = '')
  })
}

async function run(tasks, { delayMs = 100 } = {}) {
  for (let i = 0; i < tasks.length; i++) {
    await delay(delayMs)
    await tasks[i]()
  }
}

module.exports = Object.assign(promptModule, inquirer, {
  rl,
  op: {
    enter,
    down,
    up,
    type,
    run
  }
})
