const ms = require('ms');
module.exports = {
	name: 'invite',
	aliases: [],
	description: 'Create an instant invite that has [x] Use and Expires in One(1) Hour.',
	category: 'Utility',
	usage: '<num>',
	example: '3 (Creates an invite with three uses)',
	botPerms: ['CREATE_INSTANT_INVITE', 'MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		// Check if users are allowed to create invites.
		if (!settings.allowUserInvites) return message.lineReply('\nThis server has disabled user created invitations.').then(s => s.delete({ timeout: 30 * 1000 }));

		// Check if more than one use should be set.
		let uses;

		if (args[0] && !isNaN(args[0]) && args[0] > 0) {
			uses = Math.floor(args[0]);
		}
		else {
			uses = 1;
		}

		if (uses > 100) {
			return message.lineReply('Maximum of 10 allowed, please try again.');
		}

		// Declarations
		let invchan;
		if (settings.rulesChannel) { invchan = await message.guild.channels.cache.get(settings.rulesChannel); }
		else { invchan = await message.channel; }

		invchan.createInvite({
			temporary: false,
			maxAge: 3600,
			maxUses: uses,
			unique: true,
			reason: `${message.member.user.tag} used the Invite command.`,
		}).then(invite => message.lineReply(`\nHere you go!\nThis invite will expire after ${invite.maxUses} use(s) or ${ms(ms(`${invite.maxAge}s`))}.\nhttps://discord.gg/${invite.code}`).then(sent => sent.delete({ timeout: invite.maxAge * 1000 })));
	},
};