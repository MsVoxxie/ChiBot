const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'getMember',
	aliases: ['gm'],
	description: '',
	example: '',
	category: 'Owner Only',
	usage: '',
	hidden: true,
	ownerOnly: true,
	userPerms: [''],
	botPerms: [''],
	async execute(bot, message, args, settings) {

		// Definitions
		const member = message.mentions.members.first();
		const data = await bot.getMember(member);

		// Embed
		const embed = new MessageEmbed()
			.setAuthor(`${data.tag}'s Database Save`, member.user.displayAvatarURL({ dynamic: true }))
			.setColor(settings.color)
			.addField('**ID›**', `**${data.id}**`, false)
			.addField('**TAG›**', `${data.tag}`, false)
			.addField('**NICKNAME›**', `${data.nickname}`, false)
			.addField('**TRUST›**', `${data.trust.toFixed(2)}`, false)
			.addField('**ROLES›**', `${data.roles ? data.roles.join(' | ') : 'None Saved'}`);

		// Send it
		return message.channel.send({ embed: embed });

	},
};