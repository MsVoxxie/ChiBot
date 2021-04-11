const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Sugar = require('sugar');

module.exports = {
	name: 'time',
	aliases: [],
	description: 'Check how long until a date.',
	example: 'until December 25th',
	category: 'Utility',
	usage: ' until | since | when <date>',
	args: true,
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		// Setup Embed
		const embed = new MessageEmbed()
			.setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
			.setColor(settings.color);

		// Declarations
		const humanDate = args.slice(1).join(' ');
		const convertedDate = Sugar.Date.create(humanDate);
		let finalConversion;

		// Until
		if (args[0] === 'until') {
			finalConversion = `**${args[0]}** | ${humanDate} is ${moment().to(convertedDate)}.`;
			embed.setDescription(finalConversion);
		}

		// Since
		if (args[0] === 'since') {
			finalConversion = `**${args[0]}** | ${humanDate} was ${moment().to(convertedDate)}.`;
			embed.setDescription(finalConversion);
		}

		// When
		if (args[0] === 'when' | 'what') {
			finalConversion = `**${args[0]}** | ${humanDate} will be ${bot.Timestamp(convertedDate)}.`;
			embed.setDescription(finalConversion);
		}

		// Send that data!
		message.channel.send({ embed: embed });

	},
};