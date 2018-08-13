#!/usr/bin/env node
/* eslint-disable */
const edam = require('edam').default
const co = require('co')
const fs = require('fs')
const nps = require('path')
const tildify = require('tildify')

const tab = require('tabtab')({
  cache: false
})

function complFiles(compl) {
  let last = compl.last || ''
  last = last.trim()

  let files = fs.readdirSync(process.cwd())

  files = files.filter(function(name) {
    if (!last) {
      return !name.startsWith('.')
    }
    return name.startsWith(last)
  })

  files = files.map(function(name) {
    if (fs.statSync(nps.join(process.cwd(), name)).isDirectory()) {
      return name + '/'
    }
    return name
  })

  return files
}

const getList = co.wrap(function*(compl) {
  function getDesc(source) {
    switch (source.type) {
      case 'npm':
        source = source.url
        break
      case 'git':
        source = source.url
        break
      case 'file':
        source = tildify(source.url)
        break
    }
    // tabtab bug
    // command: desc :decs
    // not works
    return source.replace(/^.*:/, '')
  }
  const em = edam(
    {
      userc: true
    },
    { cwd: process.cwd() }
  )
  // not yet checked Config
  yield em.ready()

  return Object.keys(em.config.alias).map(function(name) {
    let config = em.config.alias[name]
    if (config.description) {
      return `${name}:${config.description}`
    }

    return `${name}:${config.type} -> ${getDesc(config)}`
  })
})

// getList().then(console.log).catch(console.error)
tab.on(
  'edam',
  co.wrap(function*(compl, done) {
    // console.error(compl)
    // > edam .
    if (compl.prev === 'edam' && compl.words === 1) {
      try {
        const list = yield getList()
        done(null, list)
      } catch (err) {
        done(err)
      }
      return
    }

    if (['-o', '--output'].includes(compl.prev)) {
      try {
        done(null, complFiles(compl))
      } catch (err) {
        done(err)
      }
    }
    // console.log(list)
  })
)

tab.start()
