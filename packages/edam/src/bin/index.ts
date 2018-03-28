#!/usr/bin/env node
const prog = require('caporal')
prog
  .version('1.0.0')
  // you specify arguments using .argument()
  // 'app' is required, 'env' is optional
  .command('deploy', 'Deploy an application')
  .argument('<app>', 'App to deploy', /^myapp|their-app$/)
  .argument(
    '[env]',
    'Environment to deploy on',
    /^dev|staging|production$/,
    'local'
  )
  // you specify options using .option()
  // if --tail is passed, its value is required
  .option('--tail <lines>', 'Tail <lines> lines of logs after deploy', prog.INT)
  .action(function(args, options, logger) {
    // args and options are objects
    // args = {"app": "myapp", "env": "production"}
    // options = {"tail" : 100}
  })

prog.parse(process.argv)
