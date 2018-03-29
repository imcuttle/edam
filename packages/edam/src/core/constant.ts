/**
 * @file constant
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import * as nps from 'path'

const yarnInstall = require('../lib/yarnInstall')
const parseGitConfig = require('parse-git-config')
const gitConfigPath = require('git-config-path')

function gitUserInfo() {
  return Object.assign(
    { name: '', email: '' },
    parseGitConfig.sync({ path: gitConfigPath('global') }).user,
    parseGitConfig.sync({ path: gitConfigPath() }).user
  )
}

export class Constants {
  public DEFAULT_CACHE_DIR: string = nps.join(__dirname, '../../../.cache/edam')
  public DEFAULT_CONTEXT = {
    git: gitUserInfo(),
    pm: yarnInstall.getPm({ respectNpm5: true })
  }
}

export default <Constants>new Constants()
