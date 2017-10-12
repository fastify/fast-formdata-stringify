# fast-formdata-stringify

This module aims to serialize your data into `application/x-www-form-urlencoded` encode.

## Install

```
npm i --save fast-formdata-stringify
```

*NB:* this project is not ready for a production usage. Some feature misses. (Please PR!)

<a name="example"></a>
## Example

```js
const dataFormStringify = require('fast-formdata-stringify')
const stringify = dataFormStringify({
  title: 'Example Schema',
  type: 'object',
  properties: {
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    age: {
      description: 'Age in years',
      type: 'integer'
    },
    reg: {
      type: 'string'
    }
  }
})

console.log(stringify({
  firstName: 'Tommaso',
  lastName: 'Allevi',
  age: 26,
  reg: /"([^"]|\\")*"/
}))
```

## Why ?

`json` is a very useful format: it is readable and a pretty fast format.
But the serialization is very slow. In **some circumstance** `application/x-www-form-urlencoded`
performs better.

See [benchmark](#benchmark)

<a name="benchmark"></a>
## Benchmark

The `benchmark.js` file can be run to show the benchmark result.

```
$ node benchmark.js

benchNativeQS*100000: 88.523ms
benchFormUrlEncoded*100000: 1543.472ms
benchJSONStringfy*100000: 94.682ms
benchFastJsonStringify*100000: 77.074ms
benchFastDataForm*100000: 51.088ms
benchNativeQS*100000: 85.406ms
benchFormUrlEncoded*100000: 1569.799ms
benchJSONStringfy*100000: 99.277ms
benchFastJsonStringify*100000: 38.176ms
benchFastDataForm*100000: 33.031ms
```

## TODO

Some features miss:
- implement all `type` supported by jsonschema
- implement indexed array elements (`key1[0]=value1`)

Please PR!

<a name="acknowledgements"></a>
## Acknowledgements

This project is highly inspired to [`fast-json-stringify`](https://github.com/fastify/fast-json-stringify)
