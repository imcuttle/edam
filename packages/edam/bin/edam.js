#!/usr/bin/env node
/* eslint-disable indent */
const c = require('chalk')
const constant = require('../dist/core/constant').default

const generateFlagData = require('./util').generateFlagData
const generateFlagHelp = require('./util').generateFlagHelp

const meow = require('meow')
const pkg = require('../package.json')
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
    default: tildify(constant.DEFAULT_CACHE_DIR)
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
    name: 'output',
    alias: 'o',
    type: 'string',
    desc: 'output'
  },
  {
    name: 'overwrite',
    alias: 'w',
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

;(function() {
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
      output: flags.output || process.cwd(),
      source: cli.input[0],
      // overwrite: flags.overwrite,
      storePrompts: !flags.noStore
    }
  )

  const edam = require('../dist').default
  const Edam = require('../dist').Edam
  // default
  if (config.cacheDir === tildify(Edam.constants.DEFAULT_CACHE_DIR)) {
    config.cacheDir = Edam.constants.DEFAULT_CACHE_DIR
  }

  let spinner = require('ora')()
  const em = edam(config, {
    cwd: process.cwd()
  })

  const format = require('util').format
  Object.assign(em.logger, {
    _log() {
      spinner.color = 'cyan'
      spinner.text = format.apply(null, arguments)
    },
    _warn() {
      spinner.color = 'yellow'
      spinner.text = format.apply(null, arguments)
    },
    _success() {
      spinner.succeed(format.apply(null, arguments))
    },
    _error() {
      // the error outside are caught outside.
      spinner.fail(format.apply(null, arguments))
    }
  })
  em
    .once('pull:before', async source => {
      if (source && ['npm', 'git'].includes(source.type)) {
        // console.log(process._getActiveHandles())
        // console.log(process._getActiveRequests().length)

        spinner.start(`Pulling template from ${source.type}: ${source.url}`)
      }
    })
    .once('pull:after', async templateConfigPath => {
      spinner.succeed(
        `Done Pull. template path: "${tildify(templateConfigPath)}"`
      )
    })

  em.compiler
    .once('pre', (/*output*/) => {
      // spinner.start('Writing to file...')
    })
    .once('post', output => {
      spinner.succeed(
        `Done! the output: "${tildify(output)}" is waiting for you`
      )
    })

  //
  let code = 0
  em.run()
    .then(function (fp) {
      return fp.writeToFile(void 0, { overwrite: flags.overwrite })
    })
    .catch(function (err) {
      if (err && err.id === 'EDAM_ERROR') {
        spinner.fail(err.message)
      } else {
        spinner.fail(err)
      }
      code = 1
    })
    .then(function () {
      if (config.updateNotify) {
        const notifier = updateNotify({ pkg })
        const upt = updateNotify.update
        if (upt) {
          notifier.notify({
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

      process.exit(code)
    })

})()
