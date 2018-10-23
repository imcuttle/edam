#!/usr/bin/env node
/* eslint-disable indent */
const c = require('chalk')
const constant = require('edam/dist/core/constant').default
const meow = require('meow')
const pkg = require('../package.json')
const tildify = require('tildify')
const updateNotify = require('update-notifier')
const dbg = require('debug')

const { generateFlagData, generateFlagHelp } = require('./util')

const debug = dbg('edam-cli')

const flags = [
  {
    name: 'version',
    alias: 'v',
    type: 'boolean',
    desc: 'Shows the version of Edam.',
    default: false
  },
  {
    name: 'help',
    alias: 'h',
    type: 'boolean',
    desc: 'Shows the help document.',
    default: false
  },
  {
    name: 'debug',
    alias: 'd',
    type: 'boolean',
    desc: 'Open debug mode (print debug log).',
    default: false
  },
  {
    name: 'cache-dir',
    type: 'string',
    desc:
      'Appoints to the cache where to store. It should be a directory path.',
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
    name: 'includes',
    type: 'string',
    desc: 'Which files are included (including all files by default)\ne.g. --includes=*.md,**/*.js',
    default: () => true
  },
  {
    name: 'excludes',
    type: 'string',
    desc: 'Which files are excluded. e.g. --excludes=*.js',
    default: () => false
  },
  {
    name: 'extends',
    type: 'string',
    desc:
      'Extends external edam configuration files. \n' +
      'e.g. --extends="./.edamrc,../.edamrc"',
    default: null
  },
  {
    name: 'plugins',
    type: 'string',
    desc: 'The plugins you requires. eg. --plugins="edam-plugin-dulcet-prompt"',
    default: null
  },
  {
    name: 'pull.npm-client',
    type: 'string',
    desc:
      'Appoints to the command when installing package form npmjs.com. [npm|yarn]',
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
    desc:
      'Edam can deduce the configuration file from current work directory like `.babelrc`.',
    default: true
  },
  {
    name: 'yes',
    alias: 'y',
    type: 'boolean',
    // eslint-disable-next-line quotes
    desc: "Uses stored prompt's values instead of typing arduously.",
    default: false
  },
  {
    name: 'store-prompts',
    type: 'boolean',
    // eslint-disable-next-line quotes
    desc: "Enable storing latest prompt's values.",
    default: true
  },
  {
    name: 'offline-fallback',
    type: 'boolean',
    // eslint-disable-next-line quotes
    desc: "Fallback to local cache assets when you are offline.",
    default: true
  },
  {
    name: 'output',
    alias: 'o',
    type: 'string',
    desc: 'The output directory.'
    // default: tildify(process.cwd())
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
    .bold('<source>')} ${c.keyword('orange')('[options]')}
 
    ${c.white('Options')}
    
${generateFlagHelp(flags, '      ')}
`,
  {
    flags: generateFlagData(flags),
    autoHelp: false,
    description: ` ${c.cyan.bold(pkg.description)}`
  }
)
;(function() {
  const flags = cli.flags
  // parse array input
  ;['extends', 'plugins', 'includes', 'excludes'].forEach(name => {
    if (!Array.isArray(flags[name]) && typeof flags[name] === 'string') {
      if (flags[name]) {
        flags[name] = flags[name].split(',')
      } else {
        flags[name] = null
      }
    }
  })

  if (cli.flags.debug) {
    dbg.enable('edam-cli')
  }

  debug('cli input: %o', cli.input)
  debug('cli flags: %O', cli.flags)

  if (cli.flags.help) {
    cli.showHelp()
    return
  }

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
      storePrompts: flags.storePrompts,
      debug: flags.debug,
      offlineFallback: flags.offlineFallback,
      includes: flags.includes,
      excludes: flags.excludes
    }
  )

  if (config.updateNotify) {
    const notifier = updateNotify({
      pkg
    })
    const upt = notifier.update

    if (upt) {
      notifier.notify({
        message:
          'Update available ' +
          c.dim(upt.current) +
          c.reset(' → ') +
          c.greenBright(upt.latest) +
          ' \nRun ' +
          c.cyanBright(`npm install ${pkg.name}@latest -g`) +
          ' to update'
      })
    }
  }

  const edam = require('edam').default
  const Edam = require('edam').Edam
  // default
  if (config.cacheDir === tildify(Edam.constants.DEFAULT_CACHE_DIR)) {
    config.cacheDir = Edam.constants.DEFAULT_CACHE_DIR
  }
  if (config.output === '') {
    delete config.output
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
  em.on('pull:before', source => {
    if (source && ['npm', 'git'].includes(source.type)) {
      !em.config.silent &&
        spinner.start(`Pulling template from ${source.type}: ${source.url}`)
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
  em.normalizeConfig()
    .then(() => {
      if (!em.config.output) {
        em.config.output = process.cwd()
      }

      if (
        !em.config.source ||
        (em.config.source && em.config.source.url === '-')
      ) {
        if (em.config.alias && Object.keys(em.config.alias).length) {
          let choices = Object.keys(em.config.alias).map(name => {
            let config = em.config.alias[name]
            return {
              name:
                name +
                c.gray(config.description ? ' - ' + config.description : ''),
              value: name
            }
          })

          return em.inquirer
            .prompt([
              {
                type: 'list',
                choices,
                name: 'source',
                message: 'Please select your preferable template.'
              }
            ])
            .then(({ source }) => {
              em.config.source = source
              // Normalize config again
              return em.normalizeConfig()
            })
        }
      }
    })
    .then(() => em.registerPlugins())
    .then(() => em.checkConfig())
    .then(() => em.pull())
    .then(() => em.process())
    .then(function(fp) {
      return fp.writeToFile(void 0, { overwrite: flags.overwrite })
    })
    .catch(function(err) {
      if (err && err.id === 'EDAM_ERROR') {
        spinner.fail(err.message)
      } else {
        spinner.fail(err.stack)
      }
      code = 1
    })
    .then(function() {
      process.exit(code)
    })
})()
