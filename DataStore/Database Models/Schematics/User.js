const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
	id: { type: String },
	name: { type: String },
	roles: { type: Array },
	saveDate: { type: Number },
	trustLevel: { type: Number },
}));