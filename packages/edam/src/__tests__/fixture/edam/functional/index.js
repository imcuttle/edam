/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */

module.exports = function(/*options*/) {
  return {
    ignore: ['im_ignored', 'imignored/*', '!imignored/keep*'],
    prompts: [
      {
        name: 'username',
        type: 'input',
        default: '${git.name}'
      },
      {
        name: 'value',
        type: 'input',
        default: () => 'default_val'
      }
    ],
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
