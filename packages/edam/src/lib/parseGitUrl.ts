/**
 * @file parseGithubUrl
 * @author Cuttle Cong
 * @date 2018/3/23
 * @description
 */
import * as qs from 'querystring'
import * as cacheParseGithubUrl from 'parse-github-url'

function parseGithubUrl(url: string): object {
  return { ...cacheParseGithubUrl(url) }
}

export default function parse(url: string) {
  url = url.trim()

  let query = {},
    obj
  let i = url.lastIndexOf('?')
  if (i >= 0) {
    query = qs.parse(url.slice(i + 1))
    url = url.substring(0, i)
  }
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
