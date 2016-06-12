'use strict';

mocha.setup('bdd');

describe('rule_set.bool', () => {
  it('bool("f") is false', () => {
    chai.expect(validation_rule_set.bool('f')).to.be.false;
  });
});

mocha.run();
