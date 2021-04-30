const { MessageEmbed } = require('discord.js');
const { Emoji } = require('../../DataStore/Functions/util');

module.exports = {
	name: 'getrole',
	aliases: ['gr'],
	description: '',
	example: '',
	category: '',
	usage: '',
	hidden: true,
	ownerOnly: true,
	async execute(bot, message, args, settings) {

		// Definitions
		let split = args[0];
		const guild = await bot.getRoles(message.guild);
		const Roles = guild.assignableRoles.sort((a, b) => b.position - a.position);
		const finalRoles = [];

		// Split Check
		if(!split) {
			split = 10;
		}

		if(!Roles.length) return message.lineReply('This guild does not have it\'s roles set up.').then(s => s.delete({ timeout: 30 * 1000 }));

		Object.entries(Roles).forEach(async ([k, role]) => {
			finalRoles.push(role.name);
		});

		const SplitArray = await bot.chunkArray(finalRoles, split);

		const firstEmbed = new MessageEmbed()
			.setColor(settings.color)
			.setTitle(`**${message.guild.name}'s Roles**`);
		for(let i = 0; i < SplitArray.length; i++) {
			firstEmbed.addField(`Role List ${i + 1}`, SplitArray[i].join('\n'), true);
		}
		message.channel.send({ embed:firstEmbed });
	},
};