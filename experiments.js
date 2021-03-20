/* eslint-disable */
const md5 = require('./md5');

const toBase64 = (str) => Buffer.from(str, 'utf8').toString('base64');
const toUtf8 = (str) => Buffer.from(str, 'base64').toString('utf8');

const shift = (str, i) => str.split('').map(c => String.fromCharCode(c.charCodeAt(0) + i)).join('');

const test = (email, rsB64) => {
  const md5Mail = md5(email);
  const result = toUtf8(rsB64);

  for (let i = 19500; i < 21700; i++) { // 20550; i < 20650
    const val = shift(md5Mail, i);
    if (val === result) return console.log('Found !', i);
    console.log(i, val);
  }

  console.log(99999, result);

  return;
};

test(
  'bijom55225@heroulo.com',
  '5YOv5YK55YOu5YOo5YOs5YOi5YOi5YK+5YOt5YOt5YOq5YK/5YOq5YOs5YK+5YOi5YOi5YK45YOj5YOt5YK/5YOp5YOj5YOp5YOr5YOq5YOv5YK65YK/5YK95YOr5YK5',
);

// const TM = require('./main');

// const email1 = new TM('temp-email'); // It will create an address like "temp-email@xxxxxx.xxx"
