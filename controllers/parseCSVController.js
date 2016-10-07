const csv = require('fast-csv');
const fs = require('fs');
const Account = require('../db/models/account.js');
const RegExHelper = require('../helpers/helper_regex.js');

module.exports = function() {

	var readable = fs.createReadStream(__dirname + '/crm.csv');
  	var writable = fs.createWriteStream(__dirname + '/output.txt');

	// first line should be 'Matches'
	writable.write('Matches\n');

	// after query callback
	var afterQueryCallback = function(err, acct) {

		console.log('\nafter query, found acct: ', acct);

	    if (err) {
	      console.log('error in query! err: ', err);
	    }
	    if (acct.length > 0) {

			// multiple matches found
			for (var i = 0; i < acct.length; i++) {

				writable.write(`id: ${acct[i].id}, name: ${acct[i].name}`);

				// only add comma if more matches per row
		        if (acct[i + 1] !== undefined) {
					writable.write(', ');
		        }
			}

			// insert new line after ea row
			writable.write('\n'); 
	    }
	    else {

	    	// if query returned no records
	      	writable.write('\n'); 
	    }
  	};

  	// parse csv
  	csv
    	.fromStream(readable, { headers: ['name', 'url'] })
    	.on('data', function(data) {

	      	Account.find({ // TODO: Polish!
	        	$or: [ 
	          		{
	            		name: new RegExp( RegExHelper.escapeRegEx(data.name), "i" )
	          		}
	        	]}, 'id name', afterQueryCallback);
    	})
    	.on('end', function() {
      		console.log('done!');
    	});
};