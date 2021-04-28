const Discord = module.require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	name: 'warnlist',
	aliases: ['wl'],
	description: 'Check this guilds warning list.',
	category: 'Moderation',
	userPerms: ['BAN_MEMBERS'],
	botPerms: ['BAN_MEMBERS'],
	async execute(bot, message, args, settings) {

		const member = message.member;
		const warns = await JSON.parse(fs.readFileSync(path.join(__dirname, '../../DataStore/Warnings/', './Warnings.json'), 'utf8'));
		const getwarns = warns[member.guild.id];

		if (!getwarns) return message.lineReply('\nThere are no warned users in this guild.').then(s => s.delete({ timeout: 30 * 1000 }));

		const warnlist = new Discord.MessageEmbed()
			.setColor(settings.color)
			.setTitle(`__**${member.guild.name}'s Warnings**__`);

		Object.entries(getwarns).forEach(([k, users]) => {
			warnlist.addField(`${users.username}`, `**User ID ›** ${users.userid || 'User ID Missing'}\n**Warning Count ›** ${users.warnings}\n**Reasons ›**\n${users.reasons ? users.reasons.map(r => { return r; }).join('\n') : 'No reasons Found.'}\n**Date ›** ${users.timestamp || 'Date Missing.'}`);
		});

		message.channel.send({ embed: warnlist });
	},
};