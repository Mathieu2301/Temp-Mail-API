const events = require('events');
const util = require('util');
const md5 = require('./md5');
const rq = require('./request');

const TempMailBoxEventDriven = function(username = '', options = {}) {
  // Destructure interval from options.
  const { interval = 1000 } = options;
  // this class variable will track the ready state
  this.ready = false;
  // this class variable will track all the emails that are recieved
  this.emails = [];
  let error = false;
  this.email = null;

  // Suscribe to the ready event within itself
  this.on('ready', () => {
    this.ready = true;
    // Create a setInterval to keep tracking changes
    setInterval(() => {
      rq(`/request/mail/id/${this.emailHash}/format/json`, (rs, error) => {
        // Check if the emails on the server are the same as the ones tracked
        if(rs.length != this.emails.length && !rs.error) {
          const newEmails = [];
          // Filter out emails that are not in the tracked emails
          rs.forEach((email) => {
            let alreadyExists = false;
            // Loop through the saved emails and check if the current email already exists
            for(let i = 0; i < this.emails.length; i++) {
              if(this.emails[i]._id.$oid === email._id.$oid) {
                alreadyExists = true;
                break;
              }
            }
            if(!alreadyExists) {
              // push the new email to saved Emails
              newEmails.push(email);
            }
          });
          if(newEmails.length > 0) {
            this.emit("new", newEmails);
          }
          // Set the emails to that of response
          this.emails = rs;
        }
        if(error) {
          // Emit the error event
          this.emit('error', error);
        }
      });
    }, interval);
  });

  // Fire the setup request
  rq(`/request/domains/format/json`, (domains, err) => {
    if (!err) {
      // Check if the username provided contains the @ symbol
      if (username.includes('@')){
        // Only take the first part of the username with @ symbol
        username = username.split('@')[0];
      }
      // Set the values of the email and email Hash
      this.email = (username.replace(/\ /g, '.') + domains[Math.floor(Math.random() * (domains.length - 1))]).toLowerCase();
      this.emailHash = md5(this.email);
      // Emit the ready event.
      this.emit('ready');
    } else {
      error = err;
      // Emit the error event.
      this.emit('error', error);
    }
  });
}

// Make the TempMailBox constructor inherit event emitter
util.inherits(TempMailBoxEventDriven, events.EventEmitter);

const TempMailBox = function(username = '') {
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

// Export the TempMailBox and TempMail class
module.exports = {
  TempMailBox,
  TempMailBoxEventDriven
}