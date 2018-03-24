/**
 * @file isGitUrl
 * @author Cuttle Cong
 * @date 2018/3/23
 * @description
 */
export default function isGitUrl(url: string) {
  url = url.trim()
  return (
    /^(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)?(\/?|#[-\d\w._]+?)$/.test(url)
    || /^github:.+?\/.+?(\/.+?)?/.test(url)
  )
}
