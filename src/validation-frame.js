'use strict';

require('core-js/fn/object/assign');
require('core-js/library/fn/promise');

const _ = {
  clone: require('lodash.clone'),
  defaults: require('lodash.defaults'),
  forEach: require('lodash.foreach'),
  find: require('lodash.find'),
};

/**
 * vf.createValidate
 * vf.ruleSet ルールタイプ名 -> {
 *   validate: 関数, params: パラメータ, message: メッセージ,
 *   judge: ジャッジ関数, validate: バリデート関数, async: boolean}
 */
const vf = {};

vf.defaultJudge = (ret) => {
  if (ret === true || ret === false) {
    return ret;
  }
  return Boolean(ret.valid);
};

function createJudge(judge, reverseJudge) {
  if (!judge) {
    judge = vf.defaultJudge;
  }

  return reverseJudge ? ret => ! judge(ret) : judge;
};

vf.defaultMessage = ret => {
  return ret.message ? ret.message : '';
};

function createMessage(message, hasParams, params, ...commonParams) {
  const t = typeof message;
  if (t === 'string') {
    return () => message;
  } else if (t === 'function') {
    if (hasParams) {
      if (Array.isArray(params)) {
        return (ret, value) => {
          return message(ret, value, ...params.concat(commonParams));
        };
      } else {
        return (ret, value) => message(ret, value, params, ...commonParams);
      }
    } else {
      return (ret, value) => message(ret, value, ...commonParams);
    }
  } else {
    return vf.defaultMessage;
  }
};

function _createValidate(validate, hasParams, params, ...commonParams) {
  if (hasParams) {
    return value => validate(value, params, ...commonParams);
  } else {
    return value => validate(value, ...commonParams);
  }
}

function makeAsync(validate, judge, message) {
  return value => {
    const ret = validate(value);
    return judge(ret) ? Promise.resolve(ret) : Promise.reject(new Error(message(ret, value)));
  };
}

let ruleSet_ = {};

function ruleSet(items) {
  if (arguments.length) {
    const items_ = {};
    _.forEach(items, (value, key) => {
      const t = typeof value;
      if (t === 'function') {
        items_[key] = {validate: value};
      } else {
        items_[key] = value;
      }
    });
    ruleSet_ = items_;
  } else {
    return ruleSet_;
  }
}

vf.ruleSet = ruleSet;

function convertRule(rule) {
  const t = typeof rule;
  let rule_;
  if (t === 'string') {
    rule_ = _.clone(ruleSet_[rule]);
  } else if (t === 'function') {
    rule_ = {validate: rule};
  } else {
    rule_ = _.clone(rule);
    if (rule.type && ruleSet_[rule.type]) {
      _.defaults(rule_, ruleSet_[rule.type]);
    }
  }
  const hasParams = 'params' in rule_;
  rule_.message = createMessage(rule_.message, hasParams, rule_.params);
  rule_.judge = createJudge(rule_.judge, rule_.reverseJudge);
  rule_.validate = _createValidate(rule_.validate, hasParams, rule_.params);

  return rule_;
}


/**
 *
 * @param {Array} rules
 *   {type: ルールタイプ名, params: パラメータ, message: メッセージ
 *    judge: ジャッジ関数, validate: バリデート関数, async: boolean}
 */
function createValidate(rules, ...params) {
  const ruleSet = this.ruleSet();
  
  const rules_ = rules.map(e => convertRule(e));

  let required_rule = _.find(rules_, {type: 'required'});
  if (required_rule) {
    if (!('enabled' in required_rule)) {
      required_rule.enabled = true;
    }
  } else {
    required_rule = _.clone(ruleSet.required);
    required_rule.type = 'required';
    required_rule = convertRule(required_rule);
    required_rule.enabled = false;
    rules_.unshift(required_rule);
  }

  const ASYNC = rules_.some(rule => rule.async);
  if (ASYNC) {
    rules_.forEach(rule => {
      if (!rule.async) {
        rule.validate = makeAsync(rule.validate, rule.judge, rule.message);
      }
    });
  }

  const LEN = rules_.length;

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
          if (rule.breakValid) {
            return {valid: true, message: ''};
          }
          continue;
        } else {
          if (rule.ignoreInvalid) {
            continue;
          }
          if (rule.type === 'required' && !rule.enabled) {
            return {valid: true, message: ''};
          }
          return {valid: false, message: rule.message(ret, value)};
        }
      }
      return {valid: true, message: ''};
    }
  }

  function required_(flag) {
    if (arguments.length) {
      required_rule.enabled = flag;
      return flag;
    } else {
      return required_rule.enabled;
    }
  }

  validate.required = required_;

  return validate;
}

vf.createValidate = createValidate;

module.exports = vf;
