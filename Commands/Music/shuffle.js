const { canModifyQueue } = require('../../DataStore/Functions/util');

module.exports = {
	name: 'shuffle',
	description: 'Shuffles the music Queue.',
	category: 'Music',
	botPerms: ['CONNECT', 'SPEAK', 'MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {
		const queue = message.client.queue.get(message.guild.id);
		if (!queue) return message.channel.send('There is no queue.').then(s => s.delete({ timeout: 30 * 1000 }));
		if (!canModifyQueue(message.member)) return;

		const songs = queue.songs;
		for (let i = songs.length - 1; i > 1; i--) {
			const j = 1 + Math.floor(Math.random() * i);
			[songs[i], songs[j]] = [songs[j], songs[i]];
		}
		queue.songs = songs;
		message.client.queue.set(message.guild.id, queue);
		queue.textChannel.send(`${message.author} 🔀 shuffled the queue`).then(s => s.delete({ timeout: 30 * 1000 }));
	},
};