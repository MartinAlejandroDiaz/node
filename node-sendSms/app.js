var accountSid = 'AC352d76ce8f0756510ed1a21948962c72';
var authToken = '3d52300e76a8787d0d3ac57aadfccaaa';

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

client.messages.create({
    to:"5491165436867",
    from:"12724443116",
    body:"Hola soy tino avisenme si les llego esto"
})
.then((message) => console.log(message.sid))
.catch((err) => console.log(err));