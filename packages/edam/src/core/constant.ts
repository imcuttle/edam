/**
 * @file constant
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import * as nps from 'path'

const yarnInstall = require('../lib/yarnInstall')
const fs = require('fs')
const parseGitConfig = require('@moyuyc/parse-git-config')
const gitConfigPath = require('git-config-path')
const findUp = require('find-up')

function gitGitInfo(): { name: string; email: string } {
  const gitPath = findUp.sync('.git')
  let localGitConfig = null
  if (gitPath) {
    const gitConfigPath = nps.join(gitPath, 'config')
    if (fs.existsSync(gitConfigPath)) {
      localGitConfig = parseGitConfig.sync({ path: gitConfigPath })
    }
  }

  // console.log('localGitConfig', Object.assign(
  //   { name: '', email: '' },
  //   parseGitConfig.sync({ path: gitConfigPath('global') }).user,
  //   localGitConfig && localGitConfig.user,
  //   { remote: localGitConfig && localGitConfig['remote "origin"'] && localGitConfig['remote "origin"'].url }
  // ))

  return Object.assign(
    { name: '', email: '' },
    parseGitConfig.sync({ path: gitConfigPath('global') }).user,
    localGitConfig && localGitConfig.user,
    { remote: localGitConfig && localGitConfig['remote "origin"'] && localGitConfig['remote "origin"'].url }
  )
}

export class Constants {
  public DEFAULT_CACHE_DIR: string = nps.join(__dirname, '../../../.cache/edam')
  public DEFAULT_CONTEXT = {
    git: gitGitInfo(),
    pm: <string>yarnInstall.getPm({ respectNpm5: true })
  }
}

export default <Constants>new Constants()
