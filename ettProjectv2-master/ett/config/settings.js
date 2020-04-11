const moment = require('moment-timezone');

const SERVICE_ACCT_ID = 'admin-702@ettmern.iam.gserviceaccount.com';
const TIMEZONE = moment.tz.guess(true);
const key = require('./googleapi-key.json').private_key;

module.exports.serviceAcctId = SERVICE_ACCT_ID;
module.exports.timezone = TIMEZONE;
module.exports.key = key;
