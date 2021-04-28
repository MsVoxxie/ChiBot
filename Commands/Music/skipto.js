const { canModifyQueue } = require('../../DataStore/Functions/util');

module.exports = {
	name: 'skipto',
	description: 'Skip to the selected queue number.',
	category: 'Music',
	botPerms: ['CONNECT', 'SPEAK', 'MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {
		if (!args.length || isNaN(args[0])) {
			return message
				.lineReply(`Usage: ${settings.prefix}${module.exports.name} <Queue Number>`)
				.catch(console.error);
		}

		const queue = message.client.queue.get(message.guild.id);
		if (!queue) return message.channel.send('There is no queue.').then(s => s.delete({ timeout: 30 * 1000 }));
		if (!canModifyQueue(message.member)) return;
		if (args[0] > queue.songs.length) {return message.lineReply(`The queue is only ${queue.songs.length} songs long!`).catch(console.error);}

		queue.playing = true;

		if (queue.loop) {
			for (let i = 0; i < args[0] - 2; i++) {
				queue.songs.push(queue.songs.shift());
			}
		}
		else {
			queue.songs = queue.songs.slice(args[0] - 2);
		}

		queue.connection.dispatcher.end();
		queue.textChannel.send(`${message.author} ⏭ skipped ${args[0] - 1} songs`).then(s => s.delete({ timeout: 30 * 1000 }));
	},
};