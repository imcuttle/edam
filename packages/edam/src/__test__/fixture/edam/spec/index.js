/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */

module.exports = {
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
  }
}
