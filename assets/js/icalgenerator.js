(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],3:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],4:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":2,"buffer":4,"ieee754":5}],5:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],6:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICalAlarmType = void 0;
const tools_1 = require("./tools");
var ICalAlarmType;
(function (ICalAlarmType) {
    ICalAlarmType["display"] = "display";
    ICalAlarmType["audio"] = "audio";
})(ICalAlarmType = exports.ICalAlarmType || (exports.ICalAlarmType = {}));
/**
 * Usually you get an `ICalAlarm` object like this:
 *
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * const event = calendar.createEvent();
 * const alarm = event.createAlarm();
 * ```
 *
 * You can also use the [[`ICalAlarm`]] object directly:
 *
 * ```javascript
 * import ical, {ICalAlarm} from 'ical-generator';
 * const alarm = new ICalAlarm();
 * event.alarms([alarm]);
 * ```
 */
class ICalAlarm {
    /**
     * Constructor of [[`ICalAttendee`]]. The event reference is required
     * to query the calendar's timezone and summary when required.
     *
     * @param data Alarm Data
     * @param calendar Reference to ICalEvent object
     */
    constructor(data, event) {
        this.data = {
            type: null,
            trigger: null,
            repeat: null,
            interval: null,
            attach: null,
            description: null,
            x: []
        };
        this.event = event;
        if (!event) {
            throw new Error('`event` option required!');
        }
        data.type !== undefined && this.type(data.type);
        data.trigger !== undefined && this.trigger(data.trigger);
        data.triggerBefore !== undefined && this.triggerBefore(data.triggerBefore);
        data.triggerAfter !== undefined && this.triggerAfter(data.triggerAfter);
        data.repeat !== undefined && this.repeat(data.repeat);
        data.interval !== undefined && this.interval(data.interval);
        data.attach !== undefined && this.attach(data.attach);
        data.description !== undefined && this.description(data.description);
        data.x !== undefined && this.x(data.x);
    }
    type(type) {
        if (type === undefined) {
            return this.data.type;
        }
        if (!type) {
            this.data.type = null;
            return this;
        }
        if (!Object.keys(ICalAlarmType).includes(type)) {
            throw new Error('`type` is not correct, must be either `display` or `audio`!');
        }
        this.data.type = type;
        return this;
    }
    trigger(trigger) {
        // Getter
        if (trigger === undefined && typeof this.data.trigger === 'number') {
            return -1 * this.data.trigger;
        }
        if (trigger === undefined && this.data.trigger) {
            return this.data.trigger;
        }
        if (trigger === undefined) {
            return null;
        }
        // Setter
        if (!trigger) {
            this.data.trigger = null;
        }
        else if (typeof trigger === 'number' && isFinite(trigger)) {
            this.data.trigger = -1 * trigger;
        }
        else if (typeof trigger === 'number') {
            throw new Error('`trigger` is not correct, must be a finite number or a supported date!');
        }
        else {
            this.data.trigger = (0, tools_1.checkDate)(trigger, 'trigger');
        }
        return this;
    }
    triggerAfter(trigger) {
        if (trigger === undefined) {
            return this.data.trigger;
        }
        return this.trigger(typeof trigger === 'number' ? -1 * trigger : trigger);
    }
    triggerBefore(trigger) {
        if (trigger === undefined) {
            return this.trigger();
        }
        return this.trigger(trigger);
    }
    repeat(repeat) {
        if (repeat === undefined) {
            return this.data.repeat;
        }
        if (!repeat) {
            this.data.repeat = null;
            return this;
        }
        if (typeof repeat !== 'number' || !isFinite(repeat)) {
            throw new Error('`repeat` is not correct, must be numeric!');
        }
        this.data.repeat = repeat;
        return this;
    }
    interval(interval) {
        if (interval === undefined) {
            return this.data.interval || null;
        }
        if (!interval) {
            this.data.interval = null;
            return this;
        }
        if (typeof interval !== 'number' || !isFinite(interval)) {
            throw new Error('`interval` is not correct, must be numeric!');
        }
        this.data.interval = interval;
        return this;
    }
    attach(attachment) {
        if (attachment === undefined) {
            return this.data.attach;
        }
        if (!attachment) {
            this.data.attach = null;
            return this;
        }
        let _attach = null;
        if (typeof attachment === 'string') {
            _attach = {
                uri: attachment,
                mime: null
            };
        }
        else if (typeof attachment === 'object') {
            _attach = {
                uri: attachment.uri,
                mime: attachment.mime || null
            };
        }
        else {
            throw new Error('`attachment` needs to be a valid formed string or an object. See https://sebbo2002.github.io/' +
                'ical-generator/develop/reference/classes/icalalarm.html#attach');
        }
        if (!_attach.uri) {
            throw new Error('`attach.uri` is empty!');
        }
        this.data.attach = {
            uri: _attach.uri,
            mime: _attach.mime
        };
        return this;
    }
    description(description) {
        if (description === undefined) {
            return this.data.description;
        }
        if (!description) {
            this.data.description = null;
            return this;
        }
        this.data.description = description;
        return this;
    }
    x(keyOrArray, value) {
        if (keyOrArray === undefined) {
            return (0, tools_1.addOrGetCustomAttributes)(this.data);
        }
        if (typeof keyOrArray === 'string' && typeof value === 'string') {
            (0, tools_1.addOrGetCustomAttributes)(this.data, keyOrArray, value);
        }
        else if (typeof keyOrArray === 'object') {
            (0, tools_1.addOrGetCustomAttributes)(this.data, keyOrArray);
        }
        else {
            throw new Error('Either key or value is not a string!');
        }
        return this;
    }
    /**
     * Return a shallow copy of the alarm's options for JSON stringification.
     * Third party objects like moment.js values are stringified as well. Can
     * be used for persistence.
     *
     * @since 0.2.4
     */
    toJSON() {
        const trigger = this.trigger();
        return Object.assign({}, this.data, {
            trigger: typeof trigger === 'number' ? trigger : (0, tools_1.toJSON)(trigger),
            x: this.x()
        });
    }
    /**
     * Return generated event as a string.
     *
     * ```javascript
     * const alarm = event.createAlarm();
     * console.log(alarm.toString()); // → BEGIN:VALARM…
     * ```
     */
    toString() {
        let g = 'BEGIN:VALARM\r\n';
        if (!this.data.type) {
            throw new Error('No value for `type` in ICalAlarm given!');
        }
        if (!this.data.trigger) {
            throw new Error('No value for `trigger` in ICalAlarm given!');
        }
        // ACTION
        g += 'ACTION:' + this.data.type.toUpperCase() + '\r\n';
        if (typeof this.data.trigger === 'number' && this.data.trigger > 0) {
            g += 'TRIGGER;RELATED=END:' + (0, tools_1.toDurationString)(this.data.trigger) + '\r\n';
        }
        else if (typeof this.data.trigger === 'number') {
            g += 'TRIGGER:' + (0, tools_1.toDurationString)(this.data.trigger) + '\r\n';
        }
        else {
            g += 'TRIGGER;VALUE=DATE-TIME:' + (0, tools_1.formatDate)(this.event.timezone(), this.data.trigger) + '\r\n';
        }
        // REPEAT
        if (this.data.repeat && !this.data.interval) {
            throw new Error('No value for `interval` in ICalAlarm given, but required for `repeat`!');
        }
        if (this.data.repeat) {
            g += 'REPEAT:' + this.data.repeat + '\r\n';
        }
        // INTERVAL
        if (this.data.interval && !this.data.repeat) {
            throw new Error('No value for `repeat` in ICalAlarm given, but required for `interval`!');
        }
        if (this.data.interval) {
            g += 'DURATION:' + (0, tools_1.toDurationString)(this.data.interval) + '\r\n';
        }
        // ATTACH
        if (this.data.type === 'audio' && this.data.attach && this.data.attach.mime) {
            g += 'ATTACH;FMTTYPE=' + this.data.attach.mime + ':' + this.data.attach.uri + '\r\n';
        }
        else if (this.data.type === 'audio' && this.data.attach) {
            g += 'ATTACH;VALUE=URI:' + this.data.attach.uri + '\r\n';
        }
        else if (this.data.type === 'audio') {
            g += 'ATTACH;VALUE=URI:Basso\r\n';
        }
        // DESCRIPTION
        if (this.data.type === 'display' && this.data.description) {
            g += 'DESCRIPTION:' + (0, tools_1.escape)(this.data.description) + '\r\n';
        }
        else if (this.data.type === 'display') {
            g += 'DESCRIPTION:' + (0, tools_1.escape)(this.event.summary()) + '\r\n';
        }
        // CUSTOM X ATTRIBUTES
        g += (0, tools_1.generateCustomAttributes)(this.data);
        g += 'END:VALARM\r\n';
        return g;
    }
}
exports.default = ICalAlarm;

},{"./tools":12}],7:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICalAttendeeType = exports.ICalAttendeeStatus = exports.ICalAttendeeRole = void 0;
const tools_1 = require("./tools");
var ICalAttendeeRole;
(function (ICalAttendeeRole) {
    ICalAttendeeRole["CHAIR"] = "CHAIR";
    ICalAttendeeRole["REQ"] = "REQ-PARTICIPANT";
    ICalAttendeeRole["OPT"] = "OPT-PARTICIPANT";
    ICalAttendeeRole["NON"] = "NON-PARTICIPANT";
})(ICalAttendeeRole = exports.ICalAttendeeRole || (exports.ICalAttendeeRole = {}));
var ICalAttendeeStatus;
(function (ICalAttendeeStatus) {
    ICalAttendeeStatus["ACCEPTED"] = "ACCEPTED";
    ICalAttendeeStatus["TENTATIVE"] = "TENTATIVE";
    ICalAttendeeStatus["DECLINED"] = "DECLINED";
    ICalAttendeeStatus["DELEGATED"] = "DELEGATED";
    ICalAttendeeStatus["NEEDSACTION"] = "NEEDS-ACTION";
})(ICalAttendeeStatus = exports.ICalAttendeeStatus || (exports.ICalAttendeeStatus = {}));
// ref: https://tools.ietf.org/html/rfc2445#section-4.2.3
var ICalAttendeeType;
(function (ICalAttendeeType) {
    ICalAttendeeType["INDIVIDUAL"] = "INDIVIDUAL";
    ICalAttendeeType["GROUP"] = "GROUP";
    ICalAttendeeType["RESOURCE"] = "RESOURCE";
    ICalAttendeeType["ROOM"] = "ROOM";
    ICalAttendeeType["UNKNOWN"] = "UNKNOWN";
})(ICalAttendeeType = exports.ICalAttendeeType || (exports.ICalAttendeeType = {}));
/**
 * Usually you get an `ICalAttendee` object like this:
 *
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * const event = calendar.createEvent();
 * const attendee = event.createAttendee();
 * ```
 *
 * You can also use the [[`ICalAttendee`]] object directly:
 *
 * ```javascript
 * import ical, {ICalAttendee} from 'ical-generator';
 * const attendee = new ICalAttendee();
 * event.attendees([attendee]);
 * ```
 */
class ICalAttendee {
    /**
     * Constructor of [[`ICalAttendee`]]. The event reference is
     * required to query the calendar's timezone when required.
     *
     * @param data Attendee Data
     * @param calendar Reference to ICalEvent object
     */
    constructor(data, event) {
        this.data = {
            name: null,
            email: null,
            mailto: null,
            status: null,
            role: ICalAttendeeRole.REQ,
            rsvp: null,
            type: null,
            delegatedTo: null,
            delegatedFrom: null,
            x: []
        };
        this.event = event;
        if (!this.event) {
            throw new Error('`event` option required!');
        }
        data.name !== undefined && this.name(data.name);
        data.email !== undefined && this.email(data.email);
        data.mailto !== undefined && this.mailto(data.mailto);
        data.status !== undefined && this.status(data.status);
        data.role !== undefined && this.role(data.role);
        data.rsvp !== undefined && this.rsvp(data.rsvp);
        data.type !== undefined && this.type(data.type);
        data.delegatedTo !== undefined && this.delegatedTo(data.delegatedTo);
        data.delegatedFrom !== undefined && this.delegatedFrom(data.delegatedFrom);
        data.delegatesTo && this.delegatesTo(data.delegatesTo);
        data.delegatesFrom && this.delegatesFrom(data.delegatesFrom);
        data.x !== undefined && this.x(data.x);
    }
    name(name) {
        if (name === undefined) {
            return this.data.name;
        }
        this.data.name = name || null;
        return this;
    }
    email(email) {
        if (!email) {
            return this.data.email;
        }
        this.data.email = email;
        return this;
    }
    mailto(mailto) {
        if (mailto === undefined) {
            return this.data.mailto;
        }
        this.data.mailto = mailto || null;
        return this;
    }
    role(role) {
        if (role === undefined) {
            return this.data.role;
        }
        this.data.role = (0, tools_1.checkEnum)(ICalAttendeeRole, role);
        return this;
    }
    rsvp(rsvp) {
        if (rsvp === undefined) {
            return this.data.rsvp;
        }
        if (rsvp === null) {
            this.data.rsvp = null;
            return this;
        }
        this.data.rsvp = Boolean(rsvp);
        return this;
    }
    status(status) {
        if (status === undefined) {
            return this.data.status;
        }
        if (!status) {
            this.data.status = null;
            return this;
        }
        this.data.status = (0, tools_1.checkEnum)(ICalAttendeeStatus, status);
        return this;
    }
    type(type) {
        if (type === undefined) {
            return this.data.type;
        }
        if (!type) {
            this.data.type = null;
            return this;
        }
        this.data.type = (0, tools_1.checkEnum)(ICalAttendeeType, type);
        return this;
    }
    delegatedTo(delegatedTo) {
        if (delegatedTo === undefined) {
            return this.data.delegatedTo;
        }
        if (!delegatedTo) {
            this.data.delegatedTo = null;
            if (this.data.status === ICalAttendeeStatus.DELEGATED) {
                this.data.status = null;
            }
            return this;
        }
        if (typeof delegatedTo === 'string') {
            this.data.delegatedTo = new ICalAttendee((0, tools_1.checkNameAndMail)('delegatedTo', delegatedTo), this.event);
        }
        else if (delegatedTo instanceof ICalAttendee) {
            this.data.delegatedTo = delegatedTo;
        }
        else {
            this.data.delegatedTo = new ICalAttendee(delegatedTo, this.event);
        }
        this.data.status = ICalAttendeeStatus.DELEGATED;
        return this;
    }
    delegatedFrom(delegatedFrom) {
        if (delegatedFrom === undefined) {
            return this.data.delegatedFrom;
        }
        if (!delegatedFrom) {
            this.data.delegatedFrom = null;
        }
        else if (typeof delegatedFrom === 'string') {
            this.data.delegatedFrom = new ICalAttendee((0, tools_1.checkNameAndMail)('delegatedFrom', delegatedFrom), this.event);
        }
        else if (delegatedFrom instanceof ICalAttendee) {
            this.data.delegatedFrom = delegatedFrom;
        }
        else {
            this.data.delegatedFrom = new ICalAttendee(delegatedFrom, this.event);
        }
        return this;
    }
    /**
     * Create a new attendee this attendee delegates to and returns
     * this new attendee. Creates a new attendee if the passed object
     * is not already an [[`ICalAttendee`]].
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const attendee = cal.createAttendee();
     *
     * attendee.delegatesTo({email: 'foo@bar.com', name: 'Foo'});
     * ```
     *
     * @since 0.2.0
     */
    delegatesTo(options) {
        const a = options instanceof ICalAttendee ? options : this.event.createAttendee(options);
        this.delegatedTo(a);
        a.delegatedFrom(this);
        return a;
    }
    /**
     * Create a new attendee this attendee delegates from and returns
     * this new attendee. Creates a new attendee if the passed object
     * is not already an [[`ICalAttendee`]].
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const attendee = cal.createAttendee();
     *
     * attendee.delegatesFrom({email: 'foo@bar.com', name: 'Foo'});
     * ```
     *
     * @since 0.2.0
     */
    delegatesFrom(options) {
        const a = options instanceof ICalAttendee ? options : this.event.createAttendee(options);
        this.delegatedFrom(a);
        a.delegatedTo(this);
        return a;
    }
    x(keyOrArray, value) {
        if (keyOrArray === undefined) {
            return (0, tools_1.addOrGetCustomAttributes)(this.data);
        }
        if (typeof keyOrArray === 'string' && typeof value === 'string') {
            (0, tools_1.addOrGetCustomAttributes)(this.data, keyOrArray, value);
        }
        else if (typeof keyOrArray === 'object') {
            (0, tools_1.addOrGetCustomAttributes)(this.data, keyOrArray);
        }
        else {
            throw new Error('Either key or value is not a string!');
        }
        return this;
    }
    /**
     * Return a shallow copy of the attendee's options for JSON stringification.
     * Can be used for persistence.
     *
     * @since 0.2.4
     */
    toJSON() {
        var _a, _b;
        return Object.assign({}, this.data, {
            delegatedTo: ((_a = this.data.delegatedTo) === null || _a === void 0 ? void 0 : _a.email()) || null,
            delegatedFrom: ((_b = this.data.delegatedFrom) === null || _b === void 0 ? void 0 : _b.email()) || null,
            x: this.x()
        });
    }
    /**
     * Return generated attendee as a string.
     *
     * ```javascript
     * console.log(attendee.toString()); // → ATTENDEE;ROLE=…
     * ```
     */
    toString() {
        let g = 'ATTENDEE';
        if (!this.data.email) {
            throw new Error('No value for `email` in ICalAttendee given!');
        }
        // ROLE
        g += ';ROLE=' + this.data.role;
        // TYPE
        if (this.data.type) {
            g += ';CUTYPE=' + this.data.type;
        }
        // PARTSTAT
        if (this.data.status) {
            g += ';PARTSTAT=' + this.data.status;
        }
        // RSVP
        if (this.data.rsvp) {
            g += ';RSVP=' + this.data.rsvp.toString().toUpperCase();
        }
        // DELEGATED-TO
        if (this.data.delegatedTo) {
            g += ';DELEGATED-TO="' + this.data.delegatedTo.email() + '"';
        }
        // DELEGATED-FROM
        if (this.data.delegatedFrom) {
            g += ';DELEGATED-FROM="' + this.data.delegatedFrom.email() + '"';
        }
        // CN / Name
        if (this.data.name) {
            g += ';CN="' + (0, tools_1.escape)(this.data.name) + '"';
        }
        // EMAIL
        if (this.data.email && this.data.mailto) {
            g += ';EMAIL=' + (0, tools_1.escape)(this.data.email);
        }
        // CUSTOM X ATTRIBUTES
        if (this.data.x.length) {
            g += ';' + this.data.x
                .map(([key, value]) => key.toUpperCase() + '=' + (0, tools_1.escape)(value))
                .join(';');
        }
        g += ':MAILTO:' + (0, tools_1.escape)(this.data.mailto || this.data.email) + '\r\n';
        return g;
    }
}
exports.default = ICalAttendee;

},{"./tools":12}],8:[function(require,module,exports){
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICalCalendarMethod = void 0;
const tools_1 = require("./tools");
const event_1 = __importDefault(require("./event"));
const fs_1 = require("fs");
const fs_2 = require("fs");
var ICalCalendarMethod;
(function (ICalCalendarMethod) {
    ICalCalendarMethod["PUBLISH"] = "PUBLISH";
    ICalCalendarMethod["REQUEST"] = "REQUEST";
    ICalCalendarMethod["REPLY"] = "REPLY";
    ICalCalendarMethod["ADD"] = "ADD";
    ICalCalendarMethod["CANCEL"] = "CANCEL";
    ICalCalendarMethod["REFRESH"] = "REFRESH";
    ICalCalendarMethod["COUNTER"] = "COUNTER";
    ICalCalendarMethod["DECLINECOUNTER"] = "DECLINECOUNTER";
})(ICalCalendarMethod = exports.ICalCalendarMethod || (exports.ICalCalendarMethod = {}));
/**
 * Usually you get an `ICalCalendar` object like this:
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * ```
 *
 * But you can also use the constructor directly like this:
 * ```javascript
 * import {ICalCalendar} from 'ical-generator';
 * const calendar = new ICalCalendar();
 * ```
 */
class ICalCalendar {
    /**
     * You can pass options to setup your calendar or use setters to do this.
     *
     * ```javascript
     *  * import ical from 'ical-generator';
     *
     * // or use require:
     * // const ical = require('ical-generator');
     *
     *
     * const cal = ical({name: 'my first iCal'});
     *
     * // is the same as
     *
     * const cal = ical().name('my first iCal');
     *
     * // is the same as
     *
     * const cal = ical();
     * cal.name('sebbo.net');
     * ```
     *
     * @param data Calendar data
     */
    constructor(data = {}) {
        this.data = {
            prodId: '//sebbo.net//ical-generator//EN',
            method: null,
            name: null,
            description: null,
            timezone: null,
            source: null,
            url: null,
            scale: null,
            ttl: null,
            events: [],
            x: []
        };
        data.prodId !== undefined && this.prodId(data.prodId);
        data.method !== undefined && this.method(data.method);
        data.name !== undefined && this.name(data.name);
        data.description !== undefined && this.description(data.description);
        data.timezone !== undefined && this.timezone(data.timezone);
        data.source !== undefined && this.source(data.source);
        data.url !== undefined && this.url(data.url);
        data.scale !== undefined && this.scale(data.scale);
        data.ttl !== undefined && this.ttl(data.ttl);
        data.events !== undefined && this.events(data.events);
        data.x !== undefined && this.x(data.x);
    }
    prodId(prodId) {
        if (!prodId) {
            return this.data.prodId;
        }
        const prodIdRegEx = /^\/\/(.+)\/\/(.+)\/\/([A-Z]{1,4})$/;
        if (typeof prodId === 'string' && prodIdRegEx.test(prodId)) {
            this.data.prodId = prodId;
            return this;
        }
        if (typeof prodId === 'string') {
            throw new Error('`prodId` isn\'t formated correctly. See https://sebbo2002.github.io/ical-generator/develop/reference/' +
                'classes/icalcalendar.html#prodid');
        }
        if (typeof prodId !== 'object') {
            throw new Error('`prodid` needs to be a valid formed string or an object!');
        }
        if (!prodId.company) {
            throw new Error('`prodid.company` is a mandatory item!');
        }
        if (!prodId.product) {
            throw new Error('`prodid.product` is a mandatory item!');
        }
        const language = (prodId.language || 'EN').toUpperCase();
        this.data.prodId = '//' + prodId.company + '//' + prodId.product + '//' + language;
        return this;
    }
    method(method) {
        if (method === undefined) {
            return this.data.method;
        }
        if (!method) {
            this.data.method = null;
            return this;
        }
        this.data.method = (0, tools_1.checkEnum)(ICalCalendarMethod, method);
        return this;
    }
    name(name) {
        if (name === undefined) {
            return this.data.name;
        }
        this.data.name = name ? String(name) : null;
        return this;
    }
    description(description) {
        if (description === undefined) {
            return this.data.description;
        }
        this.data.description = description ? String(description) : null;
        return this;
    }
    timezone(timezone) {
        var _a;
        if (timezone === undefined) {
            return ((_a = this.data.timezone) === null || _a === void 0 ? void 0 : _a.name) || null;
        }
        if (typeof timezone === 'string') {
            this.data.timezone = { name: timezone };
        }
        else if (timezone === null) {
            this.data.timezone = null;
        }
        else {
            this.data.timezone = timezone;
        }
        return this;
    }
    source(source) {
        if (source === undefined) {
            return this.data.source;
        }
        this.data.source = source || null;
        return this;
    }
    url(url) {
        if (url === undefined) {
            return this.data.url;
        }
        this.data.url = url || null;
        return this;
    }
    scale(scale) {
        if (scale === undefined) {
            return this.data.scale;
        }
        if (scale === null) {
            this.data.scale = null;
        }
        else {
            this.data.scale = scale.toUpperCase();
        }
        return this;
    }
    ttl(ttl) {
        if (ttl === undefined) {
            return this.data.ttl;
        }
        if ((0, tools_1.isMomentDuration)(ttl)) {
            this.data.ttl = ttl.asSeconds();
        }
        else if (ttl && ttl > 0) {
            this.data.ttl = ttl;
        }
        else {
            this.data.ttl = null;
        }
        return this;
    }
    /**
     * Creates a new [[`ICalEvent`]] and returns it. Use options to prefill the event's attributes.
     * Calling this method without options will create an empty event.
     *
     * ```javascript
     * import ical from 'ical-generator';
     *
     * // or use require:
     * // const ical = require('ical-generator');
     *
     * const cal = ical();
     * const event = cal.createEvent({summary: 'My Event'});
     *
     * // overwrite event summary
     * event.summary('Your Event');
     * ```
     *
     * @since 0.2.0
     */
    createEvent(data) {
        const event = data instanceof event_1.default ? data : new event_1.default(data, this);
        this.data.events.push(event);
        return event;
    }
    events(events) {
        if (!events) {
            return this.data.events;
        }
        events.forEach((e) => this.createEvent(e));
        return this;
    }
    /**
     * Remove all events from the calendar without
     * touching any other data like name or prodId.
     *
     * @since 2.0.0-develop.1
     */
    clear() {
        this.data.events = [];
        return this;
    }
    save(path, cb) {
        if (cb) {
            (0, fs_1.writeFile)(path, this.toString(), cb);
            return this;
        }
        return fs_2.promises.writeFile(path, this.toString());
    }
    /**
     * Save Calendar to disk synchronously using
     * [fs.writeFileSync](http://nodejs.org/api/fs.html#fs_fs_writefilesync_filename_data_options).
     * Only works in node.js environments.
     *
     * ```javascript
     * calendar.saveSync('./calendar.ical');
     * ```
     */
    saveSync(path) {
        (0, fs_1.writeFileSync)(path, this.toString());
        return this;
    }
    /**
     * Send calendar to the user when using HTTP using the passed `ServerResponse` object.
     * Use second parameter `filename` to change the filename, which defaults to `'calendar.ics'`.
     *
     * @param response HTTP Response object which is used to send the calendar
     * @param [filename = 'calendar.ics'] Filename of the calendar file
     */
    serve(response, filename = 'calendar.ics') {
        response.writeHead(200, {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}"`
        });
        response.end(this.toString());
        return this;
    }
    /**
     * Generates a blob to use for downloads or to generate a download URL.
     * Only supported in browsers supporting the Blob API.
     *
     * Unfortunately, because node.js has no Blob implementation (they have Buffer
     * instead), this method is currently untested. Sorry Dave…
     *
     * @since 1.9.0
     */
    toBlob() {
        return new Blob([this.toString()], { type: 'text/calendar' });
    }
    /**
     * Returns a URL to download the ical file. Uses the Blob object internally,
     * so it's only supported in browsers supporting the Blob API.
     *
     * Unfortunately, because node.js has no Blob implementation (they have Buffer
     * instead), this can't be tested right now. Sorry Dave…
     *
     * @since 1.9.0
     */
    toURL() {
        return URL.createObjectURL(this.toBlob());
    }
    x(keyOrArray, value) {
        if (keyOrArray === undefined) {
            return (0, tools_1.addOrGetCustomAttributes)(this.data);
        }
        if (typeof keyOrArray === 'string' && typeof value === 'string') {
            (0, tools_1.addOrGetCustomAttributes)(this.data, keyOrArray, value);
        }
        else if (typeof keyOrArray === 'object') {
            (0, tools_1.addOrGetCustomAttributes)(this.data, keyOrArray);
        }
        else {
            throw new Error('Either key or value is not a string!');
        }
        return this;
    }
    /**
     * Return a shallow copy of the calendar's options for JSON stringification.
     * Third party objects like moment.js values or RRule objects are stringified
     * as well. Can be used for persistence.
     *
     * ```javascript
     * const cal = ical();
     * const json = JSON.stringify(cal);
     *
     * // later: restore calendar data
     * cal = ical(JSON.parse(json));
     * ```
     *
     * @since 0.2.4
     */
    toJSON() {
        return Object.assign({}, this.data, {
            timezone: this.timezone(),
            events: this.data.events.map(event => event.toJSON()),
            x: this.x()
        });
    }
    /**
     * Get the number of events added to your calendar
     */
    length() {
        return this.data.events.length;
    }
    /**
     * Return generated calendar as a string.
     *
     * ```javascript
     * const cal = ical();
     * console.log(cal.toString()); // → BEGIN:VCALENDAR…
     * ```
     */
    toString() {
        var _a, _b;
        let g = '';
        // VCALENDAR and VERSION
        g = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\n';
        // PRODID
        g += 'PRODID:-' + this.data.prodId + '\r\n';
        // URL
        if (this.data.url) {
            g += 'URL:' + this.data.url + '\r\n';
        }
        // SOURCE
        if (this.data.source) {
            g += 'SOURCE;VALUE=URI:' + this.data.source + '\r\n';
        }
        // CALSCALE
        if (this.data.scale) {
            g += 'CALSCALE:' + this.data.scale + '\r\n';
        }
        // METHOD
        if (this.data.method) {
            g += 'METHOD:' + this.data.method + '\r\n';
        }
        // NAME
        if (this.data.name) {
            g += 'NAME:' + this.data.name + '\r\n';
            g += 'X-WR-CALNAME:' + this.data.name + '\r\n';
        }
        // Description
        if (this.data.description) {
            g += 'X-WR-CALDESC:' + this.data.description + '\r\n';
        }
        // Timezone
        if ((_a = this.data.timezone) === null || _a === void 0 ? void 0 : _a.generator) {
            const timezones = [...new Set([
                    this.timezone(),
                    ...this.data.events.map(event => event.timezone())
                ])].filter(tz => tz !== null && !tz.startsWith('/'));
            timezones.forEach(tz => {
                var _a;
                if (!((_a = this.data.timezone) === null || _a === void 0 ? void 0 : _a.generator)) {
                    return;
                }
                const s = this.data.timezone.generator(tz);
                if (!s) {
                    return;
                }
                g += s.replace(/\r\n/g, '\n')
                    .replace(/\n/g, '\r\n')
                    .trim() + '\r\n';
            });
        }
        if ((_b = this.data.timezone) === null || _b === void 0 ? void 0 : _b.name) {
            g += 'TIMEZONE-ID:' + this.data.timezone.name + '\r\n';
            g += 'X-WR-TIMEZONE:' + this.data.timezone.name + '\r\n';
        }
        // TTL
        if (this.data.ttl) {
            g += 'REFRESH-INTERVAL;VALUE=DURATION:' + (0, tools_1.toDurationString)(this.data.ttl) + '\r\n';
            g += 'X-PUBLISHED-TTL:' + (0, tools_1.toDurationString)(this.data.ttl) + '\r\n';
        }
        // Events
        this.data.events.forEach(event => g += event.toString());
        // CUSTOM X ATTRIBUTES
        g += (0, tools_1.generateCustomAttributes)(this.data);
        g += 'END:VCALENDAR';
        return (0, tools_1.foldLines)(g);
    }
}
exports.default = ICalCalendar;

},{"./event":10,"./tools":12,"fs":1}],9:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("./tools");
/**
 * Usually you get an `ICalCategory` object like this:
 *
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * const event = calendar.createEvent();
 * const category = event.createCategory();
 * ```
 *
 * You can also use the [[`ICalCategory`]] object directly:
 *
 * ```javascript
 * import ical, {ICalCategory} from 'ical-generator';
 * const category = new ICalCategory();
 * event.categories([category]);
 * ```
 */
class ICalCategory {
    /**
     * Constructor of [[`ICalCategory`]].
     * @param data Category Data
     */
    constructor(data) {
        this.data = {
            name: null
        };
        data.name !== undefined && this.name(data.name);
    }
    name(name) {
        if (name === undefined) {
            return this.data.name;
        }
        this.data.name = name || null;
        return this;
    }
    /**
     * Return a shallow copy of the category's options for JSON stringification.
     * Can be used for persistence.
     *
     * @since 0.2.4
     */
    toJSON() {
        return Object.assign({}, this.data);
    }
    /**
     * Return generated category name as a string.
     *
     * ```javascript
     * console.log(category.toString());
     * ```
     */
    toString() {
        // CN / Name
        if (!this.data.name) {
            throw new Error('No value for `name` in ICalCategory given!');
        }
        return (0, tools_1.escape)(this.data.name);
    }
}
exports.default = ICalCategory;

},{"./tools":12}],10:[function(require,module,exports){
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICalEventTransparency = exports.ICalEventBusyStatus = exports.ICalEventStatus = void 0;
const uuid_random_1 = __importDefault(require("uuid-random"));
const tools_1 = require("./tools");
const attendee_1 = __importDefault(require("./attendee"));
const alarm_1 = __importDefault(require("./alarm"));
const category_1 = __importDefault(require("./category"));
const types_1 = require("./types");
var ICalEventStatus;
(function (ICalEventStatus) {
    ICalEventStatus["CONFIRMED"] = "CONFIRMED";
    ICalEventStatus["TENTATIVE"] = "TENTATIVE";
    ICalEventStatus["CANCELLED"] = "CANCELLED";
})(ICalEventStatus = exports.ICalEventStatus || (exports.ICalEventStatus = {}));
var ICalEventBusyStatus;
(function (ICalEventBusyStatus) {
    ICalEventBusyStatus["FREE"] = "FREE";
    ICalEventBusyStatus["TENTATIVE"] = "TENTATIVE";
    ICalEventBusyStatus["BUSY"] = "BUSY";
    ICalEventBusyStatus["OOF"] = "OOF";
})(ICalEventBusyStatus = exports.ICalEventBusyStatus || (exports.ICalEventBusyStatus = {}));
var ICalEventTransparency;
(function (ICalEventTransparency) {
    ICalEventTransparency["TRANSPARENT"] = "TRANSPARENT";
    ICalEventTransparency["OPAQUE"] = "OPAQUE";
})(ICalEventTransparency = exports.ICalEventTransparency || (exports.ICalEventTransparency = {}));
/**
 * Usually you get an `ICalCalendar` object like this:
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * const event = calendar.createEvent();
 * ```
 */
class ICalEvent {
    /**
     * Constructor of [[`ICalEvent`]. The calendar reference is
     * required to query the calendar's timezone when required.
     *
     * @param data Calendar Event Data
     * @param calendar Reference to ICalCalendar object
     */
    constructor(data, calendar) {
        this.data = {
            id: (0, uuid_random_1.default)(),
            sequence: 0,
            start: null,
            end: null,
            recurrenceId: null,
            timezone: null,
            stamp: new Date(),
            allDay: false,
            floating: false,
            repeating: null,
            summary: '',
            location: null,
            description: null,
            organizer: null,
            attendees: [],
            alarms: [],
            categories: [],
            status: null,
            busystatus: null,
            priority: null,
            url: null,
            transparency: null,
            created: null,
            lastModified: null,
            x: []
        };
        this.calendar = calendar;
        if (!calendar) {
            throw new Error('`calendar` option required!');
        }
        data.id && this.id(data.id);
        data.sequence !== undefined && this.sequence(data.sequence);
        data.start && this.start(data.start);
        data.end !== undefined && this.end(data.end);
        data.recurrenceId !== undefined && this.recurrenceId(data.recurrenceId);
        data.timezone !== undefined && this.timezone(data.timezone);
        data.stamp !== undefined && this.stamp(data.stamp);
        data.allDay !== undefined && this.allDay(data.allDay);
        data.floating !== undefined && this.floating(data.floating);
        data.repeating !== undefined && this.repeating(data.repeating);
        data.summary !== undefined && this.summary(data.summary);
        data.location !== undefined && this.location(data.location);
        data.description !== undefined && this.description(data.description);
        data.organizer !== undefined && this.organizer(data.organizer);
        data.attendees !== undefined && this.attendees(data.attendees);
        data.alarms !== undefined && this.alarms(data.alarms);
        data.categories !== undefined && this.categories(data.categories);
        data.status !== undefined && this.status(data.status);
        data.busystatus !== undefined && this.busystatus(data.busystatus);
        data.priority !== undefined && this.priority(data.priority);
        data.url !== undefined && this.url(data.url);
        data.transparency !== undefined && this.transparency(data.transparency);
        data.created !== undefined && this.created(data.created);
        data.lastModified !== undefined && this.lastModified(data.lastModified);
        data.x !== undefined && this.x(data.x);
    }
    id(id) {
        if (id === undefined) {
            return this.data.id;
        }
        this.data.id = String(id);
        return this;
    }
    uid(id) {
        return id === undefined ? this.id() : this.id(id);
    }
    sequence(sequence) {
        if (sequence === undefined) {
            return this.data.sequence;
        }
        const s = parseInt(String(sequence), 10);
        if (isNaN(s)) {
            throw new Error('`sequence` must be a number!');
        }
        this.data.sequence = sequence;
        return this;
    }
    start(start) {
        if (start === undefined) {
            return this.data.start;
        }
        this.data.start = (0, tools_1.checkDate)(start, 'start');
        if (this.data.start && this.data.end && (0, tools_1.toDate)(this.data.start).getTime() > (0, tools_1.toDate)(this.data.end).getTime()) {
            const t = this.data.start;
            this.data.start = this.data.end;
            this.data.end = t;
        }
        return this;
    }
    end(end) {
        if (end === undefined) {
            return this.data.end;
        }
        if (end === null) {
            this.data.end = null;
            return this;
        }
        this.data.end = (0, tools_1.checkDate)(end, 'end');
        if (this.data.start && this.data.end && (0, tools_1.toDate)(this.data.start).getTime() > (0, tools_1.toDate)(this.data.end).getTime()) {
            const t = this.data.start;
            this.data.start = this.data.end;
            this.data.end = t;
        }
        return this;
    }
    recurrenceId(recurrenceId) {
        if (recurrenceId === undefined) {
            return this.data.recurrenceId;
        }
        if (recurrenceId === null) {
            this.data.recurrenceId = null;
            return this;
        }
        this.data.recurrenceId = (0, tools_1.checkDate)(recurrenceId, 'recurrenceId');
        return this;
    }
    timezone(timezone) {
        if (timezone === undefined && this.data.timezone !== null) {
            return this.data.timezone;
        }
        if (timezone === undefined) {
            return this.calendar.timezone();
        }
        this.data.timezone = timezone ? timezone.toString() : null;
        if (this.data.timezone) {
            this.data.floating = false;
        }
        return this;
    }
    stamp(stamp) {
        if (stamp === undefined) {
            return this.data.stamp;
        }
        this.data.stamp = (0, tools_1.checkDate)(stamp, 'stamp');
        return this;
    }
    timestamp(stamp) {
        if (stamp === undefined) {
            return this.stamp();
        }
        return this.stamp(stamp);
    }
    allDay(allDay) {
        if (allDay === undefined) {
            return this.data.allDay;
        }
        this.data.allDay = Boolean(allDay);
        return this;
    }
    /**
     * Set the event's floating flag. This unsets the event's timezone.
     * Events whose floating flag is set to true always take place at the
     * same time, regardless of the time zone.
     *
     * @since 0.2.0
     */
    floating(floating) {
        if (floating === undefined) {
            return this.data.floating;
        }
        this.data.floating = Boolean(floating);
        if (this.data.floating) {
            this.data.timezone = null;
        }
        return this;
    }
    repeating(repeating) {
        if (repeating === undefined) {
            return this.data.repeating;
        }
        if (!repeating) {
            this.data.repeating = null;
            return this;
        }
        if ((0, tools_1.isRRule)(repeating) || typeof repeating === 'string') {
            this.data.repeating = repeating;
            return this;
        }
        this.data.repeating = {
            freq: (0, tools_1.checkEnum)(types_1.ICalEventRepeatingFreq, repeating.freq)
        };
        if (repeating.count) {
            if (!isFinite(repeating.count)) {
                throw new Error('`repeating.count` must be a finite number!');
            }
            this.data.repeating.count = repeating.count;
        }
        if (repeating.interval) {
            if (!isFinite(repeating.interval)) {
                throw new Error('`repeating.interval` must be a finite number!');
            }
            this.data.repeating.interval = repeating.interval;
        }
        if (repeating.until !== undefined) {
            this.data.repeating.until = (0, tools_1.checkDate)(repeating.until, 'repeating.until');
        }
        if (repeating.byDay) {
            const byDayArray = Array.isArray(repeating.byDay) ? repeating.byDay : [repeating.byDay];
            this.data.repeating.byDay = byDayArray.map(day => (0, tools_1.checkEnum)(types_1.ICalWeekday, day));
        }
        if (repeating.byMonth) {
            const byMonthArray = Array.isArray(repeating.byMonth) ? repeating.byMonth : [repeating.byMonth];
            this.data.repeating.byMonth = byMonthArray.map(month => {
                if (typeof month !== 'number' || month < 1 || month > 12) {
                    throw new Error('`repeating.byMonth` contains invalid value `' + month + '`!');
                }
                return month;
            });
        }
        if (repeating.byMonthDay) {
            const byMonthDayArray = Array.isArray(repeating.byMonthDay) ? repeating.byMonthDay : [repeating.byMonthDay];
            this.data.repeating.byMonthDay = byMonthDayArray.map(monthDay => {
                if (typeof monthDay !== 'number' || monthDay < 1 || monthDay > 31) {
                    throw new Error('`repeating.byMonthDay` contains invalid value `' + monthDay + '`!');
                }
                return monthDay;
            });
        }
        if (repeating.bySetPos) {
            if (!this.data.repeating.byDay) {
                throw '`repeating.bySetPos` must be used along with `repeating.byDay`!';
            }
            if (typeof repeating.bySetPos !== 'number' || repeating.bySetPos < -1 || repeating.bySetPos > 4) {
                throw '`repeating.bySetPos` contains invalid value `' + repeating.bySetPos + '`!';
            }
            this.data.repeating.byDay.splice(1);
            this.data.repeating.bySetPos = repeating.bySetPos;
        }
        if (repeating.exclude) {
            const excludeArray = Array.isArray(repeating.exclude) ? repeating.exclude : [repeating.exclude];
            this.data.repeating.exclude = excludeArray.map((exclude, i) => {
                return (0, tools_1.checkDate)(exclude, `repeating.exclude[${i}]`);
            });
        }
        if (repeating.startOfWeek) {
            this.data.repeating.startOfWeek = (0, tools_1.checkEnum)(types_1.ICalWeekday, repeating.startOfWeek);
        }
        return this;
    }
    summary(summary) {
        if (summary === undefined) {
            return this.data.summary;
        }
        this.data.summary = summary ? String(summary) : '';
        return this;
    }
    location(location) {
        if (location === undefined) {
            return this.data.location;
        }
        if (typeof location === 'string') {
            this.data.location = {
                title: location
            };
            return this;
        }
        if ((location && !location.title) ||
            ((location === null || location === void 0 ? void 0 : location.geo) && (!isFinite(location.geo.lat) || !isFinite(location.geo.lon)))) {
            throw new Error('`location` isn\'t formatted correctly. See https://sebbo2002.github.io/ical-generator/' +
                'develop/reference/classes/icalevent.html#location');
        }
        this.data.location = location || null;
        return this;
    }
    description(description) {
        if (description === undefined) {
            return this.data.description;
        }
        if (description === null) {
            this.data.description = null;
            return this;
        }
        if (typeof description === 'string') {
            this.data.description = { plain: description };
        }
        else {
            this.data.description = description;
        }
        return this;
    }
    organizer(organizer) {
        if (organizer === undefined) {
            return this.data.organizer;
        }
        if (organizer === null) {
            this.data.organizer = null;
            return this;
        }
        this.data.organizer = (0, tools_1.checkNameAndMail)('organizer', organizer);
        return this;
    }
    /**
     * Creates a new [[`ICalAttendee`]] and returns it. Use options to prefill
     * the attendee's attributes. Calling this method without options will create
     * an empty attendee.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const attendee = event.createAttendee({email: 'hui@example.com', name: 'Hui'});
     *
     * // add another attendee
     * event.createAttendee('Buh <buh@example.net>');
     * ```
     *
     * As with the organizer, you can also add an explicit `mailto` address.
     *
     * ```javascript
     * event.createAttendee({email: 'hui@example.com', name: 'Hui', mailto: 'another@mailto.com'});
     *
     * // overwrite an attendee's mailto address
     * attendee.mailto('another@mailto.net');
     * ```
     *
     * @since 0.2.0
     */
    createAttendee(data = {}) {
        if (data instanceof attendee_1.default) {
            this.data.attendees.push(data);
            return data;
        }
        if (typeof data === 'string') {
            data = (0, tools_1.checkNameAndMail)('data', data);
        }
        const attendee = new attendee_1.default(data, this);
        this.data.attendees.push(attendee);
        return attendee;
    }
    attendees(attendees) {
        if (!attendees) {
            return this.data.attendees;
        }
        attendees.forEach(attendee => this.createAttendee(attendee));
        return this;
    }
    /**
     * Creates a new [[`ICalAlarm`]] and returns it. Use options to prefill
     * the alarm's attributes. Calling this method without options will create
     * an empty alarm.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const alarm = event.createAlarm({type: 'display', trigger: 300});
     *
     * // add another alarm
     * event.createAlarm({
     *     type: 'audio',
     *     trigger: 300, // 5min before event
     * });
     * ```
     *
     * @since 0.2.1
     */
    createAlarm(data = {}) {
        const alarm = data instanceof alarm_1.default ? data : new alarm_1.default(data, this);
        this.data.alarms.push(alarm);
        return alarm;
    }
    alarms(alarms) {
        if (!alarms) {
            return this.data.alarms;
        }
        alarms.forEach((alarm) => this.createAlarm(alarm));
        return this;
    }
    /**
     * Creates a new [[`ICalCategory`]] and returns it. Use options to prefill the categories' attributes.
     * Calling this method without options will create an empty category.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const category = event.createCategory({name: 'APPOINTMENT'});
     *
     * // add another alarm
     * event.createCategory({
     *     name: 'MEETING'
     * });
     * ```
     *
     * @since 0.3.0
     */
    createCategory(data = {}) {
        const category = data instanceof category_1.default ? data : new category_1.default(data);
        this.data.categories.push(category);
        return category;
    }
    categories(categories) {
        if (!categories) {
            return this.data.categories;
        }
        categories.forEach(category => this.createCategory(category));
        return this;
    }
    status(status) {
        if (status === undefined) {
            return this.data.status;
        }
        if (status === null) {
            this.data.status = null;
            return this;
        }
        this.data.status = (0, tools_1.checkEnum)(ICalEventStatus, status);
        return this;
    }
    busystatus(busystatus) {
        if (busystatus === undefined) {
            return this.data.busystatus;
        }
        if (busystatus === null) {
            this.data.busystatus = null;
            return this;
        }
        this.data.busystatus = (0, tools_1.checkEnum)(ICalEventBusyStatus, busystatus);
        return this;
    }
    priority(priority) {
        if (priority === undefined) {
            return this.data.priority;
        }
        if (priority === null) {
            this.data.priority = null;
            return this;
        }
        if (priority < 0 || priority > 9) {
            throw new Error('`priority` is invalid, musst be 0 ≤ priority ≤ 9.');
        }
        this.data.priority = Math.round(priority);
        return this;
    }
    url(url) {
        if (url === undefined) {
            return this.data.url;
        }
        this.data.url = url ? String(url) : null;
        return this;
    }
    transparency(transparency) {
        if (transparency === undefined) {
            return this.data.transparency;
        }
        if (!transparency) {
            this.data.transparency = null;
            return this;
        }
        this.data.transparency = (0, tools_1.checkEnum)(ICalEventTransparency, transparency);
        return this;
    }
    created(created) {
        if (created === undefined) {
            return this.data.created;
        }
        if (created === null) {
            this.data.created = null;
            return this;
        }
        this.data.created = (0, tools_1.checkDate)(created, 'created');
        return this;
    }
    lastModified(lastModified) {
        if (lastModified === undefined) {
            return this.data.lastModified;
        }
        if (lastModified === null) {
            this.data.lastModified = null;
            return this;
        }
        this.data.lastModified = (0, tools_1.checkDate)(lastModified, 'lastModified');
        return this;
    }
    x(keyOrArray, value) {
        if (keyOrArray === undefined) {
            return (0, tools_1.addOrGetCustomAttributes)(this.data);
        }
        if (typeof keyOrArray === 'string' && typeof value === 'string') {
            (0, tools_1.addOrGetCustomAttributes)(this.data, keyOrArray, value);
        }
        if (typeof keyOrArray === 'object') {
            (0, tools_1.addOrGetCustomAttributes)(this.data, keyOrArray);
        }
        return this;
    }
    /**
     * Return a shallow copy of the events's options for JSON stringification.
     * Third party objects like moment.js values or RRule objects are stringified
     * as well. Can be used for persistence.
     *
     * ```javascript
     * const event = ical().createEvent();
     * const json = JSON.stringify(event);
     *
     * // later: restore event data
     * const calendar = ical().createEvent(JSON.parse(json));
     * ```
     *
     * @since 0.2.4
     */
    toJSON() {
        var _a;
        let repeating = null;
        if ((0, tools_1.isRRule)(this.data.repeating) || typeof this.data.repeating === 'string') {
            repeating = this.data.repeating.toString();
        }
        else if (this.data.repeating) {
            repeating = Object.assign({}, this.data.repeating, {
                until: (0, tools_1.toJSON)(this.data.repeating.until),
                exclude: (_a = this.data.repeating.exclude) === null || _a === void 0 ? void 0 : _a.map(d => (0, tools_1.toJSON)(d)),
            });
        }
        return Object.assign({}, this.data, {
            start: (0, tools_1.toJSON)(this.data.start) || null,
            end: (0, tools_1.toJSON)(this.data.end) || null,
            recurrenceId: (0, tools_1.toJSON)(this.data.recurrenceId) || null,
            stamp: (0, tools_1.toJSON)(this.data.stamp) || null,
            created: (0, tools_1.toJSON)(this.data.created) || null,
            lastModified: (0, tools_1.toJSON)(this.data.lastModified) || null,
            repeating,
            x: this.x()
        });
    }
    /**
     * Return generated event as a string.
     *
     * ```javascript
     * const event = ical().createEvent();
     * console.log(event.toString()); // → BEGIN:VEVENT…
     * ```
     */
    toString() {
        var _a, _b, _c, _d, _e;
        let g = '';
        if (!this.data.start) {
            throw new Error('No value for `start` in ICalEvent #' + this.data.id + ' given!');
        }
        // DATE & TIME
        g += 'BEGIN:VEVENT\r\n';
        g += 'UID:' + this.data.id + '\r\n';
        // SEQUENCE
        g += 'SEQUENCE:' + this.data.sequence + '\r\n';
        g += 'DTSTAMP:' + (0, tools_1.formatDate)(this.calendar.timezone(), this.data.stamp) + '\r\n';
        if (this.data.allDay) {
            g += 'DTSTART;VALUE=DATE:' + (0, tools_1.formatDate)(this.calendar.timezone(), this.data.start, true) + '\r\n';
            if (this.data.end) {
                g += 'DTEND;VALUE=DATE:' + (0, tools_1.formatDate)(this.calendar.timezone(), this.data.end, true) + '\r\n';
            }
            g += 'X-MICROSOFT-CDO-ALLDAYEVENT:TRUE\r\n';
            g += 'X-MICROSOFT-MSNCALENDAR-ALLDAYEVENT:TRUE\r\n';
        }
        else {
            g += (0, tools_1.formatDateTZ)(this.timezone(), 'DTSTART', this.data.start, this.data) + '\r\n';
            if (this.data.end) {
                g += (0, tools_1.formatDateTZ)(this.timezone(), 'DTEND', this.data.end, this.data) + '\r\n';
            }
        }
        // REPEATING
        if ((0, tools_1.isRRule)(this.data.repeating) || typeof this.data.repeating === 'string') {
            g += this.data.repeating
                .toString()
                .replace(/\r\n/g, '\n')
                .split('\n')
                .filter(l => l && !l.startsWith('DTSTART:'))
                .join('\r\n') + '\r\n';
        }
        else if (this.data.repeating) {
            g += 'RRULE:FREQ=' + this.data.repeating.freq;
            if (this.data.repeating.count) {
                g += ';COUNT=' + this.data.repeating.count;
            }
            if (this.data.repeating.interval) {
                g += ';INTERVAL=' + this.data.repeating.interval;
            }
            if (this.data.repeating.until) {
                g += ';UNTIL=' + (0, tools_1.formatDate)(this.calendar.timezone(), this.data.repeating.until);
            }
            if (this.data.repeating.byDay) {
                g += ';BYDAY=' + this.data.repeating.byDay.join(',');
            }
            if (this.data.repeating.byMonth) {
                g += ';BYMONTH=' + this.data.repeating.byMonth.join(',');
            }
            if (this.data.repeating.byMonthDay) {
                g += ';BYMONTHDAY=' + this.data.repeating.byMonthDay.join(',');
            }
            if (this.data.repeating.bySetPos) {
                g += ';BYSETPOS=' + this.data.repeating.bySetPos;
            }
            if (this.data.repeating.startOfWeek) {
                g += ';WKST=' + this.data.repeating.startOfWeek;
            }
            g += '\r\n';
            // REPEATING EXCLUSION
            if (this.data.repeating.exclude) {
                if (this.data.allDay) {
                    g += 'EXDATE;VALUE=DATE:' + this.data.repeating.exclude.map(excludedDate => {
                        return (0, tools_1.formatDate)(this.calendar.timezone(), excludedDate, true);
                    }).join(',') + '\r\n';
                }
                else {
                    g += 'EXDATE';
                    if (this.timezone()) {
                        g += ';TZID=' + this.timezone() + ':' + this.data.repeating.exclude.map(excludedDate => {
                            // This isn't a 'floating' event because it has a timezone;
                            // but we use it to omit the 'Z' UTC specifier in formatDate()
                            return (0, tools_1.formatDate)(this.timezone(), excludedDate, false, true);
                        }).join(',') + '\r\n';
                    }
                    else {
                        g += ':' + this.data.repeating.exclude.map(excludedDate => {
                            return (0, tools_1.formatDate)(this.timezone(), excludedDate);
                        }).join(',') + '\r\n';
                    }
                }
            }
        }
        // RECURRENCE
        if (this.data.recurrenceId) {
            g += (0, tools_1.formatDateTZ)(this.timezone(), 'RECURRENCE-ID', this.data.recurrenceId, this.data) + '\r\n';
        }
        // SUMMARY
        g += 'SUMMARY:' + (0, tools_1.escape)(this.data.summary) + '\r\n';
        // TRANSPARENCY
        if (this.data.transparency) {
            g += 'TRANSP:' + (0, tools_1.escape)(this.data.transparency) + '\r\n';
        }
        // LOCATION
        if ((_a = this.data.location) === null || _a === void 0 ? void 0 : _a.title) {
            g += 'LOCATION:' + (0, tools_1.escape)(this.data.location.title +
                (this.data.location.address ? '\n' + this.data.location.address : '')) + '\r\n';
            if (this.data.location.radius && this.data.location.geo) {
                g += 'X-APPLE-STRUCTURED-LOCATION;VALUE=URI;' +
                    (this.data.location.address ? 'X-ADDRESS=' + (0, tools_1.escape)(this.data.location.address) + ';' : '') +
                    'X-APPLE-RADIUS=' + (0, tools_1.escape)(this.data.location.radius) + ';' +
                    'X-TITLE=' + (0, tools_1.escape)(this.data.location.title) +
                    ':geo:' + (0, tools_1.escape)((_b = this.data.location.geo) === null || _b === void 0 ? void 0 : _b.lat) + ',' + (0, tools_1.escape)((_c = this.data.location.geo) === null || _c === void 0 ? void 0 : _c.lon) + '\r\n';
            }
            if (this.data.location.geo) {
                g += 'GEO:' + (0, tools_1.escape)((_d = this.data.location.geo) === null || _d === void 0 ? void 0 : _d.lat) + ';' + (0, tools_1.escape)((_e = this.data.location.geo) === null || _e === void 0 ? void 0 : _e.lon) + '\r\n';
            }
        }
        // DESCRIPTION
        if (this.data.description) {
            g += 'DESCRIPTION:' + (0, tools_1.escape)(this.data.description.plain) + '\r\n';
            // HTML DESCRIPTION
            if (this.data.description.html) {
                g += 'X-ALT-DESC;FMTTYPE=text/html:' + (0, tools_1.escape)(this.data.description.html) + '\r\n';
            }
        }
        // ORGANIZER
        if (this.data.organizer) {
            g += 'ORGANIZER;CN="' + (0, tools_1.escape)(this.data.organizer.name) + '"';
            if (this.data.organizer.email && this.data.organizer.mailto) {
                g += ';EMAIL=' + (0, tools_1.escape)(this.data.organizer.email);
            }
            if (this.data.organizer.email) {
                g += ':mailto:' + (0, tools_1.escape)(this.data.organizer.mailto || this.data.organizer.email);
            }
            g += '\r\n';
        }
        // ATTENDEES
        this.data.attendees.forEach(function (attendee) {
            g += attendee.toString();
        });
        // ALARMS
        this.data.alarms.forEach(function (alarm) {
            g += alarm.toString();
        });
        // CATEGORIES
        if (this.data.categories.length > 0) {
            g += 'CATEGORIES:' + this.data.categories.map(function (category) {
                return category.toString();
            }).join() + '\r\n';
        }
        // URL
        if (this.data.url) {
            g += 'URL;VALUE=URI:' + (0, tools_1.escape)(this.data.url) + '\r\n';
        }
        // STATUS
        if (this.data.status) {
            g += 'STATUS:' + this.data.status.toUpperCase() + '\r\n';
        }
        // BUSYSTATUS
        if (this.data.busystatus) {
            g += 'X-MICROSOFT-CDO-BUSYSTATUS:' + this.data.busystatus.toUpperCase() + '\r\n';
        }
        // PRIORITY
        if (this.data.priority !== null) {
            g += 'PRIORITY:' + this.data.priority + '\r\n';
        }
        // CUSTOM X ATTRIBUTES
        g += (0, tools_1.generateCustomAttributes)(this.data);
        // CREATED
        if (this.data.created) {
            g += 'CREATED:' + (0, tools_1.formatDate)(this.calendar.timezone(), this.data.created) + '\r\n';
        }
        // LAST-MODIFIED
        if (this.data.lastModified) {
            g += 'LAST-MODIFIED:' + (0, tools_1.formatDate)(this.calendar.timezone(), this.data.lastModified) + '\r\n';
        }
        g += 'END:VEVENT\r\n';
        return g;
    }
}
exports.default = ICalEvent;

},{"./alarm":6,"./attendee":7,"./category":9,"./tools":12,"./types":13,"uuid-random":14}],11:[function(require,module,exports){
/**
 * ical-generator entrypoint
 */
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.foldLines = exports.escape = exports.formatDateTZ = exports.formatDate = exports.ICalWeekday = exports.ICalEventRepeatingFreq = exports.ICalEventTransparency = exports.ICalEventBusyStatus = exports.ICalEventStatus = exports.ICalEvent = exports.ICalCategory = exports.ICalCalendarMethod = exports.ICalCalendar = exports.ICalAttendeeStatus = exports.ICalAttendeeRole = exports.ICalAttendeeType = exports.ICalAttendee = exports.ICalAlarmType = exports.ICalAlarm = void 0;
const calendar_1 = __importDefault(require("./calendar"));
/**
 * Create a new, empty calendar and returns it.
 *
 * ```javascript
 * import ical from 'ical-generator';
 *
 * // or use require:
 * // const ical = require('ical-generator');
 *
 * const cal = ical();
 * ```
 *
 * You can pass options to setup your calendar or use setters to do this.
 *
 * ```javascript
 * import ical from 'ical-generator';
 *
 * // or use require:
 * // const ical = require('ical-generator');
 * const cal = ical({domain: 'sebbo.net'});
 *
 * // is the same as
 *
 * const cal = ical().domain('sebbo.net');
 *
 * // is the same as
 *
 * const cal = ical();
 * cal.domain('sebbo.net');
 * ```
 *
 * @param data Calendar data
 */
function ical(data) {
    return new calendar_1.default(data);
}
exports.default = ical;
var alarm_1 = require("./alarm");
Object.defineProperty(exports, "ICalAlarm", { enumerable: true, get: function () { return __importDefault(alarm_1).default; } });
Object.defineProperty(exports, "ICalAlarmType", { enumerable: true, get: function () { return alarm_1.ICalAlarmType; } });
var attendee_1 = require("./attendee");
Object.defineProperty(exports, "ICalAttendee", { enumerable: true, get: function () { return __importDefault(attendee_1).default; } });
Object.defineProperty(exports, "ICalAttendeeType", { enumerable: true, get: function () { return attendee_1.ICalAttendeeType; } });
Object.defineProperty(exports, "ICalAttendeeRole", { enumerable: true, get: function () { return attendee_1.ICalAttendeeRole; } });
Object.defineProperty(exports, "ICalAttendeeStatus", { enumerable: true, get: function () { return attendee_1.ICalAttendeeStatus; } });
var calendar_2 = require("./calendar");
Object.defineProperty(exports, "ICalCalendar", { enumerable: true, get: function () { return __importDefault(calendar_2).default; } });
Object.defineProperty(exports, "ICalCalendarMethod", { enumerable: true, get: function () { return calendar_2.ICalCalendarMethod; } });
var category_1 = require("./category");
Object.defineProperty(exports, "ICalCategory", { enumerable: true, get: function () { return __importDefault(category_1).default; } });
var event_1 = require("./event");
Object.defineProperty(exports, "ICalEvent", { enumerable: true, get: function () { return __importDefault(event_1).default; } });
Object.defineProperty(exports, "ICalEventStatus", { enumerable: true, get: function () { return event_1.ICalEventStatus; } });
Object.defineProperty(exports, "ICalEventBusyStatus", { enumerable: true, get: function () { return event_1.ICalEventBusyStatus; } });
Object.defineProperty(exports, "ICalEventTransparency", { enumerable: true, get: function () { return event_1.ICalEventTransparency; } });
var types_1 = require("./types");
Object.defineProperty(exports, "ICalEventRepeatingFreq", { enumerable: true, get: function () { return types_1.ICalEventRepeatingFreq; } });
Object.defineProperty(exports, "ICalWeekday", { enumerable: true, get: function () { return types_1.ICalWeekday; } });
var tools_1 = require("./tools");
Object.defineProperty(exports, "formatDate", { enumerable: true, get: function () { return tools_1.formatDate; } });
Object.defineProperty(exports, "formatDateTZ", { enumerable: true, get: function () { return tools_1.formatDateTZ; } });
Object.defineProperty(exports, "escape", { enumerable: true, get: function () { return tools_1.escape; } });
Object.defineProperty(exports, "foldLines", { enumerable: true, get: function () { return tools_1.foldLines; } });
/* istanbul ignore else */
if (typeof module !== 'undefined') {
    module.exports = Object.assign(ical, module.exports);
}

},{"./alarm":6,"./attendee":7,"./calendar":8,"./category":9,"./event":10,"./tools":12,"./types":13}],12:[function(require,module,exports){
(function (Buffer){(function (){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDurationString = exports.toJSON = exports.isRRule = exports.isMomentDuration = exports.isLuxonDate = exports.isDayjs = exports.isMomentTZ = exports.isMoment = exports.toDate = exports.checkDate = exports.checkEnum = exports.checkNameAndMail = exports.generateCustomAttributes = exports.addOrGetCustomAttributes = exports.foldLines = exports.escape = exports.formatDateTZ = exports.formatDate = void 0;
/**
 * Converts a valid date/time object supported by this library to a string.
 */
function formatDate(timezone, d, dateonly, floating) {
    if (timezone === null || timezone === void 0 ? void 0 : timezone.startsWith('/')) {
        timezone = timezone.substr(1);
    }
    if (typeof d === 'string' || d instanceof Date) {
        const m = new Date(d);
        // (!dateonly && !floating) || !timezone => utc
        let s = m.getUTCFullYear() +
            String(m.getUTCMonth() + 1).padStart(2, '0') +
            m.getUTCDate().toString().padStart(2, '0');
        // (dateonly || floating) && timezone => tz
        if (timezone) {
            s = m.getFullYear() +
                String(m.getMonth() + 1).padStart(2, '0') +
                m.getDate().toString().padStart(2, '0');
        }
        if (dateonly) {
            return s;
        }
        if (timezone) {
            s += 'T' + m.getHours().toString().padStart(2, '0') +
                m.getMinutes().toString().padStart(2, '0') +
                m.getSeconds().toString().padStart(2, '0');
            return s;
        }
        s += 'T' + m.getUTCHours().toString().padStart(2, '0') +
            m.getUTCMinutes().toString().padStart(2, '0') +
            m.getUTCSeconds().toString().padStart(2, '0') +
            (floating ? '' : 'Z');
        return s;
    }
    else if (isMoment(d)) {
        // @see https://momentjs.com/timezone/docs/#/using-timezones/parsing-in-zone/
        const m = timezone ? (isMomentTZ(d) && !d.tz() ? d.clone().tz(timezone) : d) : (floating ? d : d.utc());
        return m.format('YYYYMMDD') + (!dateonly ? ('T' + m.format('HHmmss') + (floating || timezone ? '' : 'Z')) : '');
    }
    else if (isLuxonDate(d)) {
        const m = timezone ? d.setZone(timezone) : (floating ? d : d.setZone('utc'));
        return m.toFormat('yyyyLLdd') + (!dateonly ? ('T' + m.toFormat('HHmmss') + (floating || timezone ? '' : 'Z')) : '');
    }
    else {
        // @see https://day.js.org/docs/en/plugin/utc
        let m = d;
        if (timezone) {
            // @see https://day.js.org/docs/en/plugin/timezone
            // @ts-ignore
            m = typeof d.tz === 'function' ? d.tz(timezone) : d;
        }
        else if (floating) {
            // m = d;
        }
        // @ts-ignore
        else if (typeof d.utc === 'function') {
            // @ts-ignore
            m = d.utc();
        }
        else {
            throw new Error('Unable to convert dayjs object to UTC value: UTC plugin is not available!');
        }
        return m.format('YYYYMMDD') + (!dateonly ? ('T' + m.format('HHmmss') + (floating || timezone ? '' : 'Z')) : '');
    }
}
exports.formatDate = formatDate;
/**
 * Converts a valid date/time object supported by this library to a string.
 * For information about this format, see RFC 5545, section 3.3.5
 * https://tools.ietf.org/html/rfc5545#section-3.3.5
 */
function formatDateTZ(timezone, property, date, eventData) {
    let tzParam = '';
    let floating = (eventData === null || eventData === void 0 ? void 0 : eventData.floating) || false;
    if (eventData === null || eventData === void 0 ? void 0 : eventData.timezone) {
        tzParam = ';TZID=' + eventData.timezone;
        // This isn't a 'floating' event because it has a timezone;
        // but we use it to omit the 'Z' UTC specifier in formatDate()
        floating = true;
    }
    return property + tzParam + ':' + formatDate(timezone, date, false, floating);
}
exports.formatDateTZ = formatDateTZ;
/**
 * Escapes special characters in the given string
 */
function escape(str) {
    return String(str).replace(/[\\;,"]/g, function (match) {
        return '\\' + match;
    }).replace(/(?:\r\n|\r|\n)/g, '\\n');
}
exports.escape = escape;
/**
 * Trim line length of given string
 */
function foldLines(input) {
    return input.split('\r\n').map(function (line) {
        let result = '';
        let c = 0;
        for (let i = 0; i < line.length; i++) {
            let ch = line.charAt(i);
            // surrogate pair, see https://mathiasbynens.be/notes/javascript-encoding#surrogate-pairs
            if (ch >= '\ud800' && ch <= '\udbff') {
                ch += line.charAt(++i);
            }
            const charsize = Buffer.from(ch).length;
            c += charsize;
            if (c > 74) {
                result += '\r\n ';
                c = charsize;
            }
            result += ch;
        }
        return result;
    }).join('\r\n');
}
exports.foldLines = foldLines;
function addOrGetCustomAttributes(data, keyOrArray, value) {
    if (Array.isArray(keyOrArray)) {
        data.x = keyOrArray.map((o) => {
            if (Array.isArray(o)) {
                return o;
            }
            if (typeof o.key !== 'string' || typeof o.value !== 'string') {
                throw new Error('Either key or value is not a string!');
            }
            if (o.key.substr(0, 2) !== 'X-') {
                throw new Error('Key has to start with `X-`!');
            }
            return [o.key, o.value];
        });
    }
    else if (typeof keyOrArray === 'object') {
        data.x = Object.entries(keyOrArray).map(([key, value]) => {
            if (typeof key !== 'string' || typeof value !== 'string') {
                throw new Error('Either key or value is not a string!');
            }
            if (key.substr(0, 2) !== 'X-') {
                throw new Error('Key has to start with `X-`!');
            }
            return [key, value];
        });
    }
    else if (typeof keyOrArray === 'string' && typeof value === 'string') {
        if (keyOrArray.substr(0, 2) !== 'X-') {
            throw new Error('Key has to start with `X-`!');
        }
        data.x.push([keyOrArray, value]);
    }
    else {
        return data.x.map(a => ({
            key: a[0],
            value: a[1]
        }));
    }
}
exports.addOrGetCustomAttributes = addOrGetCustomAttributes;
function generateCustomAttributes(data) {
    const str = data.x
        .map(([key, value]) => key.toUpperCase() + ':' + escape(value))
        .join('\r\n');
    return str.length ? str + '\r\n' : '';
}
exports.generateCustomAttributes = generateCustomAttributes;
/**
 * Check the given string or ICalOrganizer. Parses
 * the string for name and email address if possible.
 *
 * @param attribute Attribute name for error messages
 * @param value Value to parse name/email from
 */
function checkNameAndMail(attribute, value) {
    let result = null;
    if (typeof value === 'string') {
        const match = value.match(/^(.+) ?<([^>]+)>$/);
        if (match) {
            result = {
                name: match[1].trim(),
                email: match[2].trim()
            };
        }
        else if (value.includes('@')) {
            result = {
                name: value.trim(),
                email: value.trim()
            };
        }
    }
    else if (typeof value === 'object') {
        result = {
            name: value.name,
            email: value.email,
            mailto: value.mailto
        };
    }
    if (!result && typeof value === 'string') {
        throw new Error('`' + attribute + '` isn\'t formated correctly. See https://sebbo2002.github.io/ical-generator/develop/' +
            'reference/interfaces/icalorganizer.html');
    }
    else if (!result) {
        throw new Error('`' + attribute + '` needs to be a valid formed string or an object. See https://sebbo2002.github.io/' +
            'ical-generator/develop/reference/interfaces/icalorganizer.html');
    }
    if (!result.name) {
        throw new Error('`' + attribute + '.name` is empty!');
    }
    return result;
}
exports.checkNameAndMail = checkNameAndMail;
/**
 * Checks if the given string `value` is a
 * valid one for the type `type`
 */
function checkEnum(type, value) {
    const allowedValues = Object.values(type);
    const valueStr = String(value).toUpperCase();
    if (!valueStr || !allowedValues.includes(valueStr)) {
        throw new Error(`Input must be one of the following: ${allowedValues.join(', ')}`);
    }
    return valueStr;
}
exports.checkEnum = checkEnum;
/**
 * Checks if the given input is a valid date and
 * returns the internal representation (= moment object)
 */
function checkDate(value, attribute) {
    // Date & String
    if ((value instanceof Date && isNaN(value.getTime())) ||
        (typeof value === 'string' && isNaN(new Date(value).getTime()))) {
        throw new Error(`\`${attribute}\` has to be a valid date!`);
    }
    if (value instanceof Date || typeof value === 'string') {
        return value;
    }
    // Luxon
    if (isLuxonDate(value) && value.isValid === true) {
        return value;
    }
    // Moment / Moment Timezone
    if ((isMoment(value) || isDayjs(value)) && value.isValid()) {
        return value;
    }
    throw new Error(`\`${attribute}\` has to be a valid date!`);
}
exports.checkDate = checkDate;
function toDate(value) {
    if (typeof value === 'string' || value instanceof Date) {
        return new Date(value);
    }
    // @ts-ignore
    if (isLuxonDate(value)) {
        return value.toJSDate();
    }
    return value.toDate();
}
exports.toDate = toDate;
function isMoment(value) {
    // @ts-ignore
    return value != null && value._isAMomentObject != null;
}
exports.isMoment = isMoment;
function isMomentTZ(value) {
    return isMoment(value) && typeof value.tz === 'function';
}
exports.isMomentTZ = isMomentTZ;
function isDayjs(value) {
    return typeof value === 'object' &&
        value !== null &&
        !(value instanceof Date) &&
        !isMoment(value) &&
        !isLuxonDate(value);
}
exports.isDayjs = isDayjs;
function isLuxonDate(value) {
    return typeof value === 'object' && value !== null && typeof value.toJSDate === 'function';
}
exports.isLuxonDate = isLuxonDate;
function isMomentDuration(value) {
    // @ts-ignore
    return value !== null && typeof value === 'object' && typeof value.asSeconds === 'function';
}
exports.isMomentDuration = isMomentDuration;
function isRRule(value) {
    // @ts-ignore
    return value !== null && typeof value === 'object' && typeof value.between === 'function' && typeof value.toString === 'function';
}
exports.isRRule = isRRule;
function toJSON(value) {
    if (!value) {
        return value;
    }
    if (typeof value === 'string') {
        return value;
    }
    return value.toJSON();
}
exports.toJSON = toJSON;
function toDurationString(seconds) {
    let string = '';
    // < 0
    if (seconds < 0) {
        string = '-';
        seconds *= -1;
    }
    string += 'P';
    // DAYS
    if (seconds >= 86400) {
        string += Math.floor(seconds / 86400) + 'D';
        seconds %= 86400;
    }
    if (!seconds && string.length > 1) {
        return string;
    }
    string += 'T';
    // HOURS
    if (seconds >= 3600) {
        string += Math.floor(seconds / 3600) + 'H';
        seconds %= 3600;
    }
    // MINUTES
    if (seconds >= 60) {
        string += Math.floor(seconds / 60) + 'M';
        seconds %= 60;
    }
    // SECONDS
    if (seconds > 0) {
        string += seconds + 'S';
    }
    else if (string.length <= 2) {
        string += '0S';
    }
    return string;
}
exports.toDurationString = toDurationString;

}).call(this)}).call(this,require("buffer").Buffer)
},{"buffer":4}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICalWeekday = exports.ICalEventRepeatingFreq = void 0;
var ICalEventRepeatingFreq;
(function (ICalEventRepeatingFreq) {
    ICalEventRepeatingFreq["SECONDLY"] = "SECONDLY";
    ICalEventRepeatingFreq["MINUTELY"] = "MINUTELY";
    ICalEventRepeatingFreq["HOURLY"] = "HOURLY";
    ICalEventRepeatingFreq["DAILY"] = "DAILY";
    ICalEventRepeatingFreq["WEEKLY"] = "WEEKLY";
    ICalEventRepeatingFreq["MONTHLY"] = "MONTHLY";
    ICalEventRepeatingFreq["YEARLY"] = "YEARLY";
})(ICalEventRepeatingFreq = exports.ICalEventRepeatingFreq || (exports.ICalEventRepeatingFreq = {}));
var ICalWeekday;
(function (ICalWeekday) {
    ICalWeekday["SU"] = "SU";
    ICalWeekday["MO"] = "MO";
    ICalWeekday["TU"] = "TU";
    ICalWeekday["WE"] = "WE";
    ICalWeekday["TH"] = "TH";
    ICalWeekday["FR"] = "FR";
    ICalWeekday["SA"] = "SA";
})(ICalWeekday = exports.ICalWeekday || (exports.ICalWeekday = {}));

},{}],14:[function(require,module,exports){
"use strict";

(function(){

  var
    buf,
    bufIdx = 0,
    hexBytes = [],
    i
  ;

  // Pre-calculate toString(16) for speed
  for (i = 0; i < 256; i++) {
    hexBytes[i] = (i + 0x100).toString(16).substr(1);
  }

  // Buffer random numbers for speed
  // Reduce memory usage by decreasing this number (min 16)
  // or improve speed by increasing this number (try 16384)
  uuid.BUFFER_SIZE = 4096;

  // Binary uuids
  uuid.bin = uuidBin;

  // Clear buffer
  uuid.clearBuffer = function() {
    buf = null;
    bufIdx = 0;
  };

  // Test for uuid
  uuid.test = function(uuid) {
    if (typeof uuid === 'string') {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
    }
    return false;
  };

  // Node & Browser support
  var crypt0;
  if (typeof crypto !== 'undefined') {
    crypt0 = crypto;
  } else if( (typeof window !== 'undefined') && (typeof window.msCrypto !== 'undefined')) {
    crypt0 = window.msCrypto; // IE11
  }

  if ((typeof module !== 'undefined') && (typeof require === 'function')) {
    crypt0 = crypt0 || require('crypto');
    module.exports = uuid;
  } else if (typeof window !== 'undefined') {
    window.uuid = uuid;
  }

  // Use best available PRNG
  // Also expose this so you can override it.
  uuid.randomBytes = (function(){
    if (crypt0) {
      if (crypt0.randomBytes) {
        return crypt0.randomBytes;
      }
      if (crypt0.getRandomValues) {
        if (typeof Uint8Array.prototype.slice !== 'function') {
          return function(n) {
            var bytes = new Uint8Array(n);
            crypt0.getRandomValues(bytes);
            return Array.from(bytes);
          };
        }
        return function(n) {
          var bytes = new Uint8Array(n);
          crypt0.getRandomValues(bytes);
          return bytes;
        };
      }
    }
    return function(n) {
      var i, r = [];
      for (i = 0; i < n; i++) {
        r.push(Math.floor(Math.random() * 256));
      }
      return r;
    };
  })();

  // Buffer some random bytes for speed
  function randomBytesBuffered(n) {
    if (!buf || ((bufIdx + n) > uuid.BUFFER_SIZE)) {
      bufIdx = 0;
      buf = uuid.randomBytes(uuid.BUFFER_SIZE);
    }
    return buf.slice(bufIdx, bufIdx += n);
  }

  // uuid.bin
  function uuidBin() {
    var b = randomBytesBuffered(16);
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    return b;
  }

  // String UUIDv4 (Random)
  function uuid() {
    var b = uuidBin();
    return hexBytes[b[0]] + hexBytes[b[1]] +
      hexBytes[b[2]] + hexBytes[b[3]] + '-' +
      hexBytes[b[4]] + hexBytes[b[5]] + '-' +
      hexBytes[b[6]] + hexBytes[b[7]] + '-' +
      hexBytes[b[8]] + hexBytes[b[9]] + '-' +
      hexBytes[b[10]] + hexBytes[b[11]] +
      hexBytes[b[12]] + hexBytes[b[13]] +
      hexBytes[b[14]] + hexBytes[b[15]]
    ;
  }

})();

},{"crypto":3}]},{},[11]);
