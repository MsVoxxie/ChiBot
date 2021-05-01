const { MessageEmbed } = require('discord.js');
const { guildFeatures } = require('../../DataStore/Functions/util');

module.exports = {
	name: 'guildinfo',
	aliases: ['gi'],
	description: 'Displays guild information.',
	example: '',
	category: 'Utility',
	usage: '',
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		// Setup variables
		const guild = await message.guild;

		// Embed
		const embed = new MessageEmbed()
			.setAuthor(`Guild Owner› ${guild.owner.user.tag}`, guild.owner.user.displayAvatarURL({ dynamic: true }))
			.setColor(settings.color)
			.setThumbnail(guild.iconURL({ dynamic:true }))
			.addField('**Members›**', `${guild.members.cache.size} / ${bot.toThousands(guild.maximumMembers)}`, true)
			.addField('**Emoji Count›**', guild.emojis.cache.size, true)
			.addField('**Role Count›**', guild.roles.cache.size, true)
			.addField('**Banner›**', `${guild.bannerURL() ? `[Banner URL](${guild.bannerURL({ size: 4096 })})` : 'No Banner Image'}`, true)
			.addField('**Splash Page›**', `${guild.splashURL() ? `[Splash URL](${guild.splashURL({ size: 4096 })})` : 'No Splash Image'}`, true)
			.addField('**Features›**', await guild.features.map(f => guildFeatures[f]).join('\n'), true)
			.addField('**Creation Date›**', `${bot.Timestamp(guild.createdAt)}`, true)
			.setFooter(`ID› ${guild.id}`);

		// Send it
		await message.channel.send({ embed: embed });
	},
};