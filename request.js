const https = require('https');

module.exports = function(path, cb = (rs, err) => {}) {    
  const req = https.request({
    hostname: 'api4.temp-mail.org',
    port: 443,
    path,
    method: 'GET'
  }, (res) => {
    let d = '';

    res.on('data', (chunk) => {
      d += chunk;
    });

    res.on('end', () => {
      d = d.toString();
      try {
        if (typeof d !== 'object') d = JSON.parse(d);
      } catch(e) {
        return cb(d, new Error('Can\'t parse server response'));
      }
      cb(d, null);
    });
  });
  
  req.on('error', (e) => cb(e));
  req.end();
}
