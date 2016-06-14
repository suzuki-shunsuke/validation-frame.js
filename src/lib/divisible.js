const isDivisibleBy = require('validator').isDivisibleBy;

function divisible(number, value) {
  return arguments.length === 1 ? isDivisibleBy(number) : isDivisibleBy(value, number);
}

module.exports = divisible;
