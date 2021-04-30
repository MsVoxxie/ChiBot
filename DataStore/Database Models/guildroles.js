const mongoose = require('mongoose');

const guildRolesSchema = mongoose.Schema({
	guildName: String,
	guildID: String,
	assignableRoles: Array,
});

module.exports = mongoose.model('GuildRoles', guildRolesSchema);