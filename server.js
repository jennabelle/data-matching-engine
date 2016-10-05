const express = require('express');
const path = require('path');
// const csv = require('./data/crm.csv');
const csv = require('csv');
const demoData = require('./db/demo_data.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config(); // use environment variables

const app = express();
const port = process.env.PORT || 8080;
const dbURI = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@ds049436.mlab.com:49436/data-matching-engine`;

app.use(express.static(__dirname));

app.get('*', (req, res) => {

  var readable = fs.createReadStream(__dirname + '/data/crm.csv', { encoding: 'utf8' });

  var writable = fs.createWriteStream(__dirname + '/data/output.txt');

  readable.on('data', function(chunk) {
    console.log(chunk);
    writable.write(chunk);
  });

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
