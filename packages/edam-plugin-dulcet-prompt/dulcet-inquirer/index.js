/* eslint-disable require-yield */
const app = require('express')()
const getPort = require('get-port')
const fs = require('fs')
const nps = require('path')
const opn = require('opn')
const co = require('co')
const template = require('lodash.template')
const EventEmitter = require('events')

const DEFAULT_TPL_PATH = nps.join(__dirname, './template.ejs')

function pass(res, action, data) {
  res.json({ status: 'ok', action, data })
}

// function fail(res, message) {
//   res.json({ status: 'fail', message })
// }

function emitServer({
  port,
  prompts,
  promptsForRender,
  whenPrompts,
  withoutWhenPrompts,
  templatePath = DEFAULT_TPL_PATH,
  tplData = {
    title: '😊 Dulcet Inquirer'
  }
}) {
  const string = fs.readFileSync(templatePath).toString()
  const compiled = template(string, { interpolate: /<%=([\s\S]+?)%>/g })

  const emitter = new EventEmitter()
  const promptValues = prompts.reduce(function(set, val) {
    set[val.name] = val
    return set
  }, {})

  const store = withoutWhenPrompts.reduce(function(set, { name, default: _default }) {
    set[name] = _default
    return set
  }, {})

  function getErrorMsg(prompt, value) {
    if (prompt && typeof prompt.validate === 'function') {
      const msg = prompt.validate(value, store)
      if (typeof msg === 'string') {
        return msg
      }
    }
  }
  function getErrors() {
    const errors = {}
    prompts.forEach(function(prompt) {
      const msg = getErrorMsg(prompt, store[prompt.name])
      if (msg) {
        errors[prompt.name] = msg
      }
    })
    return Object.keys(errors).length ? errors : null
  }

  const server = app.listen(port, function() {
    emitter.emit('server-started')
  })
  app._server = server

  app.get('/', function(req, res) {
    res.type('html')
    res.send(
      compiled(
        Object.assign({}, tplData, {
          prompts: promptsForRender
        })
      )
    )
  })

  app.get('/when', function(req, res) {
    const passedList = []
    const failedList = []
    whenPrompts.forEach(function(item) {
      if (item.when(store)) {
        if (!store.hasOwnProperty(item.name)) {
          store[item.name] = item.default
        }
        passedList.push(item)
      } else {
        if (item.name in store) {
          delete store[item.name]
        }
        failedList.push(item)
      }
    })

    pass(res, 'when-passed', {
      passed: passedList.map(item => item.name),
      failed: failedList.map(item => item.name)
    })
  })

  app.get('/set', function(req, res) {
    const { name, value } = JSON.parse(req.query._)
    const prompt = prompts.find(x => x.name === name)
    if (prompt && typeof prompt.validate === 'function') {
      const msg = getErrorMsg(promptValues[name], value)
      if (msg) {
        store[name] = value
        pass(res, 'errors', { [name]: msg })
      } else {
        store[name] = value
        pass(res, 'validate-passed', name)
      }
      return
    }
    // console.log('set:before', store)
    store[name] = value
    // console.log('set:after', store)
    pass(res, 'passed', name)
  })

  // app.get('/transformer', function() {
  //   compiled(prompts)
  // })

  app.post('/submit', function(req, res) {
    // const { values } = req.query
    const errors = getErrors()
    if (errors) {
      pass(res, 'errors', errors)
    } else {
      pass(res, 'close', 'Submit succeed!')

      emitter.emit('done', store)
    }
    // store = values
  })
  return emitter
}

/* eslint-disable */
function adaptor(prompt) {
  prompt = { ...prompt }
  switch (prompt.type) {
    case 'confirm':
      prompt.type = 'checkbox'
      prompt.transformType = 'confirm'
      prompt.value = [prompt.value]
      prompt.options = [
        { label: 'Yes?', value: true }
      ]
      break
  }
  return prompt
}

// NOTE: don't supports transformer
const inquirer = co.wrap(function*(
  prompts,
  { yes, port, templatePath, tplData } = {}
) {
  prompts = prompts.map(adaptor)
  const withoutWhenPrompts = []
  const whenPrompts = []
  const promptsForRender = []
  prompts.forEach(function(x) {
    if (!x.when) {
      promptsForRender.push(x)
      withoutWhenPrompts.push(x)
    } else {
      promptsForRender.push(Object.assign({}, x, { _hasWhen: true }))
      whenPrompts.push(x)
    }
  })

  if (yes) {
    let set = withoutWhenPrompts.reduce(function(set, { name, default: _default }) {
      set[name] = _default
      return set
    }, {})
    return set
  }

  port = yield getPort(port)
  // Dulcet Inquirer
  const emitter = emitServer({
    port,
    prompts,
    withoutWhenPrompts,
    whenPrompts,
    promptsForRender,
    templatePath,
    tplData
  })
  return new Promise(function(resolve) {
    emitter.once('server-started', function() {
      opn(`http://localhost:${port}`)
      // .then(function() {
      //   reject(new Error('You had closed the window manually.'))
      // })
    })
    emitter.once('done', function(store) {
      // console.log('done', store)
      app._server && app._server.close()
      resolve(store)
    })
  })
})

module.exports = inquirer
