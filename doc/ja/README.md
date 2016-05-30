# validation-frame.js

バリデーションフレームワークです。
次のような特徴を持っています。

* 単体では動かない。ルールセットをコアから切り離すことで、コアとルールセットを独立して開発出来るようにしている。特定のルールセットに依存しない
  ただし、公式のルールセットを別のライブラリ mithril-validation-rule-set で提供しており、簡単にそれを利用できる
* 公式のルールセット(別モジュール)には一通りのバリデーションパターンを標準で持っている([validator.js](https://github.com/chriso/validator.js)に依存)
* カスタムのバリデーションパターンを追加できる
* 各バリデーションパターンのデフォルトパラメータを設定できる(同じ記述を繰り返さなくて済む)
* 各バリデーション対象に複数のバリデーションパターンを優先順位付けて設定できる
* 各バリデーション対象に設定したバリデーションパターンのうち、一部のパターンのみ選択的に実行可能
  (これにより、バリデーションの実行タイミングをパターンごとに変更できる)
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
let vf = require('validation-frame');
vf.rule_set = require('validation-rule-set');

let validate = mv.create_validate([{
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
validate(rule => rule.type === 'required', '');  // {valid: false, message: '必須です!'}
validate(['required'], '');  // {valid: false, message: '必須です!'}
```
