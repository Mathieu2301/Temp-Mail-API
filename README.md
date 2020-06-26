# Temp Mail API
 NodeJS API for temp-mail.org

 No dependencies 💪

___
## Installation

```
npm install temp-mail-api
```

## Examples (test.js)

```javascript
const TM = require('temp-mail-api');

const email1 = new TM('temp-email'); // It will create an address like "temp-email@xxxxxx.xxx"

// Waiting for the email to be ready (recommended)
email1.ready((email, error) => {
  if (!error) {
    console.log(`Email address is ${email}`);

    // Getting email list
    email1.getEmails((emails, error) => {
      if (!error) {
        console.log('Email list :', emails);
      } else console.error(error);
    });

    // Fetching email list every 1 second and log if there is a new email
    setInterval(() => {
      email1.getEmails((emails, error, change) => {
        if (!error) {
          if (change) console.log('New mail !', emails);
        } else console.error(error);
      });
    }, 1000);

  } else console.error(error);
});
```

___
## Problems

 If you have errors in console or unwanted behavior, just reload the page.
 If the problem persists, please create an issue [here](https://github.com/Mathieu2301/Temp-Mail-API/issues).
