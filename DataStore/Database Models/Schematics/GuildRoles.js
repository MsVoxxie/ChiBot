const mongoose = require('mongoose');

module.exports = mongoose.model('GuildRoles', new mongoose.Schema({
	guildName: String,
	guildID: String,
	assignableRoles: Array,
}));