#!/usr/bin/env node
/* eslint-disable */
const tab = require('tabtab')({
  cache: false
  // name: 'edam'
})
const nps = require('path')
const u = require('url')
const https = require('https')
const fs = require('fs')
const chalk = require('chalk')

const REPO = process.env.EDAM_GH_VENDOR_REPO || 'imcuttle/edam-vendor'
const url = u.resolve(
  'https://api.github.com',
  nps.join('/repos', REPO, 'branches')
)
// https://github.com/imcuttle/edam-vendor.git
function fetch(cb) {
  let resp = ''
  let json = {}

  process.env.EDAM_COMPLETE && console.log(' Get branches list: %s', url)
  https
    .request(
      Object.assign(
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
          }
        },
        u.parse(url)
      ),
      function(income) {
        income.on('data', function(chunk) {
          resp += chunk.toString()
        })
        income
          .on('end', function() {
            json = JSON.parse(resp)
            process.env.EDAM_COMPLETE && console.log('Response: \n', json)

            cb(
              json.map(function(x) {
                return x.name
              })
            )
          })
          .on('error', console.error)
      }
    )
    .end()
}

function store(list) {
  const path = nps.join(__dirname, 'comp.json')
  const s = getStore() || {}
  s[url] = list
  fs.writeFileSync(path, JSON.stringify(s))
}

function getStore() {
  const path = nps.join(__dirname, 'comp.json')
  try {
    return JSON.parse(fs.readFileSync(path).toString())
  } catch (err) {
    return null
  }
}

function errorEmpty() {
  console.error('Github REPO: %s has empty branch list.', REPO)
}

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
      return chalk.red(name) + '/'
    }
    return name
  })

  return files
}

tab.on('edam', function(compl, done) {
  if (compl.prev !== 'edam') {
    done(null, complFiles(compl))
    return
  }
  // console.error(compl)

  const stored = (getStore() || {})[url]
  let echod = false
  if (stored) {
    echod = true
    done(null, stored)
  }

  fetch(function(json) {
    if (json) {
      if (!json || !json.length) {
        errorEmpty()
      } else {
        !echod && done(null, json)
        echod = true
      }

      store(json)
    } else {
      errorEmpty()
    }
  })
})

tab.start()

// fetch(console.log)
