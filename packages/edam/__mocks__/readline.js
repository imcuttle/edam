/**
 * @file readline
 * @author Cuttle Cong
 * @date 2018/10/19
 *
 */

var EventEmitter = require('events').EventEmitter
var util = require('util')

var stub = {}

Object.assign(stub, {
  write: jest.fn(() => stub),
  moveCursor: jest.fn(() => stub),
  setPrompt: jest.fn(() => stub),
  close: jest.fn(() => stub),
  pause: jest.fn(() => stub),
  resume: jest.fn(() => stub),
  _getCursorPos: jest.fn(() => ({
    cols: 0,
    rows: 0
  })),
  output: {
    end: jest.fn(),
    mute: jest.fn(),
    unmute: jest.fn(),
    __raw__: '',
    write: function(str) {
      this.__raw__ += str
    }
  }
})

var ReadlineStub = function() {
  this.line = ''
  this.input = new EventEmitter()
  EventEmitter.apply(this, arguments)
}

util.inherits(ReadlineStub, EventEmitter)
Object.assign(ReadlineStub.prototype, stub)

module.exports = ReadlineStub
