const isAlphanumeric = require('validator').isAlphanumeric;

function alphaNumeric(locale, value) {
  return arguments.length === 1 ? isAlphanumeric(locale) : isAlphanumeric(value, locale);
}

module.exports = alphaNumeric;
