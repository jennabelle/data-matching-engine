const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var accountSchema = new Schema({
	id: { type: String, required: true, unique: true, index: true }, // external key
	name: { type: String, required: true },
	corporate_names: [],
	fka_names: [],
	products: [],
	urls: [],
	acquirer: String
});

module.exports = mongoose.model( 'Account', accountSchema );