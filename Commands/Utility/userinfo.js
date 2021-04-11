const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'userinfo',
	aliases: ['ui'],
	description: 'Displays a users information.',
	example: '@ChiBot',
	category: 'Utility',
	usage: '@<user>',
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		// Setup variables
		const member = await message.mentions.members.first() || message.member;
		const data = await bot.getMember(member);

		// Embed
		const embed = new MessageEmbed()
			.setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
			.setColor(settings.color)
			.addField('**Status›**', `**${member.user.presence.status}**`, true)
			.addField('**Tag›**', `${data.tag}`, true)
			.addField('**Nickname›**', `${data.nickname}`, true)
			.addField('**Trust›**', `${data.trust.toFixed(2)}`, true)
			.addField('**Joined Guild›**', `${bot.Timestamp(member.user.joinedAt)}`, true)
			.addField('**Joined Discord›**', `${bot.Timestamp(member.user.createdAt)}`, true)
			.addField('**Roles›**', bot.trim(`${data.roles ? data.roles.join(' | ') : 'None Saved'}`, 800))
			.setFooter(`ID› ${data.id}`);

		// Send it
		return message.channel.send({ embed: embed });
	},
};