const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const setupController = require('./controllers/setupController.js');

dotenv.config(); // use environment variables

const app = express();

const port = process.env.PORT || 8080;

const dbURI = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@ds049436.mlab.com:49436/data-matching-engine`;

app.use(express.static(__dirname));

// start server
var server = app.listen(port, () => {

  console.log('Server started on port: ', port);

  // connect to db
  mongoose.connect(dbURI, error => {

    if (error) {
      console.log('\nERROR! Unable to connect to: ', dbURI, ': ', error);
      server.close();
    }
    else {
      console.log('successful db connection to: ', dbURI, '\n');
    }
  });

  // set up app
  setupController(app);
});
