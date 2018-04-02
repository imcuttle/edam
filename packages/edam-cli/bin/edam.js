#!/usr/bin/env node
/* eslint-disable indent */
const c = require('chalk')
const constant = require('edam/dist/core/constant').default

const generateFlagData = require('./util').generateFlagData
const generateFlagHelp = require('./util').generateFlagHelp

const meow = require('meow')
const pkg = require('edam/package.json')
const tildify = require('tildify')
const updateNotify = require('update-notifier')

const flags = [
  {
    name: 'help',
    alias: 'h',
    type: 'boolean',
    desc: 'Shows the help document.',
    default: null
  },
  {
    name: 'cache-dir',
    type: 'string',
    desc: 'Appoints to the cache where to store. It should be a directory path.',
    default: tildify(constant.DEFAULT_CACHE_DIR)
  },
  {
    name: 'no-cache',
    type: 'boolean',
    desc: 'Disables the cache feature which is not be recommended',
    default: false
  },
  {
    name: 'update-notify',
    type: 'boolean',
    desc: 'Notifies the latest upgrade information like npm.',
    default: true
  },
  {
    name: 'extends',
    type: 'string',
    desc:
      'Extends external edam configuration files.  ' +
      'eg. --extends="./.edamrc,../.edamrc"',
    default: null
  },
  {
    name: 'plugins',
    type: 'string',
    desc: 'The plugins you requires. eg. --plugins="edam-plugin-dulcet-prompt"',
    default: null
  },
  {
    name: 'pull.npmClient',
    type: 'string',
    desc: 'Appoints to the command when installing package form npmjs.com. [npm|yarn]',
    default: 'npm'
  },
  {
    name: 'pull.git',
    type: 'string',
    desc: 'Uses which way to pull git repo. [clone|download]',
    default: 'clone'
  },
  {
    name: 'userc',
    type: 'boolean',
    desc: 'Edam can deduce the configuration file from current work directory like `.babelrc`.',
    default: true
  },
  {
    name: 'yes',
    alias: 'y',
    type: 'boolean',
    desc: 'Uses stored prompt\'s values instead of typing arduously.',
    default: false
  },
  {
    name: 'no-store',
    type: 'boolean',
    desc: 'Disables storing latest prompt\'s values.',
    default: false
  },
  {
    name: 'output',
    alias: 'o',
    type: 'string',
    desc: 'The output directory.',
    default: tildify(process.cwd())
  },
  {
    name: 'overwrite',
    alias: 'w',
    desc: 'Whether overwrite the previous output.',
    default: false
  },
  {
    name: 'silent',
    alias: 's',
    type: 'boolean',
    desc: 'Just shut up.',
    default: false
  }
]

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
`,
  {
    flags: generateFlagData(flags),
    autoHelp: false,
    description: ` ${c.cyan.bold(
      pkg.description
    )} ${c.gray(pkg.version)}`
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
    if (!Array.isArray(flags[name])) {
      if (flags[name]) {
        flags[name] = flags[name].split(',')
      } else {
        flags[name] = []
      }
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
      output: flags.output,
      source: cli.input[0],
      // overwrite: flags.overwrite,
      storePrompts: !flags.noStore
    }
  )

  // console.log(flags.silent)

  const edam = require('../../edam/dist/index').default
  const Edam = require('../../edam/dist/index').Edam
  // default
  if (config.cacheDir === tildify(Edam.constants.DEFAULT_CACHE_DIR)) {
    config.cacheDir = Edam.constants.DEFAULT_CACHE_DIR
  }
  if (config.output === tildify(process.cwd())) {
    config.output = process.cwd()
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
      spinner.warn(format.apply(null, arguments))
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
    .on('pull:before', source => {
      if (source && ['npm', 'git'].includes(source.type)) {
        // console.log(process._getActiveHandles())
        // console.log(process._getActiveRequests().length)

        !em.config.silent && spinner.start(`Pulling template from ${source.type}: ${source.url}`)
      }
    })
    .on('pull:after', templateConfigPath => {
      em.logger.success(
        `Pull done! template path: "${tildify(templateConfigPath)}"`
      )
    })
    .on('install:packages:before', () => {
      spinner.start('Installing packages after generating...')
    })
    .on('install:packages:after', () => {
      spinner.succeed('Install packages after generating succeed.')
    })

  em.compiler
    .once('pre', (/*output*/) => {
      // spinner.start('Writing to file...')
    })
    .once('post', output => {
      em.logger.success(
        `Generate done! the output: "${tildify(output)}" is waiting for you`
      )
    })

  //
  let code = 0
  em
    .run()
    .then(function(fp) {
      return fp.writeToFile(void 0, { overwrite: flags.overwrite })
    })
    .catch(function(err) {
      if (err && err.id === 'EDAM_ERROR') {
        spinner.fail(err.message)
      } else {
        spinner.fail(err)
      }
      code = 1
    })
    .then(function() {
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
