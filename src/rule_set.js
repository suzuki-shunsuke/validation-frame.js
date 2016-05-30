'use strict';

let validator = require('validator');

let rule_set = {};

rule_set.required = value => ! validator.isNull(value);
rule_set.min_length = (value, limit) => validator.isLength(value, {min: limit});
rule_set.max_length = (value, limit) => validator.isLength(value, {max: limit});
rule_set.tel = value => validator.matches(value, /[0-9][-0-9]{4,17}/);
rule_set.email = validator.isEmail;
rule_set.whitelist = validator.isWhitelisted;

module.exports = rule_set;
