const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const pick = require('lodash/fp/pick');

exports.md5 = str => crypto.createHash('md5').update(str).digest('hex');

// promise 化
exports.sign = promisify(jwt.sign);
exports.verify = promisify(jwt.verify);
exports.decode = promisify(jwt.decode);

// lodash
exports.pick = pick;
