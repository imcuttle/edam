#!/usr/bin/env node

const importLocal = require('import-local')

if (importLocal(__filename)) {
  console.log('using local version of edam')
} else {
  const requireFallback = require('require-fallback-middle').default

  requireFallback()
  require('./edam')
}
