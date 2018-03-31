
module.exports = {
  prompts: [
    {
      name: 'user',
      message: 'hi',
      default: 'edam-user'
    },
    {
      name: 'password',
      message: 'pass',
      default: (answers) => answers.user
    },
    {
      name: 'age',
      message: 'abc',
      when: 'user!=="edam-user"',
      default: '19'
    }
  ],
  // mappers: {
  //   "*": "Lodash"
  // }
  // root: './template.txt'
}
