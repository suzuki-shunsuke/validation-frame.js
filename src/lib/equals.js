const equals = require('validator').equals;

module.exports = (comparison, value) => equals(value, comparison);
