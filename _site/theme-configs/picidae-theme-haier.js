/**
 * @file picidae-theme-haier
 * @author Cuttle Cong
 * @date 2018/4/1
 * @description
 */

module.exports = {
  logo: {
    // src: 'https://github.com/picidaejs/picidaejs/raw/master/logo/picidae-2x.png',
    name: 'Edam'
  },

  // work on title
  description: '🍔 The universal picidae theme for project / library / framework etc.',

  defaultLang: 'en',

  headers: [
    {
      i18n: {
        en: 'About',
        zh: '关于'
      },
      url: '/about/why-needs-edam'
    },
    {
      i18n: {
        en: 'Usage',
        zh: '使用'
      },
      url: '/usage/installation'
    },
    {
      i18n: {
        en: 'Feature',
        zh: '特性'
      },
      url: '/features'
    },
    {
      i18n: {
        en: 'Advanced',
        zh: '进阶学习'
      },
      url: '/advanced/process'
    },
    // spec
    'i18n', /*'search', */'github'
  ],
  // repository: 'picidaejs/picidae-theme-haier',
  repository: {
    repo: 'https://github.com/imcuttle/edam',
    branch: 'master',
    prefix: '_site/doc'
  },

  search: {
    // apiKey: '775577a5c1951d4c202e59d73aa02cef',
    // indexName: 'haier'
  },

  style: {
    loadingColor: '#dd2f3d'
  },

  footer: {
    // organization: {
    //   to: 'https://github.com/picidaejs/picidaejs',
    //   logo: 'https://github.com/picidaejs/picidaejs/raw/master/logo/picidae-2x.png'
    // },
    // copyright: 'Copyright © 2018 - Built by Picidae'
  }
}
