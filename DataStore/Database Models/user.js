const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	guildID: Number,
	id: Number,
	tag: String,
	nickname: String,
	trust: String,
	roles: Array,
});

module.exports = mongoose.model('User', userSchema);