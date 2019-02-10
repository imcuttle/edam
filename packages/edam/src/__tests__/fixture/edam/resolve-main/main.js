/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */

module.exports = {
  ignore: [
    'im_ignored', 'imignored/*', '!imignored/keep*'
  ],
  prompts: [
    {
      name: 'username',
      type: 'input',
      default: '${git.name}'
    },
    {
      name: 'value',
      type: 'input',
      validate: (val) => {
        console.error('validate', val)
        if (val === 'error') {
          return 'should be error message here!'
        }
      },
      default: () => 'default_val'
    }
  ],
  variables: {
    haha: 'hhhh'
  },
  hooks: {
    'assets': [
      function (assets) {
        console.log(assets)
      }
    ]
  }
}
