'use strict'

module.exports = stringify

function ObjectPath (chain) {
  this.chain = chain || []
}
ObjectPath.prototype.addToChain = function (p) {
  this.chain.push(p)
  return this
}
ObjectPath.prototype.clone = function (p) {
  return new ObjectPath(this.chain.concat([]))
}
ObjectPath.prototype.getKey = function () {
  var key = this.chain[0]
  for (var i = 1; i < this.chain.length; i++) {
    key += `[${this.chain[i]}]`
  }
  return $escape(key)
}

function stringify (schema) {
  var code = []
  code.push(`'use strict'`)
  code.push(`var AMP = '&'`)

  var laterCode = []

  const type = schema.type

  var path = new ObjectPath()

  switch (type) {
    case 'object':
      buildObject(code, laterCode, schema, schema, path, '$main')
      break
    default:
      throw new Error('Unable to build the serializer for type: ' + type)
  }

  for (var i = 0; i < laterCode.length; i++) {
    code.push(laterCode[i])
  }

  code.push($asString.toString())
  code.push($asNumber.toString())
  code.push($asBoolean.toString())
  code.push($asNull.toString())
  code.push($escape.toString())

  code.push('return $main')

  return (new Function(code.join('\n')))() // eslint-disable-line
}

function buildObject (code, laterCode, externalSchema, objectSchema, path, thisFunctionName) {
  code.push(`function ${thisFunctionName}(obj) {`)
  code.push('var encoded = \'\'')
  code.push('var addAmp = false')

  Object.keys(objectSchema.properties).forEach(function (keyName) {
    var keyPath = path.clone()
      .addToChain(keyName)
    var encodedKey = keyPath.getKey()

    var propertyType = objectSchema.properties[keyName].type

    code.push(`if (obj.${keyName} !== undefined) {`)

    addAmp(code)

    neasted(code, laterCode, propertyType, encodedKey, externalSchema, objectSchema.properties[keyName], keyPath, `obj.${keyName}`)

    if (objectSchema.required && objectSchema.required.indexOf(keyName) > -1) {
      code.push('} else {')
      code.push(`throw new Error('${keyName} is required!')`)
    }

    code.push('}')
  })

  laterCode.push('return encoded')
  laterCode.push('}')
}

function buildArray (code, laterCode, externalSchema, objectSchema, path, thisFunctionName) {
  code.push(`function ${thisFunctionName}(obj) {`)
  code.push('var encoded = \'\'')

  var propertyType = objectSchema.items.type

  var keyPath = path.clone()
    .addToChain('')
  var encodedKey = keyPath.getKey()

  code.push(`var l = obj.length`)
  code.push(`var w = l - 1`)
  code.push(`for (var i = 0; i < l; i++) {`)
  code.push(`if (i > 0) {`)
  code.push(`encoded += AMP`)
  code.push(`}`)

  neasted(code, laterCode, propertyType, encodedKey, externalSchema, objectSchema.items, keyPath, 'obj[i]')

  code.push(`}`)

  code.push('return encoded')
  code.push('}')
}

function neasted (code, laterCode, propertyType, encodedKey, externalSchema, childSchema, keyPath, value) {
  var functionName
  var laterLaterCode = []
  switch (propertyType) {
    case 'string':
      code.push(`encoded += '${encodedKey}='`)
      code.push(`encoded += $asString(${value})`)
      break
    case 'integer':
      code.push(`encoded += '${encodedKey}='`)
      code.push(`encoded += $asNumber(${value})`)
      break
    case 'boolean':
      code.push(`encoded += '${encodedKey}='`)
      code.push(`encoded += $asBoolean(${value})`)
      break
    case 'null':
      code.push(`encoded += '${encodedKey}='`)
      code.push(`encoded += $asNull()`)
      break
    case 'object':
      functionName = '$' + encodedKey.replace(/\[\]-/g, '')
      code.push(`encoded += ${functionName}(${value})`)
      buildObject(laterCode, laterLaterCode, externalSchema, childSchema, keyPath, functionName)
      break
    case 'array':
      functionName = '$' + encodedKey.replace(/\[\]-/g, '') + '$'
      code.push(`encoded += ${functionName}(${value})`)
      buildArray(laterCode, laterLaterCode, externalSchema, childSchema, keyPath, functionName)
      break
    default:
      throw new Error('Unable to build the serializer for type: ' + propertyType + '. Found at path: ' + JSON.stringify(keyPath))
  }

  for (var i = 0; i < laterLaterCode.length; i++) {
    laterCode.push(laterLaterCode[i])
  }
}

function $escape (str) {
  var result = ''
  var last = 0
  var l = str.length
  var point = 255
  for (var i = 0; i < l && point >= 32; i++) {
    point = str.charCodeAt(i)
    if (point === 34 || point === 92) {
      result += str.slice(last, i) + '\\'
      last = i
    }
  }
  if (last === 0) {
    result = str
  } else {
    result += str.slice(last)
  }
  return point < 32 ? JSON.stringify(str) : result
}

function $asString (str) {
  if (str instanceof Date) return str.toISOString()
  if (str === null) return ''
  if (str instanceof RegExp) str = str.source
  if (typeof str !== 'string') str = str.toString()
  return str.length < 128 ? $escape(str) : str.replace(/ /g, '')
}

function $asNumber (i) {
  if (i === null) return ''
  var num = Number(i)
  return isNaN(num) ? '' : ('' + num)
}

function $asBoolean (bool) {
  return !bool ? 'false' : 'true'
}

function $asNull () {
  return ''
}

function addAmp (code) {
  code.push('if (addAmp) encoded += AMP')
  code.push('addAmp = true')
}
