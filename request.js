const https = require('https');
const fakeUserAgent = require('fake-useragent');

module.exports = function request(path, cb = (rs, err) => ({ rs, err })) {
  const req = https.request({
    hostname: 'api4.temp-mail.org',
    port: 443,
    path,
    method: 'GET',
    // Adding fake user agent string to bypass cloudflare
    headers: {
      'user-agent': fakeUserAgent(),
    },
  }, (res) => {
    let d = '';

    res.on('data', (chunk) => {
      d += chunk;
    });

    res.on('end', () => {
      d = d.toString();
      try {
        if (typeof d !== 'object') d = JSON.parse(d);
      } catch (e) {
        return cb(d, new Error('Can\'t parse server response'));
      }
      return cb(d, null);
    });
  });

  req.on('error', (e) => cb(e));
  req.end();
};
