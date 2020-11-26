const { TempMailBox, TempMailBoxEventDriven } = require('./main');
const CHANCE = require('chance');

const chance = new CHANCE();
/**
 * This is the event driven mailbox section
 */
// This will generate a random first name and then a random email.
const eventDrivenInbox = new TempMailBoxEventDriven(chance.first());

// Waiting for the email to be ready (recommended)
eventDrivenInbox.on('ready', () => {
  console.log(`Your event driven email inbox is ready!`);
  console.log(eventDrivenInbox);
});

eventDrivenInbox.on('new', (newEmails) => {
  console.log("Received new Emails in event driven inbox");
  console.table(newEmails);
});

eventDrivenInbox.on('error', (error) => {
  console.error(`Error in event driven inbox ${error}`);
});

/**
 * This is the regular temp-mail box section
 */
const email1 = new TempMailBox('temp-email'); // It will create an address like "temp-email@xxxxxx.xxx"

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