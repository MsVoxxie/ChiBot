const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'topmembers',
	aliases: ['top'],
	description: 'View top members trust levels.',
	category: 'Moderation',
	usage: '',
	userPerms: ['MANAGE_MESSAGES'],
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		// Get each member
		const Trust = await Promise.all(message.guild.members.cache.map(async mem => {
			const GM = await bot.getMember(mem);
			return GM;
		}));

		// Sort by trust level
		Trust.sort(function(a, b) {
			return b.trust - a.trust;
		});

		// Conver to usable array
		const Final = await Promise.all(Trust.map(async Members => {
			return { tag: Members.tag, nick: Members.nickname, trust: Members.trust };
		}));

		// Create Embed
		const embed = new MessageEmbed()
			.setTitle('**Top 6 Highest Trust Levels**')
			.setColor(settings.color)
			.setTimestamp();

		// Slice and apply fields
		Final.slice(0, 6).forEach(data => {
			embed.addField(`Tag› ${data.tag}\nNick› ${data.nick}`, `**Trust› ${data.trust}**`, false);
		});

		message.channel.send({ embed: embed });

	},
};