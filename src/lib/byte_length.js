const isByteLength = require('validator').isByteLength;

function byte_length(options, value) {
  return arguments.length === 1 ? isByteLength(options) : isByteLength(value, options);
}

module.exports = byte_length;
