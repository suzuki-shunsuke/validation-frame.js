const contains = require('validator');

module.exports = (seed, value) => contains(value, seed);
