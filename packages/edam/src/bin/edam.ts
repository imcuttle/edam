#!/usr/bin/env node
/* eslint-disable indent */
'use strict'
import EdamError from '../core/EdamError'

const meow = require('meow')
import c from 'chalk'
import edam, { Edam } from '../'
import { generateFlagData, generateFlagHelp } from './util'
const pkg = require('../../package.json')
const tildify = require('tildify')
const ora = require('ora')
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
    name: 'no-store',
    type: 'boolean',
    desc: 'storePrompts',
    default: false
  },
  {
    name: 'overwrite',
    alias: 'o',
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
      $ ${c.cyan.bold('edam')} ${c
    .keyword('orchid')
    .bold('<source>')} ${c.keyword('orchid').bold('<output>')} ${c.keyword(
    'orange'
  )('[options]')}
 
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
)
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
    } else {
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
      source: cli.input[0],
      // overwrite: flags.overwrite,
      storePrompts: !flags.noStore
    }
  )

  // default
  if (config.cacheDir === tildify(Edam.constants.DEFAULT_CACHE_DIR)) {
    config.cacheDir = Edam.constants.DEFAULT_CACHE_DIR
  }

  const em = edam(config, {
    cwd: process.cwd()
  })
  const spinner = ora('Running...')
  em
    .on('pull:before', source => {
      // spinner.start()
      if (source && ['npm', 'git'].includes(source.type)) {
        spinner.start(`Pulling template from ${source.type}: ${source.url}`)
      }
    })
    .on('pull:after', templateConfigPath => {
      spinner.succeed(
        `Done Pull. template path: "${tildify(templateConfigPath)}"`
      )
    })

  em.compiler
    .on('pre', (/*output*/) => {
      spinner.start('Writing to file...')
    })
    .on('post', output => {
      spinner.succeed(
        `Done! the output: "${tildify(output)}" is waiting for you`
      )
    })

  try {
    const fp = await em.run()
    await fp.writeToFile(void 0, { overwrite: <boolean>flags.overwrite })
  } catch (err) {
    if (err instanceof EdamError) {
      spinner.fail(err.message)
    } else {
      console.error(err)
    }
  }

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
