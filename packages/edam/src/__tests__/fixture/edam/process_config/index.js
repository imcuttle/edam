/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */

module.exports = function(/*options*/) {
  return {
    prompts: [
      {
        name: 'username',
        type: 'input',
        default: '${git.name}'
      },
      {
        name: 'value',
        type: 'input',
        default: '${baseName}'
      }
    ],
    process(answer) {
      console.log('answer.username', answer.username)
      return {
        ignore: ['im_ignored', 'imignored/*', '!imignored/keep*'],
        variables: {
          haha: 'hhhh'
        },
        hooks: {
          assets: [
            function(assets) {
              console.log(assets)
            }
          ]
        },
        usefulHook: {
          gitInit: true
        }
      }
    }
  }
}
