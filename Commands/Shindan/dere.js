const { MessageEmbed } = require('discord.js');
const shindan = require('shindan');

module.exports = {
	name: 'dere',
	aliases: [],
	description: 'What\'s your dere type?',
	example: '',
	category: 'Shindan',
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		const Member = message.mentions.members.first() || message.member;

		shindan.diagnose(1034490, Member.displayName).then(async gen => {

			let urlResult = '';

			if (gen.result.includes('Tsundere')) {
				urlResult = `[${gen.result}](https://the-dere-types.fandom.com/wiki/Tsundere)`;
			}
			else if (gen.result.includes('Yandere')) {
				urlResult = `[${gen.result}](https://the-dere-types.fandom.com/wiki/Yandere)`;
			}
			else if (gen.result.includes('Deredere')) {
				urlResult = `[${gen.result}](https://the-dere-types.fandom.com/wiki/Deredere)`;
			}
			else if (gen.result.includes('Dandere')) {
				urlResult = `[${gen.result}](https://the-dere-types.fandom.com/wiki/Dandere)`;
			}
			else if (gen.result.includes('Bakadere')) {
				urlResult = `[${gen.result}](https://the-dere-types.fandom.com/wiki/Bakadere)`;
			}
			else if (gen.result.includes('Kuudere')) {
				urlResult = `[${gen.result}](https://the-dere-types.fandom.com/wiki/Kuudere)`;
			}
			else if (gen.result.includes('Shundere')) {
				urlResult = `[${gen.result}](https://the-dere-types.fandom.com/wiki/Shundere)`;
			}

			const embed = new MessageEmbed()
				.setDescription(`${urlResult}`)
				.setColor(settings.color)
				.setFooter(`Requested by: ${message.member.displayName}`);

			message.channel.send({ embed: embed });

		});
	},
};