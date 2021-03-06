const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ban',
	aliases: [],
	description: 'Ban a user with an optional reason.',
	category: 'Moderation',
	usage: '<@user> <reason>(optional)',
	userPerms: ['BAN_MEMBERS'],
	botPerms: ['BAN_MEMBERS'],
	async execute(bot, message, args, settings) {

		// Declarations
		const toBan = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		const banReason = args.slice(1).join(' ');

		// Checks
		if (!toBan) return message.lineReply('\nPlease provide a user to ban.').then(s => s.delete({ timeout: 30 * 1000 }));
		if (!toBan.bannable) return message.lineReply('\nThis user is not bannable.').then(s => s.delete({ timeout: 30 * 1000 }));
		if (toBan.roles.cache.has('BAN_MEMBERS')) return message.lineReply('\nThis user cannot be banned.');

		// Init Embed
		const embed = new MessageEmbed()
			.setAuthor(message.member.displayName, message.member.user.displayAvatarURL({ dynamic: true }))
			.setDescription(`<@${toBan.id}> has been banned by ${message.member.displayName}\n**Reason›** ${banReason ? banReason : 'No reason provided.'}`)
			.setColor(settings.color);

		try {
			await toBan.ban(`Banned by ${message.member.displayName} for reason: ${banReason}`);
			message.channel.send({ embed: embed });
		}
		catch (e) {
			console.log(e);
		}
	},
};