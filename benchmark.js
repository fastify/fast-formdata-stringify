'use strict'

var qs = require('querystring').stringify
var formurlencoded = require('form-urlencoded')
var fastJson = require('fast-json-stringify')
var dataFormStringify = require('./')
var jsonDescriptor = require('./Awesome.json')
var protobuf = require('protobufjs/light')

var schema = {
  type: 'object',
  properties: {
    foo: { type: 'string' },
    bar: { type: 'string' }
  }
}
var stringify = dataFormStringify(schema)
var jsonStringify = fastJson(schema)

var root = protobuf.Root.fromJSON(jsonDescriptor)
var AwesomeMessage = root.lookupType('AwesomeMessage')

var obj = {
  foo: 'pippo',
  bar: 'pluto'
}

var bench = require('fastbench')

var run = bench([
  function benchNativeQS (done) {
    qs(obj)
    process.nextTick(done)
  },
  function benchFormUrlEncoded (done) {
    formurlencoded(obj)
    process.nextTick(done)
  },
  function benchJSONStringfy (done) {
    JSON.stringify(obj)
    process.nextTick(done)
  },
  function benchFastJsonStringify (done) {
    jsonStringify(obj)
    process.nextTick(done)
  },
  function benchFastDataForm (done) {
    stringify(obj)
    process.nextTick(done)
  },
  function benchProtobuf (done) {
    var message = AwesomeMessage.create(obj)
    AwesomeMessage.encode(message).finish()
    process.nextTick(done)
  }
], 100000)

// run them two times
run(run)
