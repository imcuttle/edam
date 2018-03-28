/**
 * @file parseGithubUrl
 * @author Cuttle Cong
 * @date 2018/3/23
 * @description
 */
import parseQuery from './parseQuery'
import * as cacheParseGithubUrl from 'parse-github-url'
import parseQueryString from './parseQueryString'

function parseGithubUrl(url: string): object {
  return { ...cacheParseGithubUrl(url) }
}

export default function parse(url: string) {
  url = url.trim()

  let obj
  const { query, name } = parseQueryString(url)
  url = name
  if (/^github:/.test(url)) {
    obj = parseGithubUrl(url.replace(/^github:/, ''))
    url = `https://github.com/${obj.repo}.git`
  } else {
    obj = parseGithubUrl(url)
  }

  // https://github.com/picidaejs/picidaejs/blob/b52330e3326279de7e4458b3c62b5bf862bc5d21/src/index.js#L1
  let matched
  if (
    obj.branch === 'blob' &&
    (matched = obj.blob.match(/^[a-z0-9]+(?=\/)/i))
  ) {
    obj.branch = matched[0]
    obj.filepath = obj.filepath.replace(
      new RegExp('^' + matched[0] + '\\/'),
      ''
    )
  }

  obj.checkout = obj.branch
  delete obj.branch
  return { ...obj, ...query, url }
}
