const isIP = require('validator').isIP;

function ip(version, value) {
  return arguments.length === 1 ? isIP(version) : isIP(value, version);
}

module.exports = ip;
