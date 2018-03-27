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

const tildify = require('tildify')
const updateNotifier = require('update-notifier')
const c = require('chalk')
const debug = require('debug')('edam:pull:npm')
const semver = require('semver')
const yarnInstall = require('yarn-install')

module.exports = async function(
  source: Source,
  destDir: string,
  options: EdamConfig
) {
  const { cacheDir, pull: { npmClient } } = options

  const log = (this && this.logger && this.logger.log) || console.log

  let respectNpm5 = npmClient === 'npm'
  const name = source.version ? `${source.url}@${source.version}` : source.url
  let dest: string
  let modulePath: string
  let oldPkgPath: string

  let proc
  function assertProcess() {
    // eslint-disable-next-line eqeqeq
    if (proc.status != '0') {
      throw new Error(
        `Install package "${name}" failed: ` + proc.error.message ||
          proc.stderr.toString().trim()
      )
    }
  }
  const install = async () => {
    proc = yarnInstall([name], {
      respectNpm5,
      stdio: 'pipe',
      cwd: dest
      // showCommand: true
    })
    assertProcess()

    const notifier = updateNotifier({
      pkg: JSON.parse(
        await fs.readFile(join(modulePath, 'package.json'), {
          encoding: 'utf8'
        })
      )
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
          chalk.green(upt.latest) +
          ' \nRun ' +
          chalk.cyan(`edam ${source.url}@latest ${output}`) +
          ' to update'
      })
    }

    const installedVersion = JSON.parse(
      await fs.readFile(oldPkgPath, { encoding: 'utf8' })
    ).version
    log(
      'Installed %s from NPM, and the actual version is %s.',
      c.magenta.bold(name),
      c.green(installedVersion)
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
        'Cached version %s of %s is matched the version range %s that you wanted.',
        c.cyan.bold(oldPkg.version),
        c.magenta.bold(source.url),
        c.gray.bold(source.version)
      )
      // use cache
      return modulePath
    }
  }

  await install()
  return modulePath
}
