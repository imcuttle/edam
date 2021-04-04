#!/usr/bin/env node
/* eslint-disable indent */
const c = require('chalk')
const constant = require('edam/dist/core/constant').default
const meow = require('meow')
const pkg = require('../package.json')
const tildify = require('tildify')
const get = require('lodash.get')
const set = require('lodash.set')
const updateNotify = require('update-notifier')
const dbg = require('debug')
const omitNully = require('omit-nully')
const runEdam = require('../')

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
    desc: `Appoints to the cache where to store. It should be a directory path.\n ${tildify(
      constant.DEFAULT_CACHE_DIR
    )} by default`
    // default: tildify(constant.DEFAULT_CACHE_DIR)
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
    desc:
      'Which files are included (including all files by default)\ne.g. --includes=*.md,**/*.js'
    // default: () => true
  },
  {
    name: 'excludes',
    type: 'string',
    desc: 'Which files are excluded. e.g. --excludes=*.js'
    // default: () => false
  },
  {
    name: 'extends',
    type: 'string',
    desc:
      'Extends external edam configuration files. \n' +
      'e.g. --extends="./.edamrc,../.edamrc"'
    // default: null
  },
  {
    name: 'plugins',
    type: 'string',
    desc: 'The plugins you requires. eg. --plugins="edam-plugin-dulcet-prompt"'
    // default: null
  },
  {
    name: 'pull.npm-client',
    type: 'string',
    desc: 'Appoints to the command when installing package. [npm|yarn]'
    // default: 'npm'
  },
  {
    name: 'pull.npm-client-args',
    type: 'string',
    desc:
      'Appoints to the command\'s arguments when installing package. eg. --pull.npm-client-args="--registry=http://example.com"'
    // default: ''
  },
  {
    name: 'pull.git',
    type: 'string',
    desc: 'Uses which way to pull git repo. [clone|download]'
    // default: 'clone'
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
    desc: "Uses stored prompt's values instead of typing arduously."
    // default: false
  },
  {
    name: 'store-prompts',
    type: 'boolean',
    // eslint-disable-next-line quotes
    desc: "Enable storing latest prompt's values.",
    default: true
  },
  {
    name: 'clean',
    type: 'boolean',
    desc: 'Clean path before generate',
    default: false
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
);
(function() {
  const flags = cli.flags;
  // parse array input
  [
    'extends',
    'plugins',
    'includes',
    'excludes',
    'pull.npm-client-args'
  ].forEach(name => {
    const value = get(flags, name)
    if (value && !Array.isArray(value) && typeof value === 'string') {
      set(flags, name, value.split(','))
    }
  })

  if (cli.flags.debug) {
    dbg.enable('edam-cli')
  }

  if (cli.flags.help) {
    cli.showHelp()
    return
  }

  const config = omitNully(
    Object.assign({
      cacheDir: !flags.noCache && flags.cacheDir,
      updateNotify: flags.updateNotify,
      extends: flags.extends,
      plugins: flags.plugins,
      pull:
        flags.pull &&
        omitNully({
          npmClient: flags.pull['npm-client'],
          npmClientArgs: flags.pull['npm-client-args'],
          git: flags.pull['git']
        }),
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
    })
  )

  debug('config: %o', config)

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

  const Edam = require('edam').Edam
  // default
  if (config.cacheDir === tildify(Edam.constants.DEFAULT_CACHE_DIR)) {
    config.cacheDir = Edam.constants.DEFAULT_CACHE_DIR
  }
  if (config.output === '') {
    delete config.output
  }

  runEdam(Object.assign(config), flags)
    .catch(() => {
      process.exitCode = 1
    })
})()
