const md5 = require('./md5');
const rq = require('./request');

module.exports = function(username = '') {
  let error = false;
  let email = false;
  let emailHash = '';
  let lastLen = 0;

  let readyHandlers = [];

  this.ready = function(
    cb = (
      email = '',
      error = new Error('UNKNOWN ERROR'),
    ) => {}
  ) {
    if (!error) {
      if (email) cb(email, null);
      else readyHandlers.push(cb);
    } else cb(null, error);
  }

  this.getEmails = function(
    cb = (
      emails = [],
      error = new Error('UNKNOWN ERROR'),
      change = false,
    ) => {}
  ) {
    if (email && emailHash) {
      rq(`/request/mail/id/${emailHash}/format/json`, (rs, error) => {
        const emails = (rs && rs.error) ? [] : rs;

        const change = (emails && emails.length && lastLen !== emails.length);
        cb(emails, error, change);
        if (change) lastLen = emails.length;
      });
    } else cb(null, new Error('Email is not ready'), false);
  }

  rq(`/request/domains/format/json`, (domains, err) => {
    if (!err) {
      if (username.includes('@')) username = username.split('@')[0];
      email = (username.replace(/\ /g, '.') + domains[Math.floor(Math.random() * (domains.length - 1))]).toLowerCase();
      emailHash = md5(email);
      readyHandlers.forEach((c) => c(email, null));
    } else {
      error = err;
      readyHandlers.forEach((c) => c(null, error));
    }
  });
}
