# Data Matching Engine

Takes your CSV file, parses it, and writes to output.txt a list of matching records in database.

###Screenshots

Input:

<img src="./src/images/Input.png"></span>

Output:

<img src="./src/images/Output.png"></span>

###Getting Started

    npm install

###To Start Server

    npm start

Go to:

    http://localhost:8080/api/setupAccounts

Check that matching records are displayed. Go to:

    db/output.txt

###To Run Unit Tests

    npm run test

###Tech Stack

    Node.js
    ES6
    Babel
    Mongoose.js
    MongoDB
    Express
    Webpack
    fast-csv
    DotEnv