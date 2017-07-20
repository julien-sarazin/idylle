const Promise = require('bluebird');

module.exports =  Promise.delay(1500)
.return('promised content');