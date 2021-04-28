const { MessageEmbed } = require('discord.js');
const shindan = require('shindan');

module.exports = {
	name: 'randomoc',
	aliases: ['oc'],
	description: 'Get your brand new OC.',
	example: '',
	disabled: true,
	category: 'Shindan',
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		const Member = message.mentions.members.first() || message.member;

		shindan.diagnose(664402, Member.displayName).then(async gen => {
			const newOC = gen.result.split('\n');
			newOC.shift();

			const embed = new MessageEmbed()
				.setAuthor(`${Member.displayName}'s New OC!`, Member.user.displayAvatarURL({ dynamic: true }))
				.setDescription(newOC)
				.setColor(settings.color)
				.setFooter(`Requested by: ${message.member.displayName}`);

			message.channel.send({ embed: embed });

		});
	},
};