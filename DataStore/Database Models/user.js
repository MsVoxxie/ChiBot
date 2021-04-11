const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	guildName: String,
	guildID: Number,
	id: Number,
	tag: String,
	nickname: String,
	trust: {
		type: Number,
		default: 0,
	},
	roles: {
		type: Array,
		default: [],
	},
});

module.exports = mongoose.model('User', userSchema);