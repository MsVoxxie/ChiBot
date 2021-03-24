const { play } = require("../../DataStore/Functions/music");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader");
const { MessageEmbed } = require("discord.js");

let YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID;
try {
    const config = require("../../DataStore/Config/Config.json");
    YOUTUBE_API_KEY = config.YOUTUBE_API_KEY;
    SOUNDCLOUD_CLIENT_ID = config.SOUNDCLOUD_CLIENT_ID;
} catch (error) {
    YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    SOUNDCLOUD_CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID;
}
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports = {
    name: "play",
    aliases: [],
    description: "Play a song from youtube.",
    category: "Music",
    usage: "<url> or <search query>",
    cooldown: 0,
    botPerms: ["CONNECT", "SPEAK", "MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {
        const { channel } = message.member.voice;

        const serverQueue = message.client.queue.get(message.guild.id);
        if (!channel) return message.reply("You need to join a voice channel first!").then(s => s.delete({ timeout: 30 * 1000 }));
        if (serverQueue && channel !== message.guild.me.voice.channel)
            return message.reply(`You must be in the same channel as ${message.client.user}`).then(s => s.delete({ timeout: 30 * 1000 }));

        if (!args.length)
            return message
                .reply(`Usage: ${settings.prefix}play <YouTube URL | Video Name | Soundcloud URL>`)
                .then(s => s.delete({ timeout: 30 * 1000 }));

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT"))
            return message.reply("Cannot connect to voice channel, missing permissions").then(s => s.delete({ timeout: 30 * 1000 }));
        if (!permissions.has("SPEAK"))
            return message.reply("I cannot speak in this voice channel, make sure I have the proper permissions!").then(s => s.delete({ timeout: 30 * 1000 }));

        const search = args.join(" ");
        const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
        const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
        const url = args[0];
        const urlValid = videoPattern.test(args[0]);

        // Start the playlist if playlist url was provided
        if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
            return message.reply(`\nThis appears to be a playlist. Please use the \`playlist\` command!`).then(s => s.delete({ timeout: 30 * 1000 }));
            // } else if (scdl.isValidUrl(url) && url.includes("/sets/")) {
            //     return message.reply(`\nThis appears to be a playlist. Please use the \`playlist\` command!`).then(s => s.delete({ timeout: 30 * 1000 }));
        }

        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 100,
            playing: true
        };

        let songInfo = null;
        let song = null;

        if (urlValid) {
            try {
                songInfo = await ytdl.getInfo(url);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message).then(s => s.delete({ timeout: 30 * 1000 }));
            }
        } else if (scRegex.test(url)) {
            try {
                const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
                song = {
                    title: trackInfo.title,
                    url: trackInfo.permalink_url,
                    duration: Math.ceil(trackInfo.duration / 1000)
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message).then(s => s.delete({ timeout: 30 * 1000 }));
            }
        } else {
            try {
                const results = await youtube.searchVideos(search, 1);
                songInfo = await ytdl.getInfo(results[0].url);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message)
                    .then(s => s.delete({ timeout: 30 * 1000 }));
            }
        }

        if (serverQueue) {

            let addedQueue = new MessageEmbed()
                .setDescription(`[ <@${message.author.id}> ] Added [${song.title}](${song.url}) to queue.`)
                .setFooter(`Song Duration› ${bot.msToTime(song.duration * 1000)}`)
                .setColor(settings.color)

            serverQueue.songs.push(song);
            return serverQueue.textChannel
                .send({ embed: addedQueue })
                //.send(`✅ **${song.title}** has been added to the queue by ${message.author}`)
                .then(s => s.delete({ timeout: 30 * 1000 }));
        }

        queueConstruct.songs.push(song);
        message.client.queue.set(message.guild.id, queueConstruct);

        try {
            queueConstruct.connection = await channel.join();
            await queueConstruct.connection.voice.setSelfDeaf(true);
            play(queueConstruct.songs[0], message);
        } catch (error) {
            console.error(error);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return message.channel.send(`Could not join the channel: ${error}`).then(s => s.delete({ timeout: 30 * 1000 }));
        }
        if (bot.debug === true) {
            console.log(bot.queue.get(message.guild.id));
        }
    }
};