/* eslint-disable indent */
/**
 * @file npm
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import { EdamConfig, Source } from '../../types/Options'
import gitClone, { checkout, pullForce } from '../../lib/gitClone'
import { join } from 'path'
import fileSystem from '../../lib/fileSystem'
import EdamError from '../EdamError'

const filenamify = require('filenamify')
const npmInstall = require('../../lib/yarnInstall')
const tildify = require('tildify')
const down = require('download')
const c = require('chalk')
const nurl = require('url')
const urlJoin = require('url-join')
const isOnline = require('is-online')

const debug = require('debug')('edam:pull:git')

function download(url, dest) {
  return down(url, dest, {
    extract: true,
    strip: 1,
    mode: '666',
    headers: { accept: 'application/zip' }
  })
}

function getUrl(source: Source) {
  let newUrl = source.url
  newUrl = newUrl.replace(/\.git$/, '')
  const { hostname, protocol } = nurl.parse(newUrl)

  if (protocol === 'https:' || protocol === 'http:') {
    if (hostname === 'github.com') {
      newUrl = urlJoin(
        newUrl,
        'archive',
        (source.checkout || 'master') + '.zip'
      )
    } else if (hostname.startsWith('gitlab')) {
      newUrl = urlJoin(
        newUrl,
        'repository/archive.zip?ref=' + (source.checkout || 'master')
      )
    }
  }

  return newUrl
}

module.exports = async function gitPull(
  source: Source,
  destDir: string,
  config: EdamConfig
) {
  const {
    cacheDir,
    pull: { git, npmClient },
    offlineFallback
  } = config
  const log = (this && this.logger && this.logger.log) || console.log
  const errorLog = (this && this.logger && this.logger.warn) || console.error

  let isOffline = offlineFallback ? !(await isOnline()) : false
  debug('isOffline', isOffline)

  async function installFromPkg(target) {
    debug('installFromPkg: %s', target)
    const path = join(target, 'package.json')
    if (!fileSystem.isFile(path)) {
      debug('installFromPkg: %s does not have the package.json', target)
      return
    }
    const text = await fileSystem.readFile(path, {
      encoding: 'utf8'
    })
    const dependencies = JSON.parse(text).dependencies
    if (dependencies && Object.keys(dependencies).length > 0) {
      try {
        await npmInstall({
          stdio: 'ignore',
          respectNpm5: npmClient === 'npm',
          cwd: target,
          production: true
        })
      } catch (err) {
        const msg = `Install package from git "${source.url}" failed \n` + err.stack
        if (isOffline) {
          return errorLog(msg)
        }
        throw new EdamError(
          msg
        )
      }
      log(
        'Installed dependencies automatically, depends %s packages.',
        c.white(Object.keys(dependencies).length)
      )
    }
  }

  let target = join(destDir, 'git', git, filenamify(source.url))

  async function downloadSource() {
    const where = join(target, filenamify(source.checkout || 'master'))
    if (!cacheDir && !isOffline) {
      await fileSystem.cleanDir(where)
    } else if (fileSystem.existsSync(where)) {
      // cached
      log(
        'Using cached git assets from %s by %s\n' +
          'NOTE: Maybe the cache is out of date. you could set cacheDir to be "false" or pull.git to be "clone".',
        c.cyan.bold(tildify(where)),
        c.yellow.bold('Download')
      )
      await installFromPkg(where)
      return where
    }
    const url = getUrl(source)
    await download(url, where)

    await installFromPkg(where)
    // log('Using cached git assets from %s', c.cyan.bold(tildify(target)))
    return where
  }
  async function gitCloneSource() {
    debug('gitCloneSource: target is %s', target)
    if (!cacheDir && !isOffline) {
      await fileSystem.cleanDir(target)
    } else if (fileSystem.existsSync(join(target, '.git'))) {
      // cached
      try {
        await pullForce(target)
        await checkout(source.checkout || 'master', { targetPath: target })
      } catch (err) {
        const msg = err.message + '\n running in ' + tildify(target)
        if (isOffline) {
          return errorLog(msg)
        }
        throw new EdamError(msg)
      }
      log('Using cached git assets from %s', c.cyan.bold(tildify(target)))
      await installFromPkg(target)
      return target
    }

    await gitClone(source.url, target, {
      checkout: source.checkout || 'master'
    })

    await installFromPkg(target)
    return target
  }

  // destDir/git/url/(clone|download/checkout)

  switch (git) {
    case 'clone':
      try {
        return await gitCloneSource()
      } catch (error) {
        errorLog(
          'Error occurs when git clone %s: \n%s\n' +
            'Fallback to use git download.',
          source.url,
          error.message
        )
        return await downloadSource()
      }
    case 'download':
      try {
        return await downloadSource()
      } catch (error) {
        errorLog(
          'Error occurs when git download %s: %s\n' +
            'Maybe the repo of checkout is not found, please check it.\n' +
            'Fallback to use git clone.',
          getUrl(source),
          error.message
        )
        return await gitCloneSource()
      }

    default:
      throw new EdamError(
        `Git pull type "${git}" is not allowed, please use one of 'clone' | 'download'`
      )
  }
}
