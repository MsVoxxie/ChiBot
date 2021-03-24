const mongoose = require('mongoose');
const { defaultSettings: defaults } = require('./databaseDefaults');

const guildSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	guildID: String,
	guildName: String,
	prefix: {
		type: String,
		default: defaults.prefix,
	},
	welcomeMessage: {
		type: String,
		default: defaults.welcomeMessage,
	},
	color: {
		type: String,
		default: defaults.color,
	},
	allowUserInvites: {
		type: Boolean,
		default: defaults.allowUserInvites,
	},
	shouldLog: {
		type: Boolean,
		default: defaults.shouldLog,
	},
	shouldWelcome: {
		type: Boolean,
		default: defaults.shouldWelcome,
	},
	profanityFilter: {
		type: Boolean,
		default: defaults.profanityFilter,
	},
	pinboardEnabled: {
		type: Boolean,
		default: defaults.pinboardEnabled,
	},
	ownerRole: {
		type: String,
		default: defaults.ownerRole,
	},
	adminRole: {
		type: String,
		default: defaults.adminRole,
	},
	modRole: {
		type: String,
		default: defaults.modRole,
	},
	welcomeChannel: {
		type: String,
		default: defaults.welcomeChannel,
	},
	rulesChannel: {
		type: String,
		default: defaults.rulesChannel,
	},
	auditLogChannel: {
		type: String,
		default: defaults.auditLogChannel,
	},
	roleAssignChannel: {
		type: String,
		default: defaults.roleAssignChannel,
	},
	streamNotifChannel: {
		type: String,
		default: defaults.streamNotifChannel,
	},
	pinboardChannel: {
		type: String,
		default: defaults.pinboardChannel,
	},
	savedRoles: {
		type: Array,
		default: [],
	},
});

module.exports = mongoose.model('Guild', guildSchema);