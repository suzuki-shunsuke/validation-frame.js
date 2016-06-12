'use strict';

require('core-js/fn/object/assign');
require('core-js/library/fn/promise');

const _ = {
  clone: require('lodash.clone'),
  defaults: require('lodash.defaults'),
  forEach: require('lodash.foreach'),
};

/**
 * vf.create_validate
 * vf.rule_set ルールタイプ名 -> {
 *   validate: 関数, params: パラメータ, message: メッセージ,
 *   judge: ジャッジ関数, validate: バリデート関数, async: boolean}
 */
const vf = {};

vf.default_judge = (ret) => {
  if (ret === true || ret === false) {
    return ret;
  }
  return Boolean(ret.valid);
};

function create_judge(judge) {
  return judge ? judge : vf.default_judge;
};

vf.default_message = ret => {
  return ret.message ? ret.message : '';
};

function create_message(message, has_params, params) {
  const t = typeof message;
  if (t === 'string') {
    return () => message;
  } else if (t === 'function') {
    if (has_params) {
      if (Array.isArray(params)) {
        return (ret, value) => {
          return message.bind(rule, ret, value).apply(params);
        };
      } else {
        return (ret, value) => message(ret, value, params);
      }
    } else {
      return message;
    }
  } else {
    return vf.default_message;
  }
};

function _create_validate(validate, has_params, params) {
  if (has_params) {
    return value => validate(value, params);
  } else {
    return validate;
  }
}

function make_async(validate, judge, message) {
  return value => {
    const ret = validate(value);
    return judge(ret) ? Promise.resolve(ret) : Promise.reject(new Error(message(ret, value)));
  };
}

/**
 *
 * @param {Array} rules
 *   {type: ルールタイプ名, params: パラメータ, message: メッセージ
 *    judge: ジャッジ関数, validate: バリデート関数, async: boolean}
 */
function create_validate(rules) {
  const rule_set = {};
  _.forEach(this.rule_set, (value, key) => {
    const t = typeof value;
    if (t === 'function') {
      rule_set[key] = {validate: value};
    } else {
      rule_set[key] = value;
    }
  });
  const LEN = rules.length;
  const rules_ = [];
  
  rules.forEach(r => {
    const t = typeof r;
    let rule;
    if (t === 'string') {
      rule = rule_set[r];
    } else if (t === 'function') {
      rule = {'validate': r};
    } else {
      rule = _.clone(r);
      if (r.type && rule_set[r.type]) {
        _.defaults(rule, rule_set[r.type]);
      }
    }
    const has_params = 'params' in rule;
    rule.message = create_message(rule.message, has_params, rule.params);
    rule.judge = create_judge(rule.judge);
    rule.validate = _create_validate(rule.validate, has_params, rule.params);
    rules_.push(rule);
  });
  const ASYNC = rules_.some(rule => rule.async);
  if (ASYNC) {
    rules_.forEach(rule => {
      if (!rule.async) {
        rule.validate = make_async(rule.validate, rule.judge, rule.message);
      }
    });
  }

  /**
   * @param {} value バリデーション対象の値
   * @return {Object} result
   *   bool result.valid バリデーション結果を表す真偽値
   *   str result.message バリデーション結果を表すメッセージ
   *
   */
  function validate(value) {
    if (ASYNC) {
      return Promise.all(rules_.map(rule => {
        return rule.validate(value);
      }));
    } else {
      for (let i=0; i<LEN; i++) {
        const rule = rules_[i];
        const ret = rule.validate(value);
        if (rule.judge(ret)) {
          if (rule.break_valid) {
            return {valid: true, message: ''};
          }
          continue;
        } else {
          if (rule.ignore_failure) {
            continue;
          }
          return {valid: false, message: rule.message(ret, value)};
        }
      }
      return {valid: true, message: ''};
    }
  }

  return validate;
}

vf.create_validate = create_validate;

module.exports = vf;
