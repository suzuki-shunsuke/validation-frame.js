let _ = require('lodash');

const vf = {};

/**
 *
 * @param {Array} RULES
 */
function create_validate(RULES) {
  const RULE_SET = this.rule_set;

  /**
   * @param value バリデーション対象の値
   * @param rules 実行するルールのフィルタ
   *   falsyな場合、全ルールが実行される
   *   関数の場合、フィルタ関数として利用される
   *   オブジェクトの場合
   * @return {obj} result
   *   bool result.valid バリデーション結果を表す真偽値
   *   str result.message バリデーション結果を表すメッセージ
   *
   */
  function validate(rules, value) {
    if (arguments.length === 1) {
      value = rules;
      rules = false;
    }
    const len = RULES.length;
    if (rules) {
      if (typeof rules === 'function') {
        for (let i=0; i<len; i++) {
          let rule = RULES[i];
          if (rules(rule)) {
            let ret = _validate({rule: rule, rule_set: RULE_SET, value: value});
            if (!ret.valid) {
              return ret;
            } else {
              continue;
            }
          } else {
            continue;
          }
        }
        return {valid: true, message: ''};
      } else {
        for (let i=0; i<len; i++) {
          let rule = RULES[i];
          if (rules.indexOf(rule.type) === -1) {
            continue;
          } else {
            let ret = _validate({rule: rule, rule_set: RULE_SET, value: value});
            if (!ret.valid) {
              return ret;
            } else {
              continue;
            }
          }
        }
        return {valid: true, message: ''};
      }
      return {valid: true, message: ''};
    } else {
      for (let i=0; i<len; i++) {
        let rule = RULES[i];
        let ret = _validate({rule: rule, rule_set: RULE_SET, value: value});
        if (!ret.valid) {
          return ret;
        } else {
          continue;
        }
      }
      return {valid: true, message: ''};
    }
  }

  /**
   * args
   *   rule
   *   value
   *   rule_set
   */
  function _validate(args) {
    let ret = {};

    let rule_set = args.rule_set;
    let value = args.value;
    let rule = args.rule;
    let params = rule.params;

    if (! rule_set[rule.type](value, params)) {
      ret.valid = false;
      if (typeof rule.message === 'function') {
        ret.message = rule.message(value, params);
      } else {
        ret.message = rule.message;
      }
      return ret;
    } else {
      return {valid: true, message: ''};
    }
  }

  return validate;
}

vf.create_validate = create_validate;

module.exports = vf;
