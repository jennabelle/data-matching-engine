var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
	id: String,
	name: String,
	corporate_names: [],
	fka_names: [],
	products: [],
	urls: [],
	acquirer: String
});

module.exports = mongoose.model( 'Account', accountSchema );