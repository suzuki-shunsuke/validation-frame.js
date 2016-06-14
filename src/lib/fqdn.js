const isFQDN = require('validator').isFQDN;

function fqdn(options, value) {
  return arguments.length === 1 ? isFQDN(options) : isFQDN(value, options);
}

module.exports = fqdn;
