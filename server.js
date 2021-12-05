const mysql = require('mysql'); // mysql
const delay = require('delay'); // delay
const formidable = require('formidable'); // formidable
const nodemailer = require('nodemailer'); // nodemailer
const fs = require('fs-extra'); // superset of fs
const http = require('http');
const url = require('url');

//  VALS
const PORT = 8080;
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  use_authentication: false,
  auth: {
    user: 'user@mail.com',
    pass: 'password',
  },
});
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'jaybee',
  password: 'jay',
  database: 'records',
});

function record(sender, target, subj, msg) {
  conn.query('INSERT INTO records (sender, target, subject, body) VALUES (?, ?, ?, ?)', [sender, target, subj, msg], (err, result) => {
    if (err) {
      console.log(err.code);
    } else {
      console.log(result);
    }
  });
}

function send(from, dest, subj, msg) {
  //  send email
  transporter.sendMail({
    sender: from,
    to: dest,
    subject: subj,
    body: msg,
    //  file attachement would be here if i could get it to work
  });
}


//  BEGIN
fs.readFile('./index.html', (err, index) => {
  if (err) throw err;
  http.createServer( (req, res) => {
    res.writeHeader(200, {'Content-Type': 'text/html'});
    res.write(index); // load webpage

    //  show ny queries
    const Query = url.parse(req.url, true).pathname;
    console.log(Query);

    //  process form data
    if (req.url == '/send' && req.method == 'POST') { //  check url
      new formidable.IncomingForm().parse(req) //  process form
          .on('field', (name, field) => { // field event
            console.log('Field', name, field);
            let from;
            let dest;
            let subj;
            let msg;
            if (name == 'from') {
              from = field;
            }
            if (name == 'to') {
              dest = field;
            }
            if (name == 'subject') {
              subj = field;
            }
            if (name == 'message') {
              msg = field;
            }
            //  store record in database
            delay(2000, record(from, dest, subj, msg));
            //  send email after 2s delay
            delay(10000, send(from, dest, subj, msg));
          })
          .on('fileBegin', (name, file) => { //  file begin event
            form.on('fileBegin', (name, file) => {
              file.path = __dirname +'/uploads/'+ file.name;
            });
          })
          .on('file', (name, file) => { //  file event
            console.log('Uploaded file', name, file);
          })
          .on('error', (err) => { //  error event
            console.error('Error', err);
            throw err;
          });
    }
    res.end();
  }).listen(PORT);
});
//  END
