/* eslint-disable eqeqeq */
/**
 * @file processAsync
 * @author Cuttle Cong
 * @date 2018/3/27
 * @description
 */
function processAsync(process, cmd: string = '', cb) {
  if (typeof cmd === 'function') {
    cb = cmd
    cmd = ''
  }

  process.on('error', function(err) {
    cb && cb(err)
  })

  let stderr = ''
  let stdout = ''
  process.stderr && process.stderr.on('data', chunk => {
    stderr += chunk.toString()
  })
  process.stdout && process.stdout.on('data', chunk => {
    stdout += chunk.toString()
  })
  process.on('close', function(status) {
    if (status == 0) {
      cb && cb(null, stdout, stderr)
    } else {
      cb &&
        cb(
          new Error(
            (
              (cmd ? `'${cmd}' failed with status ` + status + '\n' : '') +
              stderr
            ).trim()
          )
        )
    }
  })
}

export default processAsync
