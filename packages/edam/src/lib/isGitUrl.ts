/**
 * @file isGitUrl
 * @author Cuttle Cong
 * @date 2018/3/23
 * @description
 */

export function isExact(url) {
  url = url.trim()
  return (
    /^(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)?(\/?|#[-\d\w._]+?)$/.test(url)
  )
}

export default function isGitUrl(url: string) {
  url = url.trim()
  const p = isExact(url)
  if (p) return p

  if (/^github:.+?\/.+?(\/.+?)?/.test(url)) {
    return true
  }
  const chunks = url.split('/')
  if (chunks.length === 2 && !chunks[0].startsWith('@')) {
    return true
  }
}
