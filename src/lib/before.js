const isBefore = require('validator').isBefore;

function before(date, value) {
  return arguments.length === 1 ? isBefore(date) : isBefore(value, date);
}

module.exports = before;
