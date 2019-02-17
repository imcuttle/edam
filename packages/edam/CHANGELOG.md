# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
