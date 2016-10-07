const express = require('express');
const path = require('path');
const csv = require('fast-csv');
const demoData = require('./db/demo_data.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Account = require('./db/models/account.js');
const RegExHelper = require('./helpers/helper_regex.js');
const setupController = require('./controllers/setupController.js');

dotenv.config(); // use environment variables

const app = express();

const port = process.env.PORT || 8080;

const dbURI = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@ds049436.mlab.com:49436/data-matching-engine`;

app.use(express.static(__dirname));

// app.get('*', (req, res) => {

//   var readable = fs.createReadStream(__dirname + '/data/crm.csv');
//   var writable = fs.createWriteStream(__dirname + '/data/output.txt');

//   // first line should be 'Matches'
//   writable.write('Matches\n');

//   // after query callback
//   var afterQueryCallback = function(err, acct) {

//     console.log('\nafter query, found acct: ', acct);

//     if (err) {
//       console.log('error in query! err: ', err);
//     }
//     if (acct.length > 0) {

//       // multiple matches found
//       for (var i = 0; i < acct.length; i++) {
//         writable.write(`id: ${acct[i].id}, name: ${acct[i].name}`);

//         // only add comma if more matches per row
//         if (acct[i + 1] !== undefined) {
//           writable.write(', ');
//         }
//       }

//       writable.write('\n'); // insert new line after ea row
//     }
//     else {

//       writable.write('\n'); // if query returned no records
//     }
//   }

//   // parse csv
//   csv
//     .fromStream(readable, { headers: ['name', 'url'] })
//     .on('data', function(data) {

//       Account.find({ // TODO: Polish!
//         $or: [ 
//           {
//             name: new RegExp( RegExHelper.escapeRegEx(data.name), "i" )
//           }
//         ]
//       }, 'id name', afterQueryCallback);
//     })
//     .on('end', function() {
//       console.log('done!');
//     });
// });

// seed database w initial records when server starts
var server = app.listen(port, function() {

  console.log('Server started on port: ', port);

  mongoose.connect(dbURI, function(error) {
    if (error) {
      console.log('\nERROR! Unable to connect to: ', dbURI, ': ', error);
      server.close();
    }
    else {
      console.log('successful db connection to: ', dbURI, '\n');
    }
  });

  setupController(app);

  // mongoose.connection.on('connected', function() {
    
  //   demoData.initDatabase(); // clear database, then seed db
  // });

});
