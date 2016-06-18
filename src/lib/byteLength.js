const isByteLength = require('validator').isByteLength;

function byteLength(options, value) {
  return arguments.length === 1 ? isByteLength(options) : isByteLength(value, options);
}

module.exports = byteLength;
