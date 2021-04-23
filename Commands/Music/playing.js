const { MessageEmbed } = require('discord.js');
const { createBar } = require('../../DataStore/Functions/util');

module.exports = {
	name: 'playing',
	aliases: ['nowplaying', 'np'],
	description: 'Check whats playing.',
	category: 'Music',
	botPerms: ['CONNECT', 'SPEAK', 'MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		const queue = bot.queue.get(message.guild.id);
		if (!queue) return message.reply('There is nothing playing.').then(s => s.delete({ timeout: 30 * 1000 }));
		const song = queue.songs[0];
		const time = await queue.connection.dispatcher.totalStreamTime;

		const total = song.duration / 60;
		const current = time / (1000 * 60);
		const percentage = Math.round((current / total) * 100);
		console.log(percentage);
		const bar = createBar(total, current, 20, '▬', `[${percentage}%]`);

		console.log(bar);

		const nowPlaying = new MessageEmbed()
			.setAuthor(`${song.requester.nickname ? `${song.requester.nickname} | ${song.requester.user.tag}` : `${song.requester.user.tag}`}`, song.requester.user.displayAvatarURL({ dynamic: true }))
			.setTitle('Now playing')
			.setThumbnail(song.thumbnail)
			.setDescription(`[${song.title}](${song.url})`)
			.setColor(settings.color);

		if (song.duration > 0) nowPlaying.setFooter(`${bar[0]}`);

		return message.channel.send(nowPlaying).then(s => s.delete({ timeout: 60 * 60000 }));
	},
};