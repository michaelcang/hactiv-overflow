require("dotenv").config();
const kue = require('kue')
const queue = kue.createQueue();

const api_key = process.env.MAILGUN_API;
const DOMAIN = 'sandbox600d0389c5784a49ad10336d69a6bf00.mailgun.org';
const mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

let data = {
  from: 'Hacktiv Overflow <admin@h-overflow.org>',
  subject: 'Registration Successful!',
  text: 'Successfully register in Hactiv Overflow. Please feel free to post questions or help others by answering questions'
};

console.log('masuk runner');

queue.process('sendEmail', function(job, done){
  setTimeout(() => {
    let email = job.data.email
    let name = job.data.name
    data.to = email
    mailgun.messages().send(data, function (error, body) {
      console.log(name, body);
    });
  }, 5000)
});
