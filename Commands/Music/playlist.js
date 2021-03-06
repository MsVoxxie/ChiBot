const { MessageEmbed } = require('discord.js');
const { play } = require('../../DataStore/Functions/music');
const ytdl = require('ytdl-core');
const YouTubeAPI = require('simple-youtube-api');
const scdl = require('soundcloud-downloader');

let config;
try {
	config = require('../../DataStore/Config/Config.json');
}
catch (error) {
	config = null;
}

const YOUTUBE_API_KEY = config ? config.YOUTUBE_API_KEY : process.env.YOUTUBE_API_KEY;
const SOUNDCLOUD_CLIENT_ID = config ? config.SOUNDCLOUD_CLIENT_ID : process.env.SOUNDCLOUD_CLIENT_ID;
const MAX_PLAYLIST_SIZE = config ? config.MAX_PLAYLIST_SIZE : process.env.MAX_PLAYLIST_SIZE;

const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports = {
	name: 'playlist',
	aliases: ['pl'],
	description: 'Queue an entire playlist.',
	category: 'Music',
	usage: '<url>',
	cooldown: 0,
	botPerms: ['CONNECT', 'SPEAK', 'MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		const { channel } = message.member.voice;
		const serverQueue = message.client.queue.get(message.guild.id);

		if (!args.length) {
			return message
				.lineReply(`Usage: ${settings.prefix}playlist <YouTube Playlist URL | Playlist Name>`)
				.catch(console.error);
		}
		if (!channel) return message.lineReply('You need to join a voice channel first!').catch(console.error);

		const permissions = channel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {return message.lineReply('Cannot connect to voice channel, missing permissions');}
		if (!permissions.has('SPEAK')) {return message.lineReply('I cannot speak in this voice channel, make sure I have the proper permissions!');}

		if (serverQueue && channel !== message.guild.me.voice.channel) {return message.lineReply(`You must be in the same channel as ${message.client.user}`).catch(console.error);}

		const search = args.join(' ');
		const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
		const url = args[0];
		const urlValid = pattern.test(args[0]);

		const queueConstruct = {
			textChannel: message.channel,
			channel,
			connection: null,
			songs: [],
			loop: false,
			volume: 100,
			playing: true,
		};

		let song = null;
		let playlist = null;
		let videos = [];

		if (urlValid) {
			try {
				playlist = await youtube.getPlaylist(url, { part: 'snippet' });
				videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: 'snippet' });
			}
			catch (error) {
				console.error(error);
				return message.lineReply('Playlist not found :(').catch(console.error);
			}
			// } else if (scdl.isValidUrl(args[0])) {
			//     if (args[0].includes("/sets/")) {
			//         message.channel.send("??? fetching the playlist...");
			//         playlist = await scdl.getSetInfo(args[0], SOUNDCLOUD_CLIENT_ID);
			//         videos = playlist.tracks.map((track) => ({
			//             title: track.title,
			//             url: track.permalink_url,
			//             duration: track.duration / 1000
			//         }));
			//     }
		}
		else {
			try {
				const results = await youtube.searchPlaylists(search, 1, { part: 'snippet' });
				playlist = results[0];
				videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: 'snippet' });
			}
			catch (error) {
				console.error(error);
				return message.lineReply(error.message).catch(console.error);
			}
		}

		const newSongs = videos.map((video) => {
			return (song = {
				title: video.title,
				url: video.url,
				duration: video.durationSeconds,
			});
		});

		serverQueue ? serverQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);

		const songs = serverQueue ? serverQueue.songs : queueConstruct.songs;

		const playlistEmbed = new MessageEmbed()
			.setTitle(`${playlist.title}`)
			.setDescription(songs.map((song, index) => `${index + 1}. ${song.title}`))
			.setURL(playlist.url)
			.setColor(settings.color)
			.setTimestamp();

		if (playlistEmbed.description.length >= 2048) {
			playlistEmbed.description =
                playlistEmbed.description.substr(0, 2007) + '\nPlaylist larger than character limit...';
		}

		message.channel.send(`${message.author} Started a playlist`, playlistEmbed).then(s => s.delete({ timeout: 30 * 1000 }));

		if (!serverQueue) {
			message.client.queue.set(message.guild.id, queueConstruct);

			try {
				queueConstruct.connection = await channel.join();
				await queueConstruct.connection.voice.setSelfDeaf(true);
				play(queueConstruct.songs[0], message);
			}
			catch (error) {
				console.error(error);
				message.client.queue.delete(message.guild.id);
				await channel.leave();
				return message.channel.send(`Could not join the channel: ${error.message}`).catch(console.error).then(s => s.delete({ timeout: 30 * 1000 }));
			}
		}
	},
};