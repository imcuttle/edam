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
    name: 'gender',
    type: 'radio',
    message: 'Your gender',
    default: 'F',
    options: ['M', 'F']
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
    options: ['Play', 'Eat', 'Sleep']
  },
  {
    name: 'movies',
    type: 'checkbox',
    style: 'block',
    message: 'Your Movies',
    default: ['egg', 'pig'],
    options: ['adam', 'egg', 'pig']
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
