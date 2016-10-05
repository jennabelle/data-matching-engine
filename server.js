const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
// const csv = require('./data/crm.csv');
const parse = require('csv-parse');
const demoData = require('./db/demo_data.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// use environment variables
dotenv.config();

// db connection
const dbURI = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@ds049436.mlab.com:49436/data-matching-engine`;

// serve static files like index.html, css etc.
app.use(express.static(__dirname));

app.get('*', (req, res) => {

  // var output = [];
  // var parser = parse(csv, { delimiter: ',' }); // create the parser

  // parser.on('readable', function() {
  //   while(record = parser.read()) {
  //     output.push(record);
  //   }
  // });

  // // catch any error
  // paraser.on('error', function(err) {
  //   console.log('error: ', err.message);
  // });

  // parser.end();

	res.sendFile(path.resolve(__dirname), 'index.html');
});

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
    demoData.initDatabase(); // clear database, and seed db
  });

});
