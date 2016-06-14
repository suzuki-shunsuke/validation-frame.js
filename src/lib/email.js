const isEmail = require('validator').isEmail;

function email(options, value) {
  return arguments.length === 1 ? isEmail(options) : isEmail(value, options);
}

module.exports = email;
