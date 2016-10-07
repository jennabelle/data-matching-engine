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

			// multiple matches found
			for (var i = 0; i < accts.length; i++) {

				writable.write(`id: ${accts[i].id}, name: ${accts[i].name}, urls: ${accts[i].urls}`);

				// only add comma if more matches per row
		        if ( accts[i + 1] !== undefined ) {
					writable.write(', ');
		        }
			}

			// insert new line after ea row
			writable.write( '\n' ); 
	    }
	    else {

	    	// if query returned no records
	      	writable.write( '\n' ); 
	    }
  	};

  	// generator to handle async calls in synchronous ways
  	function *findMatches(data) {

		yield Account.find({ // TODO: Polish!
		    $and: [
				{
					name: new RegExp( RegExHelper.escapeRegEx(data.Name), "i" )
				},
				{ // nothing or matches the end!
					urls: new RegExp( RegExHelper.escapeRegEx(data.URL), "i" )
				}
			]}, 'id name urls', writeToOutput);
  	};

  	// parse csv
  	csv
    	.fromStream(readable, { headers: true })
    	.on('data', data => { console.log('data.Name: ', data.Name, ' data.URL: ', data.URL);

    		// call generator
    		const gen = findMatches(data);
    		gen.next();
    	})
    	.on('end', () => {
      		console.log('done!');
    	});
};





