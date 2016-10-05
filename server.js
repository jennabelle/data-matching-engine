const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
const csv = require('./data/crm.csv');
const parse = require('csv-parse');
const estraverse = require('estraverse');

app.use(express.static(__dirname));

app.get('*', (req, res) => {
  var output = [];
  var parser = parse(csv, { delimiter: ',' }); // create the parser

  parser.on('readable', function() {
    while(record = parser.read()) {
      output.push(record);
    }
  });

  // catch any error
  paraser.on('error', function(err) {
    console.log('error: ', err.message);
  });

  parser.end();
	res.sendFile(path.resolve(__dirname), 'index.html');
});

app.listen(port);
console.log('Server started');
