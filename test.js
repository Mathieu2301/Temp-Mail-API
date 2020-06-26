const TM = require('./main');

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
