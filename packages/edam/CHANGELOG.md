# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2024-09-11)



## 3.4.15 (2021-09-06)


### Bug Fixes

* mapper 默认继承 ([01c5952](https://github.com/imcuttle/edam/commit/01c595294ea8bfe6654e62336ac66d2bcd2071cf))



## 3.4.14 (2021-08-12)


### Bug Fixes

* symblic file and executable file ([ef75bca](https://github.com/imcuttle/edam/commit/ef75bcad8e1893c3fb91ba53846c53f827805c1b))



## 3.4.13 (2021-08-08)



## 3.4.11 (2021-06-03)



## 3.4.10 (2021-05-27)


### Bug Fixes

* extends 找不到错误没有 catch ([c1e7357](https://github.com/imcuttle/edam/commit/c1e7357b73129e7e3122640a629e0b98df2c427f))



## 3.4.9 (2021-05-20)



## 3.4.8 (2021-05-20)



## 3.4.7 (2021-05-20)



## 3.4.6 (2021-04-22)



## 3.4.5 (2021-04-07)



## 3.4.4 (2021-04-07)



## 3.4.3 (2021-04-07)



## 3.4.2 (2021-04-07)



## 3.4.1 (2021-04-04)



# 3.4.0 (2021-04-04)


### Features

* add `mimeTest` in mappers ([ac051eb](https://github.com/imcuttle/edam/commit/ac051eb0f8e778109f3a6e98391d8d9314bc9e9c))



## 3.3.11 (2020-11-28)



## 3.3.8 (2020-10-26)



## 3.3.7 (2020-10-26)



## 3.3.6 (2020-10-26)



## 3.3.5 (2020-10-26)



## 3.3.4 (2020-10-24)



## 3.3.3 (2020-10-20)



## 3.3.1 (2019-11-23)


### Bug Fixes

* edam config is advanced for alias ([d2a06c6](https://github.com/imcuttle/edam/commit/d2a06c6132d82e4a1f7b8e6aa3d45861c174ff21))



# 3.2.0 (2019-02-20)


### Features

* **edam:** support `pull.npmClientArgs` ([2b6f29f](https://github.com/imcuttle/edam/commit/2b6f29f9282dc64ddd64b35f00ded3a2a7c0f610)), closes [#25](https://github.com/imcuttle/edam/issues/25)



## 3.1.5 (2019-02-19)


### Bug Fixes

* **yarn-install:** use shellSync ([ef6fb61](https://github.com/imcuttle/edam/commit/ef6fb61015b3e636a362e999981ce09126fc8256))



## 3.1.4 (2019-02-17)


### Bug Fixes

* **edam:** use resolveEdamTemplate instead of require.resolve ([c228c8a](https://github.com/imcuttle/edam/commit/c228c8a5e4b6f73b994b66f9a26626d04be17bdb))



## 3.1.2 (2019-02-17)


### Bug Fixes

* **edam:** use resolveEdamTemplate instead of require.resolve ([af753eb](https://github.com/imcuttle/edam/commit/af753eb8f2eef2d489faa1cc13865cf196e9572c))



## 3.1.1 (2019-02-15)


### Bug Fixes

* **edam-pull-npm:** use execa in npmInstall for supporting version range ([637fffa](https://github.com/imcuttle/edam/commit/637fffaa271bccfe72c7f76c2dfa435983556c65))



# 3.1.0 (2019-02-10)


### Features

* **edam:** support `edam:main` field in package.json ([25fe39b](https://github.com/imcuttle/edam/commit/25fe39b908ccf70141a1845856dab07f35545c1c))



## 3.0.3 (2019-01-30)


### Bug Fixes

* **edam:** store-prompt does not work ([e269cdd](https://github.com/imcuttle/edam/commit/e269cdddaa45fc686d1729cd72f7e6adbcfe2dd6))



## 3.0.2 (2019-01-02)



## 3.0.1 (2018-10-23)



# 3.0.0 (2018-10-23)


### Bug Fixes

* updateNotify is not working ([fab3586](https://github.com/imcuttle/edam/commit/fab35869998ff98ef8d680168837958364072ac8)), closes [#10](https://github.com/imcuttle/edam/issues/10)


### Features

* add `offlineFallback` option ([b60ae55](https://github.com/imcuttle/edam/commit/b60ae557b26865a57373f001942b5dc459ffd04d)), closes [#18](https://github.com/imcuttle/edam/issues/18)
* handlebar.js inject some bulit-in helper (e.g. `eq`) ([50c593e](https://github.com/imcuttle/edam/commit/50c593eb1c933869cbd4a6755ea6095203a5140f)), closes [#17](https://github.com/imcuttle/edam/issues/17)
* support `scope` `ignore` globby files ([096b521](https://github.com/imcuttle/edam/commit/096b52123f0c6a2223a17208b3e615335873a17b)), closes [#16](https://github.com/imcuttle/edam/issues/16)
* supports `debug` option ([b0cb8b7](https://github.com/imcuttle/edam/commit/b0cb8b713199d1a8bc744a1ddfa510fce80bb448))


### Performance Improvements

* should updateCheckInterval to be zero in npm template ([2abaad1](https://github.com/imcuttle/edam/commit/2abaad11f6fb9d2afbdf9b9b448671ee316dff72))
* **edam:** make `storePrompts` be more useful ([5c123ca](https://github.com/imcuttle/edam/commit/5c123caaecdc557f6f76e375fcb450e04895603d)), closes [#21](https://github.com/imcuttle/edam/issues/21) [#22](https://github.com/imcuttle/edam/issues/22)


### BREAKING CHANGES

* remove lodash loader



## 2.3.14 (2018-10-03)


### Bug Fixes

* preset `git.name` should find up git config ([5f03397](https://github.com/imcuttle/edam/commit/5f033975854c39dc793b1dfbb166c4aef95039f7))



## 2.3.13 (2018-09-28)


### Bug Fixes

* **resolve:** should throw error when module is found ([92b33b9](https://github.com/imcuttle/edam/commit/92b33b9b10aa676cb4bd0e253b72de89ac218055))



## 2.3.12 (2018-09-05)


### Bug Fixes

* **file-processor:** should ignore writing file when contains error ([eed9ccb](https://github.com/imcuttle/edam/commit/eed9ccb460b2e8a92e7cc30920983e2b4c381594))



## 2.3.11 (2018-09-05)


### Bug Fixes

* **prompt:** should assign value when exists `validate` ([e2755fc](https://github.com/imcuttle/edam/commit/e2755fc16a2696ce6b3d320c38c48d76ce54fcd4))



## 2.3.10 (2018-09-05)


### Performance Improvements

* use `EdamError` thrown ([845bafe](https://github.com/imcuttle/edam/commit/845bafe1bee88bba272df8f029dad85b37a33487))



## 2.3.9 (2018-09-02)



## 2.3.8 (2018-08-30)


### Bug Fixes

* **edam:** storePrompts filename when type eq 'npm' ([de6ba75](https://github.com/imcuttle/edam/commit/de6ba75e9893062f209c37d377f1f24265a4093a))



## 2.3.6 (2018-08-21)



## 2.3.5 (2018-08-21)



## 2.3.4 (2018-08-18)


### Bug Fixes

* prompt.default placeholder replacer ([7e98544](https://github.com/imcuttle/edam/commit/7e98544960c3f8328646fb0d7fe320986d68a610))



## 2.3.2 (2018-08-16)



## 2.3.1 (2018-08-14)


### Bug Fixes

* **edam-cli:** update log when error occurs ([ce1949a](https://github.com/imcuttle/edam/commit/ce1949a42dd7dfd749f24b267888817457d8ae2b))



# 2.3.0 (2018-08-14)


### Features

* **edam:** supports placeholder of dest in `move` and `copy` ([9f72ffa](https://github.com/imcuttle/edam/commit/9f72ffa08f243438888a3559ee09805109095097))



## 2.2.2 (2018-08-14)


### Performance Improvements

* **edam:** support plop 'hbs' loader ([e8aed91](https://github.com/imcuttle/edam/commit/e8aed910089235879f946a0129f4527e329bf460))
* **edam:** support plop 'hbs' loader ([e9830ce](https://github.com/imcuttle/edam/commit/e9830ced4a6c7d2c28d37577c7cd2c92bd3405a3))



## 2.2.1 (2018-08-14)


### Bug Fixes

* **edam:** variables.install ([ee94133](https://github.com/imcuttle/edam/commit/ee94133d082b9e8dd354b0d20b26d42d74844a5d))



## 2.1.5 (2018-08-13)



## 2.1.5-y.1 (2018-08-13)



## 2.1.5-y.0 (2018-08-13)



## 2.1.3 (2018-08-10)


### Bug Fixes

* edam check allow config ([4720a16](https://github.com/imcuttle/edam/commit/4720a16b82c577ffb813825f783770e737e9e465))



## 2.1.2 (2018-08-05)



## 2.1.1 (2018-08-04)



# 2.1.0 (2018-08-04)



## 2.0.2 (2018-06-28)



## 2.0.1 (2018-06-27)


### Performance Improvements

* **edam:** template config append `process` ([03d8253](https://github.com/imcuttle/edam/commit/03d825364bd86fefb26d5bf0ac57112354387103))



# 2.0.0 (2018-06-26)


### Performance Improvements

* **edam:** cancel Variables' shallow function getter ([9d18ca7](https://github.com/imcuttle/edam/commit/9d18ca75e9dad979ad653f1b137250897b5be47d))



## 1.1.2 (2018-06-01)



## 1.1.1 (2018-06-01)



# 1.1.0 (2018-06-01)


### Bug Fixes

* **edam:** normalize `source` and `alias` which are relative path ([8e7d546](https://github.com/imcuttle/edam/commit/8e7d54657cd1f5f0678266fd44f78282d8e57326))



# 1.0.0 (2018-05-31)


### Bug Fixes

* config.output is null ([c27f958](https://github.com/imcuttle/edam/commit/c27f958857da11d64440a5a88d6c1bfab680bc4c))



## 0.3.6 (2018-05-20)



## 0.3.5 (2018-05-20)


### Bug Fixes

* install in context pm inherred by config ([1961268](https://github.com/imcuttle/edam/commit/1961268136f14c324be2c3a48c8551ffafcf3c5e))
* processAsync ([7352ec8](https://github.com/imcuttle/edam/commit/7352ec8b6c3ac14311c59369db6429182a27cf28))



## 0.3.4 (2018-05-18)



## 0.3.4-0 (2018-05-18)


### Bug Fixes

* store prompts matched fail when from git ([ff2e4e7](https://github.com/imcuttle/edam/commit/ff2e4e748ba7b45bd6844a7edb81ac23143ba743))



## 0.3.3 (2018-04-26)



## 0.3.3-0 (2018-04-26)


### Bug Fixes

* prompt when field not work ([16fa53c](https://github.com/imcuttle/edam/commit/16fa53c0252f7c8f46b749311503a1f4d515f622))



## 0.3.2 (2018-04-14)


### Bug Fixes

* store prmopts when type equals git ([341c0d2](https://github.com/imcuttle/edam/commit/341c0d2df74a7900b0af25b3030fa8d05e1b6dd3))


### Performance Improvements

* prompt supports 'deniesStore' field ([d6968bb](https://github.com/imcuttle/edam/commit/d6968bba2024086783bb8856b5a842300846c31a))



## 0.3.1 (2018-04-14)



# 0.3.0 (2018-04-14)


### Performance Improvements

* supports `baseName` value ([b7e8a88](https://github.com/imcuttle/edam/commit/b7e8a888943897c916cc4ef4148292a261f1c02c))



## 0.2.3 (2018-04-14)



## 0.2.2 (2018-04-12)



## 0.2.1 (2018-04-12)


### Bug Fixes

* loaders support Options ([4211807](https://github.com/imcuttle/edam/commit/4211807d4538806b5f285aa2aed169546edd48fd))



# 0.2.0 (2018-04-11)



## 0.1.2 (2018-04-10)



## 0.1.1 (2018-04-10)



# 0.1.0 (2018-04-10)


### Performance Improvements

* use walli ([dc64a1e](https://github.com/imcuttle/edam/commit/dc64a1e9ce3ae1b0ff55d9e3415cb49e3485cebd))



## 0.0.18 (2018-04-08)


### Performance Improvements

* context add loadsh ([f344c3a](https://github.com/imcuttle/edam/commit/f344c3a002663c0c8bb82a0600a9c405bf484f47))



## 0.0.17 (2018-04-05)



## 0.0.16 (2018-04-05)



## 0.0.15 (2018-04-04)


### Bug Fixes

* inferred plugins ([f38c33f](https://github.com/imcuttle/edam/commit/f38c33f23a3d8e7c3963acd6e748e8d56ccf4c48))
* plugins inferred ([ebcc524](https://github.com/imcuttle/edam/commit/ebcc52432903ab4415cebb5fd7f7cc5c1ab64434))
* plugins inferred ([a721207](https://github.com/imcuttle/edam/commit/a721207711475e7bef2f3c7e291d33858ff9dcc3))



## 0.0.14 (2018-04-03)


### Bug Fixes

* json5 parse ([ecdb4d5](https://github.com/imcuttle/edam/commit/ecdb4d5f2b0df9a837474f856ab23a14b6cdd877))



## 0.0.13 (2018-04-02)



## 0.0.12 (2018-04-01)


### Bug Fixes

* source alias ([b147604](https://github.com/imcuttle/edam/commit/b1476049aeab1bbbeb22d939e5986987d93152b5))



## 0.0.10 (2018-03-31)



## 0.0.10-0 (2018-03-31)


### Bug Fixes

* use deepclone allow dynamic template config ([8865fef](https://github.com/imcuttle/edam/commit/8865fef690a5d822f785bedebd16567c6377d1ee))



## 0.0.8 (2018-03-31)



## 0.0.7 (2018-03-31)



## 0.0.6 (2018-03-31)



## 0.0.5 (2018-03-30)


### Bug Fixes

* bin/edam updateNotify ([ad6a3e3](https://github.com/imcuttle/edam/commit/ad6a3e371825960d47c3b47b4617a8955fc743d8))


### Performance Improvements

* add edam-plugin-dulcet-prompt ([d483b05](https://github.com/imcuttle/edam/commit/d483b0560fd3c72e768c11195f51ffeece7ca4d6))



## 0.0.4 (2018-03-29)



## 0.0.3 (2018-03-29)



## 0.0.2 (2018-03-29)





## [3.4.15](https://github.com/imcuttle/edam/compare/v3.4.14...v3.4.15) (2021-09-06)


### Bug Fixes

* mapper 默认继承 ([01c5952](https://github.com/imcuttle/edam/commit/01c595294ea8bfe6654e62336ac66d2bcd2071cf))





## [3.4.14](https://github.com/imcuttle/edam/compare/v3.4.13...v3.4.14) (2021-08-12)


### Bug Fixes

* symblic file and executable file ([ef75bca](https://github.com/imcuttle/edam/commit/ef75bcad8e1893c3fb91ba53846c53f827805c1b))





## [3.4.13](https://github.com/imcuttle/edam/compare/v3.4.12...v3.4.13) (2021-08-08)

**Note:** Version bump only for package edam





## [3.4.11](https://github.com/imcuttle/edam/compare/v3.4.10...v3.4.11) (2021-06-03)

**Note:** Version bump only for package edam





## [3.4.10](https://github.com/imcuttle/edam/compare/v3.4.9...v3.4.10) (2021-05-27)


### Bug Fixes

* extends 找不到错误没有 catch ([c1e7357](https://github.com/imcuttle/edam/commit/c1e7357b73129e7e3122640a629e0b98df2c427f))





## [3.4.9](https://github.com/imcuttle/edam/compare/v3.4.8...v3.4.9) (2021-05-20)

**Note:** Version bump only for package edam





## [3.4.8](https://github.com/imcuttle/edam/compare/v3.4.7...v3.4.8) (2021-05-20)

**Note:** Version bump only for package edam





## [3.4.7](https://github.com/imcuttle/edam/compare/v3.4.6...v3.4.7) (2021-05-20)

**Note:** Version bump only for package edam





## [3.4.6](https://github.com/imcuttle/edam/compare/v3.4.5...v3.4.6) (2021-04-22)

**Note:** Version bump only for package edam





## [3.4.5](https://github.com/imcuttle/edam/compare/v3.4.4...v3.4.5) (2021-04-07)

**Note:** Version bump only for package edam





## [3.4.4](https://github.com/imcuttle/edam/compare/v3.4.3...v3.4.4) (2021-04-07)

**Note:** Version bump only for package edam





## [3.4.3](https://github.com/imcuttle/edam/compare/v3.4.2...v3.4.3) (2021-04-07)

**Note:** Version bump only for package edam





## [3.4.2](https://github.com/imcuttle/edam/compare/v3.4.1...v3.4.2) (2021-04-07)

**Note:** Version bump only for package edam





## [3.4.1](https://github.com/imcuttle/edam/compare/v3.4.0...v3.4.1) (2021-04-04)

**Note:** Version bump only for package edam





# [3.4.0](https://github.com/imcuttle/edam/compare/v3.3.12...v3.4.0) (2021-04-04)


### Features

* add `mimeTest` in mappers ([ac051eb](https://github.com/imcuttle/edam/commit/ac051eb0f8e778109f3a6e98391d8d9314bc9e9c))





## [3.3.11](https://github.com/imcuttle/edam/compare/v3.3.10...v3.3.11) (2020-11-28)

**Note:** Version bump only for package edam





## [3.3.8](https://github.com/imcuttle/edam/compare/v3.3.7...v3.3.8) (2020-10-26)

**Note:** Version bump only for package edam





## [3.3.7](https://github.com/imcuttle/edam/compare/v3.3.6...v3.3.7) (2020-10-26)

**Note:** Version bump only for package edam





## [3.3.6](https://github.com/imcuttle/edam/compare/v3.3.5...v3.3.6) (2020-10-26)

**Note:** Version bump only for package edam





## [3.3.5](https://github.com/imcuttle/edam/compare/v3.3.4...v3.3.5) (2020-10-26)

**Note:** Version bump only for package edam





## [3.3.4](https://github.com/imcuttle/edam/compare/v3.3.3...v3.3.4) (2020-10-24)

**Note:** Version bump only for package edam





## [3.3.3](https://github.com/imcuttle/edam/compare/v3.3.2...v3.3.3) (2020-10-20)

**Note:** Version bump only for package edam





<a name="3.3.1"></a>
## [3.3.1](https://github.com/imcuttle/edam/compare/v3.3.0...v3.3.1) (2019-11-23)


### Bug Fixes

* edam config is advanced for alias ([d2a06c6](https://github.com/imcuttle/edam/commit/d2a06c6))




<a name="3.2.0"></a>
# [3.2.0](https://github.com/imcuttle/edam/compare/v3.1.5...v3.2.0) (2019-02-20)


### Features

* **edam:** support `pull.npmClientArgs` ([2b6f29f](https://github.com/imcuttle/edam/commit/2b6f29f)), closes [#25](https://github.com/imcuttle/edam/issues/25)




<a name="3.1.5"></a>
## [3.1.5](https://github.com/imcuttle/edam/compare/v3.1.4...v3.1.5) (2019-02-19)


### Bug Fixes

* **yarn-install:** use shellSync ([ef6fb61](https://github.com/imcuttle/edam/commit/ef6fb61))




<a name="3.1.4"></a>
## [3.1.4](https://github.com/imcuttle/edam/compare/v3.1.3...v3.1.4) (2019-02-17)


### Bug Fixes

* **edam:** use resolveEdamTemplate instead of require.resolve ([c228c8a](https://github.com/imcuttle/edam/commit/c228c8a))




<a name="3.1.3"></a>
## [3.1.3](https://github.com/imcuttle/edam/compare/v3.1.2...v3.1.3) (2019-02-17)




**Note:** Version bump only for package edam

<a name="3.1.2"></a>
## [3.1.2](https://github.com/imcuttle/edam/compare/v3.1.1...v3.1.2) (2019-02-17)


### Bug Fixes

* **edam:** use resolveEdamTemplate instead of require.resolve ([af753eb](https://github.com/imcuttle/edam/commit/af753eb))




<a name="3.1.1"></a>
## [3.1.1](https://github.com/imcuttle/edam/compare/v3.1.0...v3.1.1) (2019-02-15)


### Bug Fixes

* **edam-pull-npm:** use execa in npmInstall for supporting version range ([637fffa](https://github.com/imcuttle/edam/commit/637fffa))




<a name="3.1.0"></a>
# [3.1.0](https://github.com/imcuttle/edam/compare/v3.0.3...v3.1.0) (2019-02-10)


### Features

* **edam:** support `edam:main` field in package.json ([25fe39b](https://github.com/imcuttle/edam/commit/25fe39b))




<a name="3.0.3"></a>
## [3.0.3](https://github.com/imcuttle/edam/compare/v3.0.2...v3.0.3) (2019-01-30)


### Bug Fixes

* **edam:** store-prompt does not work ([e269cdd](https://github.com/imcuttle/edam/commit/e269cdd))




<a name="3.0.2"></a>
## [3.0.2](https://github.com/imcuttle/edam/compare/v3.0.1...v3.0.2) (2019-01-02)




**Note:** Version bump only for package edam

<a name="3.0.1"></a>
## [3.0.1](https://github.com/imcuttle/edam/compare/v3.0.0...v3.0.1) (2018-10-23)




**Note:** Version bump only for package edam

<a name="3.0.0"></a>
# [3.0.0](https://github.com/imcuttle/edam/compare/v2.3.14...v3.0.0) (2018-10-23)


### Bug Fixes

* updateNotify is not working ([fab3586](https://github.com/imcuttle/edam/commit/fab3586)), closes [#10](https://github.com/imcuttle/edam/issues/10)


### Features

* add `offlineFallback` option ([b60ae55](https://github.com/imcuttle/edam/commit/b60ae55)), closes [#18](https://github.com/imcuttle/edam/issues/18)
* handlebar.js inject some bulit-in helper (e.g. `eq`) ([50c593e](https://github.com/imcuttle/edam/commit/50c593e)), closes [#17](https://github.com/imcuttle/edam/issues/17)
* support `scope` `ignore` globby files ([096b521](https://github.com/imcuttle/edam/commit/096b521)), closes [#16](https://github.com/imcuttle/edam/issues/16)
* supports `debug` option ([b0cb8b7](https://github.com/imcuttle/edam/commit/b0cb8b7))


### Performance Improvements

* **edam:** make `storePrompts` be more useful ([5c123ca](https://github.com/imcuttle/edam/commit/5c123ca)), closes [#21](https://github.com/imcuttle/edam/issues/21) [#22](https://github.com/imcuttle/edam/issues/22)
* should updateCheckInterval to be zero in npm template ([2abaad1](https://github.com/imcuttle/edam/commit/2abaad1))


### BREAKING CHANGES

* remove lodash loader




<a name="2.3.14"></a>
## [2.3.14](https://github.com/imcuttle/edam/compare/v2.3.13...v2.3.14) (2018-10-03)


### Bug Fixes

* preset `git.name` should find up git config ([5f03397](https://github.com/imcuttle/edam/commit/5f03397))




<a name="2.3.13"></a>
## [2.3.13](https://github.com/imcuttle/edam/compare/v2.3.12...v2.3.13) (2018-09-28)


### Bug Fixes

* **resolve:** should throw error when module is found ([92b33b9](https://github.com/imcuttle/edam/commit/92b33b9))




<a name="2.3.12"></a>
## [2.3.12](https://github.com/imcuttle/edam/compare/v2.3.11...v2.3.12) (2018-09-05)


### Bug Fixes

* **file-processor:** should ignore writing file when contains error ([eed9ccb](https://github.com/imcuttle/edam/commit/eed9ccb))




<a name="2.3.11"></a>
## [2.3.11](https://github.com/imcuttle/edam/compare/v2.3.10...v2.3.11) (2018-09-05)


### Bug Fixes

* **prompt:** should assign value when exists `validate` ([e2755fc](https://github.com/imcuttle/edam/commit/e2755fc))




<a name="2.3.10"></a>
## [2.3.10](https://github.com/imcuttle/edam/compare/v2.3.9...v2.3.10) (2018-09-05)


### Performance Improvements

* use `EdamError` thrown ([845bafe](https://github.com/imcuttle/edam/commit/845bafe))




<a name="2.3.9"></a>
## [2.3.9](https://github.com/imcuttle/edam/compare/v2.3.8...v2.3.9) (2018-09-02)




**Note:** Version bump only for package edam

<a name="2.3.8"></a>
## [2.3.8](https://github.com/imcuttle/edam/compare/v2.3.7...v2.3.8) (2018-08-30)


### Bug Fixes

* **edam:** storePrompts filename when type eq 'npm' ([de6ba75](https://github.com/imcuttle/edam/commit/de6ba75))
