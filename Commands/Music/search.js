const { MessageEmbed } = require('discord.js');
const YouTubeAPI = require('simple-youtube-api');
const { YOUTUBE_API_KEY } = require('../../DataStore/Config/Config.json');
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports = {
	name: 'search',
	description: '(W.I.P) Search and select videos to play.',
	category: 'Music',
	botPerms: ['CONNECT', 'SPEAK', 'MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {
		if (!args.length) {
			return message
				.lineReply(`Usage: ${settings.prefix}${module.exports.name} <Video Name>`)
				.catch(console.error);
		}
		if (message.channel.activeCollector) {return message.lineReply('A message collector is already active in this channel.');}
		if (!message.member.voice.channel) {return message.lineReply('You need to join a voice channel first!').catch(console.error);}

		const search = args.join(' ');

		const resultsEmbed = new MessageEmbed()
			.setTitle('**lineReply with the song number you want to play**')
			.setDescription(`Results for: ${search}`)
			.setColor(settings.color);

		try {
			const results = await youtube.searchVideos(search, 10);
			results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

			const resultsMessage = await message.channel.send(resultsEmbed);

			function filter(msg) {
				const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;
				return pattern.test(msg.content);
			}

			message.channel.activeCollector = true;
			const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] });
			const lineReply = response.first().content;

			if (lineReply.includes(',')) {
				const songs = lineReply.split(',').map((str) => str.trim());

				for (const song of songs) {
					await message.client.commands
						.get('play')
						.execute(message, [resultsEmbed.fields[parseInt(song) - 1].name]);
				}
			}
			else {
				const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;
				message.client.commands.get('play').execute(message, [choice]);
			}

			message.channel.activeCollector = false;
			resultsMessage.delete().catch(console.error);
			response.first().delete().catch(console.error);
		}
		catch (error) {
			console.error(error);
			message.channel.activeCollector = false;
			message.lineReply(error.message).catch(console.error);
		}
	},
};