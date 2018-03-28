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
  root: './abc',
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
  loaders: {

  },
  mappers: [],
  variables: {
    haha: 'hhhh'
  },
  move: {
    '.gitignore': '.gitignore_move'
  },
  copy: {
    '.gitignore_move': '.gitignore_move_clone'
  }
}
