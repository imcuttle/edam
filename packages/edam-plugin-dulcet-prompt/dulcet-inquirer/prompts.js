/**
 * @file prompts
 * @author Cuttle Cong
 * @date 2018/3/30
 * @description
 */

module.exports = [
  {
    name: 'name',
    type: 'input',
    message: 'Your name',
    default: 'ddddd'
  },
  {
    name: 'password',
    type: 'password',
    message: 'Your password',
    default: 'password'
  },
  {
    type: 'confirm',
    name: 'useTest',
    message: '需要测试吗?🎈',
    when: ({ name }) => !!name,
    default: true
  },
  {
    type: 'confirm',
    name: 'useStyle',
    message: '引入样式吗?🌈',
    when: ({ name }) => !!name,
    default: true
  },
  {
    type: 'list',
    name: 'testName',
    message: '使用什么测试框架?🤡',
    when: ({ useTest }) => useTest,
    choices: ['jest', 'mocha'],
    default: 'jest'
  },
  {
    name: 'gender',
    type: 'list',
    message: 'Your gender',
    default: 'F',
    choices: ['M', 'F']
  },
  {
    name: 'age',
    type: 'input',
    message: 'Your Age',
    validate: function(input) {
      // eslint-disable-next-line eqeqeq
      if (parseInt(input) != input) {
        return 'requires number'
      }
      return true
    },
    default: '18'
  },
  {
    name: 'hobbies',
    type: 'checkbox',
    message: 'Your hobbies',
    default: ['Play', 'Eat'],
    choices: ['Play', 'Eat', 'Sleep']
  },
  {
    name: 'movies',
    type: 'checkbox',
    style: 'block',
    message: 'Your Movies',
    default: ['egg', 'pig'],
    choices: ['adam', 'egg', 'pig']
  },
  {
    name: 'reason_of_adam',
    type: 'input',
    when: function(set) {
      if (set.movies) {
        return set.movies.includes('adam')
      }
    },
    message: 'Why you like adam?',
    default: 'Just like it!'
  }
]
