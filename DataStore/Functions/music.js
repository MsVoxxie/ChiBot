const { bot } = require('../../CleanChiBot');
const ytdlDiscord = require('ytdl-core');
const scdl = require('soundcloud-downloader');
const { canModifyQueue } = require('../Functions/util');
const { MessageEmbed } = require('discord.js');

module.exports = {
	async play(song, message) {

		const settings = await bot.getGuild(message.guild);

		let config;

		try {
			config = require('../Config/Config.json');
		}
		catch (error) {
			config = null;
		}

		const PRUNING = config ? config.PRUNING : process.env.PRUNING;
		const SOUNDCLOUD_CLIENT_ID = config ? config.SOUNDCLOUD_CLIENT_ID : process.env.SOUNDCLOUD_CLIENT_ID;

		const queue = message.client.queue.get(message.guild.id);

		if (!song) {
			message.client.queue.delete(message.guild.id);
			queue.textChannel.send(`📛 The music queue for \`${message.guild.nameAcronym}\` is now empty.\nNow leaving the channel: \`${queue.channel.name}\`.`).then(s => s.delete({ timeout: 30 * 1000 }));
			return queue.channel.leave();
		}

		let stream = null;
		let streamType = song.url.includes('youtube.com') ? 'opus' : 'ogg/opus';

		try {
			if (song.url.includes('youtube.com')) {
				stream = await ytdlDiscord(song.url, { opusEncoded: true, highWaterMark: 1 << 25 });
			}
			else if (song.url.includes('soundcloud.com')) {
				try {
					stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, SOUNDCLOUD_CLIENT_ID);
				}
				catch (error) {
					stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, SOUNDCLOUD_CLIENT_ID);
					streamType = 'unknown';
				}
			}
			if (bot.debug === true) { console.log(stream); }
		}
		catch (error) {
			if (queue) {
				if (bot.debug === true) { console.log(queue); }
				queue.songs.shift();
				module.exports.play(queue.songs[0], message);
			}

			console.error(error);
			return message.channel.send(`Error: ${error.message ? error.message : error}`).then(s => s.delete({ timeout: 30 * 1000 }));
		}

		queue.connection.on('disconnect', () => message.client.queue.delete(message.guild.id));

		const dispatcher = queue.connection
			.play(stream, { opusEncoded: true })
			.on('finish', () => {
				if (collector && !collector.ended) collector.stop();

				if (queue.loop) {
					// if loop is on, push the song back at the end of the queue
					// so it can repeat endlessly
					const lastSong = queue.songs.shift();
					queue.songs.push(lastSong);
					module.exports.play(queue.songs[0], message);
				}
				else {
					// Recursively play the next song
					queue.songs.shift();
					module.exports.play(queue.songs[0], message);
				}
			})
			.on('error', (err) => {
				console.error(err);
				queue.songs.shift();
				module.exports.play(queue.songs[0], message);
			});

		if (bot.debug === true) { console.log(dispatcher); }

		dispatcher.setVolumeLogarithmic(queue.volume / 100);

		try {

			const addedQueue = new MessageEmbed()
				.setDescription(`Now Playing› [${song.title}](${song.url})\n[ <@${message.author.id}> ]`)
				.setThumbnail(song.thumbnail)
				.setFooter(`Song Duration› ${bot.msToTime(song.duration * 1000)}`)
				.setColor(settings.color);

			var playingMessage = await queue.textChannel.send({ embed: addedQueue }); // queue.textChannel.send(`🎶 Started playing: **${song.title}** ${song.url}`);
			await playingMessage.react('⏹');
			await playingMessage.react('🔁');
			await playingMessage.react('⏭');
			await playingMessage.react('⏯');
			await playingMessage.react('🔇');
			await playingMessage.react('🔉');
			await playingMessage.react('🔊');
		}
		catch (error) {
			console.error(error);
		}

		const filter = (reaction, user) => user.id !== message.client.user.id;
		var collector = playingMessage.createReactionCollector(filter, {
			time: song.duration > 0 ? song.duration * 1000 : 600000,
		});

		collector.on('collect', (reaction, user) => {
			if (!queue) return;
			const member = message.guild.member(user);

			switch (reaction.emoji.name) {
			case '⏭':
				queue.playing = true;
				reaction.users.remove(user).catch(console.error);
				if (!canModifyQueue(member)) return;
				queue.connection.dispatcher.end();
				queue.textChannel.send(`${user} ⏩ skipped the song`).then(s => s.delete({ timeout: 30 * 1000 }));
				collector.stop();
				break;

			case '⏯':
				reaction.users.remove(user).catch(console.error);
				if (!canModifyQueue(member)) return;
				if (queue.playing) {
					queue.playing = !queue.playing;
					queue.connection.dispatcher.pause(true);
					queue.textChannel.send(`${user} ⏸ paused the music.`).then(s => s.delete({ timeout: 30 * 1000 }));
				}
				else {
					queue.playing = !queue.playing;
					queue.connection.dispatcher.resume();
					queue.textChannel.send(`${user} ▶ resumed the music!`).then(s => s.delete({ timeout: 30 * 1000 }));
				}
				break;

			case '🔇':
				reaction.users.remove(user).catch(console.error);
				if (!canModifyQueue(member)) return;
				if (queue.volume <= 0) {
					queue.volume = 100;
					queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
					queue.textChannel.send(`${user} 🔊 unmuted the music!`).then(s => s.delete({ timeout: 30 * 1000 }));
				}
				else {
					queue.volume = 0;
					queue.connection.dispatcher.setVolumeLogarithmic(0);
					queue.textChannel.send(`${user} 🔇 muted the music!`).then(s => s.delete({ timeout: 30 * 1000 }));
				}
				break;

			case '🔉':
				reaction.users.remove(user).catch(console.error);
				if (!canModifyQueue(member) || queue.volume == 0) return;
				if (queue.volume - 10 <= 0) queue.volume = 0;
				else queue.volume = queue.volume - 10;
				queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
				queue.textChannel
					.send(`${user} 🔉 decreased the volume, the volume is now ${queue.volume}%`)
					.then(s => s.delete({ timeout: 30 * 1000 }));
				break;

			case '🔊':
				reaction.users.remove(user).catch(console.error);
				if (!canModifyQueue(member) || queue.volume == 100) return;
				if (queue.volume + 10 >= 100) queue.volume = 100;
				else queue.volume = queue.volume + 10;
				queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
				queue.textChannel
					.send(`${user} 🔊 increased the volume, the volume is now ${queue.volume}%`)
					.then(s => s.delete({ timeout: 30 * 1000 }));
				break;

			case '🔁':
				reaction.users.remove(user).catch(console.error);
				if (!canModifyQueue(member)) return;
				queue.loop = !queue.loop;
				queue.textChannel.send(`${user} ⏹ turned loop ${queue.loop ? '**on**' : '**off**'}`).then(s => s.delete({ timeout: 30 * 1000 }));
				break;

			case '⏹':
				reaction.users.remove(user).catch(console.error);
				if (!canModifyQueue(member)) return;
				queue.songs = [];
				queue.textChannel.send(`${user} ⏹ stopped the music!`).then(s => s.delete({ timeout: 30 * 1000 }));
				try {
					queue.connection.dispatcher.end();
				}
				catch (error) {
					console.error(error);
					queue.connection.disconnect();
				}
				collector.stop();
				break;

			default:
				reaction.users.remove(user).catch(console.error);
				break;
			}
		});

		collector.on('end', () => {
			playingMessage.reactions.removeAll().catch(console.error);
			if (PRUNING === true || (PRUNING == 'true') && playingMessage && !playingMessage.deleted) {
				playingMessage.delete({ timeout: 3000 }).catch(console.error);
			}
		});
	},
};