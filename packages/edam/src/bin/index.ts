#!/usr/bin/env node
'use strict'
const meow = require('meow')
import c from 'chalk'
import edam, { Edam } from '../'
import { generateFlagData, generateFlagHelp } from './util'
const pkg = require('../../package.json')
const tildify = require('tildify')
const updateNotify = require('update-notifier')

const flags = [
  {
    name: 'help',
    alias: 'h',
    type: 'boolean',
    desc: 'help',
    default: null
  },
  {
    name: 'cache-dir',
    type: 'boolean',
    desc: 'sss',
    default: tildify(Edam.constants.DEFAULT_CACHE_DIR)
  },
  {
    name: 'no-cache',
    type: 'boolean',
    desc: 'sss',
    default: false
  },
  {
    name: 'update-notify',
    type: 'boolean',
    desc: 'sss',
    default: true
  },
  {
    name: 'extends',
    type: 'string',
    desc: 'extends',
    default: null
  },
  {
    name: 'plugins',
    type: 'string',
    desc: 'eg. "./a,./b"',
    default: null
  },
  {
    name: 'pull.npmClient',
    type: 'string',
    desc: '"npm" | "yarn"',
    default: 'npm'
  },
  {
    name: 'pull.git',
    type: 'string',
    desc: '"clone" | "download"',
    default: 'clone'
  },
  {
    name: 'userc',
    type: 'boolean',
    desc: 'userc',
    default: true
  },
  {
    name: 'yes',
    alias: 'y',
    type: 'boolean',
    desc: 'yes',
    default: false
  },
  {
    name: 'silent',
    type: 'boolean',
    desc: 'silent',
    default: false
  }
]

// Store prompts ?

const cli = meow(
  `
    ${c.white('Usage')}
      $ ${c.cyan.bold('edam')} ${c.keyword('orchid').bold('<source>')} ${c.keyword('orchid').bold('<output>')} ${c.keyword('orange')('[options]')}
 
    ${c.white('Options')}
${generateFlagHelp(flags, '      ')}
 
    ${c.white('Examples')}
      $ foo unicorns --rainbow
      🌈 unicorns 🌈
`,
  {
    flags: generateFlagData(flags),
    autoHelp: false,
    description: `${c.cyan.bold(pkg.description)} ${c.gray(pkg.version)}`
  }
);

;(async function() {
  if (cli.flags.help) {
    cli.showHelp()
    return
  }

  const flags = cli.flags
  // parse array input
  ;['extends', 'plugins'].forEach(name => {
    if (flags[name]) {
      flags[name] = flags[name].split(',')
    }
    else {
      flags[name] = []
    }
  })
  const config = Object.assign(
    {},
    {
      cacheDir: !flags.noCache && flags.cacheDir,
      updateNotify: flags.updateNotify,
      extends: flags.extends,
      plugins: flags.plugins,
      pull: {
        npmClient: flags.pull['npm-client'],
        git: flags.pull['git']
      },
      yes: flags.yes,
      silent: flags.silent,
      output: cli.input[1],
      source: cli.input[0]
    }
  )

  const fp = await edam(config, {
    cwd: process.cwd()
  }).run()
  await fp.writeToFile()

  if (config.updateNotify) {
    updateNotify({ pkg })
    const upt = updateNotify.update
    if (upt) {
      updateNotify.notify({
        message:
          'Update available ' +
          c.dim(upt.current) +
          c.reset(' → ') +
          c.green(upt.latest) +
          ' \nRun ' +
          c.cyan('npm install edam@latest -g') +
          ' to update'
      })
    }
  }
})()
