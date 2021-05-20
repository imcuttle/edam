const c = require('chalk')
const tildify = require('tildify')
const dbg = require('debug')
const debug = dbg('edam-cli')

module.exports = function run(config, flags) {
  let spinner = require('ora')()
  const edam = require('edam').default
  const em = edam(Object.assign({}, config), {
    cwd: process.cwd()
  })

  const format = require('util').format
  Object.assign(em.logger, {
    start: () => {
      spinner.start()
    },
    stop: () => {
      spinner.stop()
    },
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

  em.compiler.once('pre', (/*output*/) => {
    // spinner.start('Writing to file...')
  })

  em.compiler.once('register:hooks:after', () => {
    em.compiler.once('post', output => {
      em.logger.success(
        `Generate done! the output: "${tildify(output)}" is waiting for you`
      )
    })
  })

  return em.normalizeConfig().then(() => {
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
            return run(Object.assign({}, config, { source }), flags)
          })
      }
    }

    return Promise.resolve()
      .then(() => em.registerPlugins())
      .then(() => em.checkConfig())
      .then(() => em.pull())
      .then(() => em.process())
      .then(function(fp) {
        const options = {
          clean: flags.clean,
          overwrite: flags.overwrite
        }
        debug('writeToFile %o', options)
        return fp.writeToFile(void 0, options)
      })
      .catch(function(err) {
        if (err && err.id === 'EDAM_ERROR') {
          spinner.fail(err.message)
        } else {
          spinner.fail(err.stack)
        }
        throw err
      })
  })
}
