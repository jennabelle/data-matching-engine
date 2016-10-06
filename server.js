const express = require('express');
const path = require('path');
const csv = require('fast-csv');
const demoData = require('./db/demo_data.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Account = require('./db/models/account.js');

dotenv.config(); // use environment variables

const app = express();

const port = process.env.PORT || 8080;

const dbURI = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@ds049436.mlab.com:49436/data-matching-engine`;

app.use(express.static(__dirname));

app.get('*', (req, res) => {

  var readable = fs.createReadStream(__dirname + '/data/crm.csv');

  var writable = fs.createWriteStream(__dirname + '/data/output.txt');

  // var afterQueryCallback = function(err, person) {
  //   if (err) {
  //     console.log('error in query! err: ', err);
  //   }
  //   writable.write(`id: ${person.id}, name: ${person.name}\n`);
  // }

  csv
    .fromStream(readable, { headers: ['name', 'url'] })
    .on('data', function(data) {
      console.log('data.name: ', data.name);

      Account.find({
        $or: [ 
          {
            name: data.name
          }
        ]
      }, 'id name', function(err, acct) {
        console.log('found acct: ', acct);

        if (err) {
          console.log('error in query! err: ', err);
        }
        if (acct.length > 0) {

          for (var i = 0; i < acct.length; i++) {
            writable.write(`id: ${acct[i].id}, name: ${acct[i].name}, `);
          }

          writable.write('\n'); // insert new line
        }
        else {
          writable.write('\n'); // if query returned no records
        }

      });

    })
    .on('end', function() {
      console.log('done!');
    });

  // readable.pipe(writable);

	res.sendFile(path.resolve(__dirname), 'index.html');
});

// seed database w initial records when server starts
var server = app.listen(port, function() {

  console.log('Server started on port: ', port);

  mongoose.connect(dbURI, function(error) {
    if (error) {
      console.log('\nERROR! Unable to connect to: ', dbURI, ': ', error);
      server.close();
    }
  });

  mongoose.connection.on('connected', function() {
    console.log('successful db connection to: ', dbURI, '\n');
    demoData.initDatabase(); // clear database, then seed db
  });

});
