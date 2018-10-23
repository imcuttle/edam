/**
 * @file npm
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import { EdamConfig, Source } from '../../types/Options'
import sourceFilenamify from '../sourceFilenamify'
import { join } from 'path'
import * as mkdirp from 'mkdirp'
import fs from '../../lib/fileSystem'
import chalk from 'chalk'
import EdamError from '../EdamError'

const tildify = require('tildify')
const updateNotifier = require('update-notifier')
const c = require('chalk')
const debug = require('debug')('edam:pull:npm')
const semver = require('semver')
const isOnline = require('is-online')

const yarnInstall = require('../../lib/yarnInstall')

module.exports = async function npmPull(
  source: Source,
  destDir: string,
  options: EdamConfig
) {
  const {
    cacheDir,
    pull: { npmClient },
    offlineFallback
  } = options
  let isOffline = offlineFallback ? !(await isOnline()) : false

  const log = (this && this.logger && this.logger.log) || console.log
  const warn = (this && this.logger && this.logger.warn) || console.warn
  const updateNotify = this && this.config && this.config.updateNotify

  let respectNpm5 = npmClient === 'npm'

  const name = source.version ? `${source.url}@${source.version}` : source.url
  let dest: string
  let modulePath: string
  let oldPkgPath: string

  const install = async () => {
    try {
      await yarnInstall([name], {
        respectNpm5,
        stdio: 'pipe',
        cwd: dest
        // showCommand: true
      })
    } catch (err) {
      throw new EdamError(
        `Install package "${name}" failed. \n` + (err ? err.stack : '')
      )
    }

    if (updateNotify && !isOffline) {
      const notifier = updateNotifier({
        pkg: JSON.parse(
          await fs.readFile(join(modulePath, 'package.json'), {
            encoding: 'utf8'
          })
        ),
        updateCheckInterval: 0
      })
      const output =
        this && this.config ? tildify(this.config.output) : './output'
      const upt = notifier.update
      if (upt) {
        notifier.notify({
          message:
            'Update available ' +
            chalk.dim(upt.current) +
            chalk.reset(' → ') +
            chalk.greenBright(upt.latest) +
            ' \nRun ' +
            chalk.cyanBright(`edam ${source.url}@latest -o ${output}`) +
            ' to update'
        })
      }
    }

    const installedVersion = JSON.parse(
      await fs.readFile(oldPkgPath, { encoding: 'utf8' })
    ).version
    log(
      'Installed %s from NPM, and the actual version is %s.',
      c.magenta.bold(name),
      c.greenBright(installedVersion)
    )
  }

  dest = join(destDir, sourceFilenamify(source))
  mkdirp.sync(dest)
  const npmPackageJson = join(dest, 'package.json')
  if (!fs.isFile(npmPackageJson)) {
    await fs.writeFile(
      npmPackageJson,
      JSON.stringify(
        {
          name: 'edam-vendor-cache',
          private: true
        },
        null,
        2
      )
    )
  }

  modulePath = join(dest, 'node_modules', source.url)
  oldPkgPath = join(modulePath, 'package.json')
  if (!cacheDir) {
    await install()
    return modulePath
  }

  let oldPkg
  if (fs.existsSync(oldPkgPath)) {
    oldPkg = JSON.parse(await fs.readFile(oldPkgPath, { encoding: 'utf8' }))
  }
  if (oldPkg && source.version) {
    debug('cache package.json version: %s@%s', name, oldPkg.version)
    debug('source package.json version: %s@%s', name, source.version)
    if (semver.satisfies(oldPkg.version, source.version)) {
      debug('cache satisfied!')
      log(
        'Cached version %s of %s is matched the version %s you wanted.',
        c.cyan.bold(oldPkg.version),
        c.magenta.bold(source.url),
        c.gray.bold(source.version)
      )
      // use cache
      return modulePath
    }

    if (isOffline) {
      warn(
        'Cached version %s of %s do %s match the version %s you wanted.\nDetect you are offline so fallback to use the bad one.',
        c.cyan.bold(oldPkg.version),
        c.magenta.bold(source.url),
        c.red.bold('NOT'),
        c.gray.bold(source.version)
      )
      return modulePath
    }
  }

  await install()
  return modulePath
}
