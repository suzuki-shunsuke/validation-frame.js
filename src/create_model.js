const m = require('mithril');
const _ = {
  forEach: require('lodash.foreach'),
  clone: require('lodash.clone'),
};

const vp = require('./validation-prop.js');
vp.ruleSet(require('./validation-rule-set.js'));
vp.prop = m.prop;

/**
 * @param resources_name: リソース名(複数形)。getやputなどのリクエスト先URLの一部として使われる
 * @param default_values: フィールド名 -> デフォルト値
 * @param relations: フィールド名 -> 関連モデルクラスかそのリスト
 *   コンストラクタで関連モデルのインスタンスも初期化してくれる
 */
function create_model(resources_name, fields) {
  // const props = {};
  // const default_values = {};
  // _.forEach(fields, (value, key) => {
  //   props[key] = vp.createProp(value[1]);
  //   default_values[key] = value[0];
  // });

  let new_instance_key = 0;

  /**
  * Modelクラスのベースクラス
  * Attrs:
  *   relations: { フィールド名 -> Model or [Model]}
  *     値が[Model]の場合、関連モデルのインスタンスが複数のことを表す
  */
  class Model {
    /**
     * @param data: モデルインスタンスの初期データ(継承クラスのコンストラクタ)
     *
     * @example
     * class User extends Model {
     *   constructor(data) {
     *     super({
     *       'id': null, 'name': ''
     *     }, {
     *       'items': [Item],
     *       'father': Father
     *     }, data);
     *   }
     * }
     */
    constructor(data={}) {
      const key_ = new_instance_key++;
      this.key_ = () => key_;
      const relations = this.constructor.relations;

      _.forEach(relations, (relation, field_name) => {
        if (Array.isArray(relation)) {
          const model = relation[0];
          const ds = data[field_name];
          this[field_name] = m.prop(ds ? ds.map(d => new model(d)) : []);
        } else {
          const d = data[field_name];
          // nullではなく new relation() とすると、
          // 相互参照している場合に無限ループが起こってしまう
          this[field_name] = m.prop(d ? new relation(d) : null);
        }
      });

      _.forEach(fields, (value, key) => {
        const rules = value[1];
        rules.filter(rule => rule.modelAppended).forEach(rule => {
          if ('params' in rule) {
            if (Array.isArray(rule.params)) {
              rule.params.push(this);
            } else {
              rule.params = [rule.params, this];
            }
          } else {
            rule.params = [this];
          }
        });
        const prop = vp.createProp(rules);
        this[key] = prop(value[0]);
      });

      _.forEach(data, (value, field_name) => {
        if (!(field_name in relations)) {
          if (field_name in fields) {
            this[field_name](value);
          } else {
            this[field_name] = vp.prop(value);
          }
        }
      });
    }

    // TODO: 要リファクタリング
    cloneDeep() {
      return new this.constructor(JSON.parse(JSON.stringify(this)));
    }

    toObject(fields) {
      const ret = {};
      if (!fields) {
        fields = Object.keys(default_values);
      }
      fields.forEach(field => {
        ret[field] = this[field]();
      });
      return ret;
    }

    valid() {
      return Object.keys(fields).every(key => this[key].valid());
    }

    validate() {
      const results = {};
      Object.keys(fields).forEach(key => {
        results[key] = this[key].validate();
      });
      return {
        valid: Object.keys(results).every(key => results[key].valid),
        fields: results,
      };
    }
  }

  Model.relations = {};

  return Model;
}

module.exports = create_model;
