const { MessageEmbed } = require('discord.js');
const pkg = require('../../package.json');

module.exports = {
	name: 'status',
	aliases: [],
	description: 'Displays Bot Uptime',
	category: 'Other',
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		let DiscordVersion;

		for (const [key, value] of Object.entries(pkg.dependencies)) {
			if (key === 'discord.js') {
				DiscordVersion = `${value}`;
			}
		}

		const embed = new MessageEmbed()
		// .setAuthor(bot.user.tag, bot.user.displayAvatarURL({ dynamic: true }))
			.setTitle(`**───────${bot.user.username}'s Stats & Uptime───────**`)
			.setColor(settings.color)
			.setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
			.addFields(
				{ name: '• Memory Usage •', value: `${Math.round(process.memoryUsage().heapUsed / (1024 * 1024) * 100) / 100} MiB`, inline: true },
				{ name: '• Total Uptime •', value: bot.ActiveFor, inline: true },
				{ name: '• Total Users •', value: `${numberWithCommas(bot.users.cache.size)}`, inline: true },
				{ name: '• Total Guilds •', value: `${numberWithCommas(bot.guilds.cache.size)}`, inline: true },
				{ name: '• Total Channels •', value: `${bot.channels.cache.size}`, inline: true },
				{ name: '• Discord.js Ver •', value: `${DiscordVersion}`, inline: true },
				{ name: '• Node Version •', value: `${process.version}`, inline: true },
				{ name: '• Bot Version •', value: `${pkg.version}`, inline: true },
				{ name: '• Owner Tag •', value: '👑 Ms.Voxxie #0001', inline: true },
			)
			.setTimestamp();

		message.channel.send({ embed: embed });

	},
};

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}