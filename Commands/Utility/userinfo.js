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
		const userRoles = member.roles.cache
			.sort((a, b) => b.position - a.position)
			.map(r => {
				if (r.id !== message.guild.id) {return r.name;}
			})
			.filter(x => x !== undefined).join('** | **');

		// Embed
		const embed = new MessageEmbed()
			.setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
			.setColor(settings.color)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.addField('**Status›**', `**${member.user.presence.status}**`, true)
			.addField('**Joined Guild›**', `${bot.Timestamp(member.user.joinedAt)}`, true)
			.addField('**Joined Discord›**', `${bot.Timestamp(member.user.createdAt)}`, true)
			.addField('**Roles›**', `${userRoles}`)
			.setFooter(`User ID› ${member.user.id}`);

		// Send it
		return message.channel.send({ embed: embed });
	},
};