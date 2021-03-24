const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "playing",
    aliases: ["nowplaying", "np"],
    description: "Check whats playing.",
    category: "Music",
    botPerms: ["CONNECT", "SPEAK", "MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {

        const queue = bot.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").then(s => s.delete({ timeout: 30 * 1000 }));
        const song = queue.songs[0];

        let nowPlaying = new MessageEmbed()
            .setTitle("Now playing")
            .setDescription(`${song.title}\n${song.url}`)
            .setColor(settings.color)
            .setAuthor(bot.user.tag);

        if (song.duration > 0) nowPlaying.setFooter(new Date(song.duration * 1000).toISOString().substr(11, 8));

        return message.channel.send(nowPlaying).then(s => s.delete({ timeout: 60 * 60000 }));
    }
};