# validation-frame.js

バリデーションフレームワークです。
次のような特徴を持っています。

* 単体では動かない。ルールセットをコアから切り離すことで、コアとルールセットを独立して開発出来るようにしている。特定のルールセットに依存しない
  ただし、公式のルールセットを別のライブラリ mithril-validation-rule-set で提供しており、簡単にそれを利用できる
* 公式のルールセット(別モジュール)には一通りのバリデーションパターンを標準で持っている([validator.js](https://github.com/chriso/validator.js)に依存)
* カスタムのバリデーションパターンを追加できる
* 各バリデーションパターンのデフォルトパラメータを設定できる(同じ記述を繰り返さなくて済む)
* 各バリデーション対象に複数のバリデーションパターンを優先順位付けて設定できる
* バリデーション後の処理(エラーメッセージの表示など)は自由に出来る(逆に言えば自動ではやってくれない。ユーザに任せている)
* npm及びbowerで公開されている
* MITライセンス

## インストール

```
$ npm install --save-dev validation-frame
```

```
$ bower install --save-dev validation-frame
```

公式のルールセット validation-rule-set もインストールするなら

```
$ npm install --save-dev validation-frame validation-rule-set
```

```
$ bower install --save-dev validation-frame validation-rule-set
```

## ルールセットの組み込み方

validation-frameは単体では動かず、rule-setを組み込む必要がある。

```javascript
let vf = require('validation-frame');
vf.rule_set = require('validation-rule-set');
```

## サンプルコード その1

```javascript
const vf = require('validation-frame');
vf.rule_set = require('validation-rule-set');

const validate = mv.create_validate([{
  'type': 'required',
  'message': '必須です!'
}, {
  'type': 'minlength',
  'message': (value, params) => `${value}`,  // エラーメッセージを動的に生成出来る
  'params': 10  // バリデーション関数とメッセージ関数に渡されるパラメータ(型などは任意)
}, {
  'type': 'custom',  // カスタム関数を設定できる
  'message': 'カスタムです',
  'validate': () => {
  }
}]);

validate('');  // {valid: false, message: '必須です!'}
```

## 非同期のルールの組み込み方

非同期のルールはasync:true を指定する必要がある。
非同期関数としてはpromise/A+仕様をサポートしており、
コールバック関数はサポートしていない。
バリデーション結果がtrueならonFulfilledが、failureならonRejectedがコールされなければならない。

```javascript
const validate = mv.create_validate([{
  type: 'custom',  // カスタム関数を設定できる
  async: 'callback',
  message: 'カスタムです',
  validate: value => {
    const deferred = m.deferred();
    m.request({
      url: '/validate-email'
    }).then(resp => {
      if (resp.result) {
        deferred.resolve(true);
      }
    });
  }
}]);

validate().then(result => {
  console.log(result);  // {valid: false, message: '必須です'}
});
```

非同期関数が一つでもあれば生成されるvalidate関数は
非同期関数となる。

非同期関数は優先して並列に実行される。
その後同期関数も実行される。
同期・非同期関わらずいずれかのバリデーション結果がfalse
ならその場で非同期関数は中断され、結果は破棄される。

```javascript
validate(value, params, ret => {
  if (judge(ret)) {
    
  } else {
    
  }
})
```


## バリデーション関数

戻り値は

* true/false
* otherwise

## ジャッジ関数

バリデーション関数の戻り値を引数にとり、
trueかfalseを返す関数

## メッセージ関数

* 文字列
* 関数

```javascript
function(value, params, ret)

```


---

```javascript
function validate(value, [params]) {
  return {
  
  };
}

function judge(ret) {
  return true;
}

function message(ret, value, [params]) {
  return '';
}
```

## rule.params

validate 及び message にバインドされるパラメータ。
paramsが配列の場合、applyされる

## rule.break\_valid

break\_valid が trueの場合、そのルールが trueな時点で全体が trueになる。

## rule.ignore\_invalid

ignore\_invalid が trueのとき、そのルールがfalseならそのルールは無視される。このオプションをtrueにするなら基本的にbreak\_validもtrueにすべきである。

次の例は空文字か10文字以上の場合trueになる。

```javascript
const validate = mv.create_validate([{
  'type': 'empty',
  'break_valid': true,
  'ignore_invalid': true
}, {
  'type': 'minlength',
  'params': 10
}]);
```

## params.reverse\_judge

params.reverse\_judge が true のとき、rule.judge関数の戻り値が反転される。

次の例はASCII以外の文字を含んでいる場合(あるいは空文字の場合) true になる。

```javascript
const validate = mv.create_validate([{
  'type': 'ascii',
  'reverse_judge': true
}]);
```

## 全ルールへのパラメータ

```javascript
const validate = mv.create_validate([{
  'type': 'custom',
  validate: (value, params, ...args) => {},
  judge: (ret) => {},
  message: (ret, value, params, ...args) => {},
}], 1, 5);
```

## required オプション

requiredルール(type属性が'required'なルール)は以下の特徴を持つ特殊な条件である。

* requiredルールは一番最初にチェックされなければならない
* required以外のルールはrequiredをクリアしていることを前提としている
* validate関数はrequired関数(ゲッター・セッター)を持つ
* requiredがfalseの場合でrequiredルールをクリアしなかった場合、それ以降のルールはチェックされず、true扱いとなる

```javascript
const validate = mv.create_validate([{
  'type': 'required',
}, {
  'type': 'minlength',
  'params': 10,
}]);
validate('');  // {valid: false, message: ''}
validate('ff');  // {valid: false, message: ''}
validate.required(false);
validate('');  // {valid: true, message: ''}
validate('ff');  // {valid: false, message: ''}
```
