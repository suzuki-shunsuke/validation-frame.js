function required(value) {
  if (value === '' || value == null) {
    return false;
  } else if (Array.isArray(value) && !value.length) {
    return false;
  }
  return true;
}

module.exports = {
  validate: required,
  message: 'Required',
  judge: ret => ret,
  enabled: true,
};
