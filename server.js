const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
const csv = require('./data/crm.csv');
const parse = require('csv-parse');
const demoData = require('./db/demo_data.json');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// configure env variables
dotenv.config();

const dbURI = `mongodb://${process.env.MONGOLAB_USERNAME}:${process.env.MONGOLAB_PASSWORD}@ds049436.mlab.com:49436/data-matching-engine`;

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

app.listen(port);
console.log('Server started');
