module.exports = {
	name: 'invite',
	aliases: [],
	description: 'Create a temporary instant invite.',
	category: 'Utility',
	usage: '',
	botPerms: ['CREATE_INSTANT_INVITE', 'MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		// Check if users are allowed to create invites.
		if (!settings.allowUserInvites) return message.reply('\nThis server has disabled user created invitations.').then(s => s.delete({ timeout: 30 * 1000 }));

		// Declarations
		let invchan;
		if (settings.rulesChannel) { invchan = await message.guild.channels.cache.get(settings.rulesChannel); }
		else { invchan = await message.channel; }

		invchan.createInvite({
			temporary: true,
			maxAge: 600,
			maxUses: 1,
			unique: true,
			reason: `${message.member.user.tag} used the Invite command.`,
		}).then(invite => message.reply(`\nHere you go!\nThis invite will expire after ${invite.maxUses} use(s) or 10 minutes.\nhttps://discord.gg/${invite.code}`).then(sent => sent.delete({ timeout: 600000 })));
	},
};