const discordTTS = require('discord-tts');

module.exports = {
	name: 'tts',
	aliases: ['say'],
	description: 'Say something with chi!',
	example: 'hi',
	category: 'Fun',
	args: true,
	botPerms: ['CONNECT', 'SPEAK'],
	async execute(bot, message, args, settings) {

		const queue = bot.queue.get(message.guild.id);
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.lineReply('You need to be in a voice channel for this command.').then(s => s.delete({ timeout: 10 * 1000 }));
		if (args.join(' ').length > 200) return message.lineReply('Thats too long for me to say, Please keep it under 200 characters!').then(s => s.delete({ timeout: 10 * 1000 }));

		if (queue) return message.lineReply('Music playing, Please don\'t interrupt!').then(s => s.delete({ timeout: 10 * 1000 }));

		await voiceChannel.join().then(async connection => {
			// let user = message.member.user.tag.split("#")[0]
			// let stream = discordTTS.getVoiceStream(`${user} Said: ${args.join(" ")}`);
			const stream = discordTTS.getVoiceStream(`${args.join(' ')}`);
			const dispatcher = await connection.play(stream);
			// dispatcher.on("finish", () => voiceChannel.leave());
		});
	},
};