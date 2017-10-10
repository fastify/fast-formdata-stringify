'use strict'

var t = require('tap')
const stringifyWrapper = require('./index')

t.test('object with string props', t => {
  var schema = {
    type: 'object',
    properties: {
      foo: { type: 'string' },
      bar: { type: 'string' }
    }
  }
  var stringify = stringifyWrapper(schema)

  var testes = [
    {
      input: {foo: 'value1', bar: 'value2'},
      output: 'foo=value1&bar=value2'
    },
    {
      input: {foo: new Date(0), bar: 'value2'},
      output: 'foo=1970-01-01T00:00:00.000Z&bar=value2'
    },
    {
      input: {foo: true, bar: 'value2'},
      output: 'foo=true&bar=value2'
    },
    {
      input: {foo: /^pippo$/, bar: 'value2'},
      output: 'foo=^pippo$&bar=value2'
    },
    {
      input: {foo: null, bar: 'value2'},
      output: 'foo=&bar=value2'
    }
  ]
  t.plan(testes.length)

  testes.forEach(test => {
    t.test(JSON.stringify(test.input), t => {
      t.plan(1)
      var encoded = stringify(test.input)
      t.equal(encoded, test.output)
    })
  })
})

t.test('object with string and int props', t => {
  var schema = {
    type: 'object',
    properties: {
      foo: { type: 'string' },
      bar: { type: 'integer' }
    }
  }
  var stringify = stringifyWrapper(schema)

  var testes = [
    {
      input: {foo: 'value1', bar: '33'},
      output: 'foo=value1&bar=33'
    },
    {
      input: {foo: 'value1', bar: 33},
      output: 'foo=value1&bar=33'
    },
    {
      input: {foo: 'value1', bar: null},
      output: 'foo=value1&bar='
    },
    {
      input: {foo: 'value1'},
      output: 'foo=value1'
    }
  ]
  t.plan(testes.length)

  testes.forEach(test => {
    t.test(JSON.stringify(test.input), t => {
      t.plan(1)
      var encoded = stringify(test.input)
      t.equal(encoded, test.output)
    })
  })
})

t.test('object with boolean props', t => {
  var schema = {
    type: 'object',
    properties: {
      foo: { type: 'boolean' }
    }
  }
  var stringify = stringifyWrapper(schema)

  var testes = [
    {
      input: { foo: true },
      output: 'foo=true'
    },
    {
      input: { foo: false },
      output: 'foo=false'
    },
    {
      input: { foo: 'non-boolean-is-treat-as-true' },
      output: 'foo=true'
    },
    {
      input: { foo: '' },
      output: 'foo=false'
    },
    {
      input: { foo: null },
      output: 'foo=false'
    },
    {
      input: { },
      output: ''
    }
  ]
  t.plan(testes.length)

  testes.forEach(test => {
    t.test(JSON.stringify(test.input), t => {
      t.plan(1)
      var encoded = stringify(test.input)
      t.equal(encoded, test.output)
    })
  })
})

t.test('object with null props', t => {
  var schema = {
    type: 'object',
    properties: {
      foo: { type: 'null' }
    }
  }
  var stringify = stringifyWrapper(schema)

  var testes = [
    {
      input: { foo: true },
      output: 'foo='
    },
    {
      input: { foo: false },
      output: 'foo='
    },
    {
      input: { foo: 'value1' },
      output: 'foo='
    },
    {
      input: { foo: '' },
      output: 'foo='
    },
    {
      input: { foo: null },
      output: 'foo='
    },
    {
      input: { },
      output: ''
    }
  ]
  t.plan(testes.length)

  testes.forEach(test => {
    t.test(JSON.stringify(test.input), t => {
      t.plan(1)
      var encoded = stringify(test.input)
      t.equal(encoded, test.output)
    })
  })
})

t.test('object with object props', t => {
  var schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'object',
        properties: {
          key1: { type: 'string' },
          key2: { type: 'integer' },
          key3: { type: 'boolean' }
        }
      }
    }
  }
  var stringify = stringifyWrapper(schema)

  var testes = [
    {
      input: { foo: { key1: 'qq', key2: '44', key3: true } },
      output: 'foo[key1]=qq&foo[key2]=44&foo[key3]=true'
    },
    {
      input: { foo: { key1: 'qq', key2: 44, key3: true } },
      output: 'foo[key1]=qq&foo[key2]=44&foo[key3]=true'
    },
    {
      input: { foo: { key1: 'qq', key2: '44', key3: false } },
      output: 'foo[key1]=qq&foo[key2]=44&foo[key3]=false'
    },
    {
      input: { foo: { key1: 'qq', key2: '44' } },
      output: 'foo[key1]=qq&foo[key2]=44'
    },
    {
      input: { foo: { key1: 'qq', key3: true } },
      output: 'foo[key1]=qq&foo[key3]=true'
    },
    {
      input: { foo: { key2: '44', key3: true } },
      output: 'foo[key2]=44&foo[key3]=true'
    },
    {
      input: { foo: { key1: 'qq' } },
      output: 'foo[key1]=qq'
    },
    {
      input: { foo: { key2: 44 } },
      output: 'foo[key2]=44'
    },
    {
      input: { foo: { key3: true } },
      output: 'foo[key3]=true'
    },
    {
      input: { foo: { } },
      output: ''
    }
  ]
  t.plan(testes.length)

  testes.forEach(test => {
    t.test(JSON.stringify(test.input), t => {
      t.plan(1)
      var encoded = stringify(test.input)
      t.equal(encoded, test.output)
    })
  })
})

t.test('array of string', t => {
  var schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'array',
        items: { type: 'string' }
      }
    }
  }
  var stringify = stringifyWrapper(schema)

  var testes = [
    {
      input: { foo: ['q', 'w', 'e', 'r', 't', 'y'] },
      output: 'foo[]=q&foo[]=w&foo[]=e&foo[]=r&foo[]=t&foo[]=y'
    },
    {
      input: { foo: ['q'] },
      output: 'foo[]=q'
    },
    {
      input: { foo: [] },
      output: ''
    },
    {
      input: { foo: [null] },
      output: 'foo[]='
    },
    {
      input: { foo: [55] },
      output: 'foo[]=55'
    },
    {
      input: { foo: [55, null, 'iiiii', new Date(0)] },
      output: 'foo[]=55&foo[]=&foo[]=iiiii&foo[]=1970-01-01T00:00:00.000Z'
    }
  ]
  t.plan(testes.length)

  testes.forEach(test => {
    t.test(JSON.stringify(test.input), t => {
      t.plan(1)
      var encoded = stringify(test.input)
      t.equal(encoded, test.output)
    })
  })
})

t.test('fail build serializator', t => {
  var testes = [
    {
      schema: { type: 'foobar' }
    },
    {
      schema: { type: 'object', properties: { key1: { type: 'foobar' } } }
    },
    {
      schema: { type: 'array', items: { type: 'foobar' } }
    }
  ]
  t.plan(testes.length)

  testes.forEach(test => {
    t.test(JSON.stringify(test.schema), t => {
      t.plan(1)
      try {
        stringifyWrapper(test.schema)
        t.fail()
      } catch (e) {
        t.ok(/^Unable /.test(e.message), e.message)
      }
    })
  })
})
