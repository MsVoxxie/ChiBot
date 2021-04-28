const { MessageEmbed } = require('discord.js');
const shindan = require('shindan');

module.exports = {
	name: 'vibecheck',
	aliases: ['vibe'],
	description: 'What\'s your vibe today?',
	example: '',
	category: 'Shindan',
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		const Member = message.mentions.members.first() || message.member;

		shindan.diagnose(1034488, Member.displayName).then(async gen => {

			const embed = new MessageEmbed()
				.setDescription(`${gen.result}`)
				.setColor(settings.color)
				.setFooter(`Requested by: ${message.member.displayName}`);

			message.channel.send({ embed: embed });

		});
	},
};