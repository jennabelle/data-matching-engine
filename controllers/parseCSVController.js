const csv = require('fast-csv');
const fs = require('fs');
const Account = require('../db/models/account.js');
const RegExHelper = require('../helpers/helper_regex.js');

module.exports = function() {

	var readable = fs.createReadStream(__dirname + '/../data/crm.csv');
  	var writable = fs.createWriteStream(__dirname + '/../data/output.txt');

	// first line should be 'Matches'
	writable.write('Matches\n');

	// after query callback
	var writeToOutput = (err, accts) => {

	    if (err) {
	      console.log('error in query! err: ', err);
	    }
	    if (accts.length > 0) {

	    	var tempArray = accts.map(function(acct) { return acct.id; });

	    	writable.write(tempArray.join(', ') + '\n');
	    }
	    else {

	    	// if query returned no records
	      	writable.write( '\n' ); 
	    }
  	};

  	// generator to handle async calls in synchronous way
  	function *findMatches(data) {

		yield Account.find({
				$or: [
					{ name: new RegExp( RegExHelper.escapeRegEx(data.Name), "i" ) },
					{ corporate_names: { $in: [ new RegExp( RegExHelper.escapeRegEx(data.Name), "i" ) ] } },
					{ fka_names: { $in: [ new RegExp( RegExHelper.escapeRegEx(data.Name), "i" ) ] } }
				]}, 'id', writeToOutput);
  	};

  	// parse csv
  	csv
    	.fromStream(readable, { headers: true })
    	.on('data', data => {

    		// call generator
    		const gen = findMatches(data);
    		gen.next();
    	})
    	.on('end', () => {
      		console.log('done!');
    	});
};