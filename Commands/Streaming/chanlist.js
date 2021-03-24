const path = require("path");
const { readFileSync, writeFileSync } = require("fs");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "chanlist",
    aliases: [],
    description: "View watched channels.",
    category: "Streaming",
    usage: "",
    botPerms: ["MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {
        //Declarations
        const channels = JSON.parse(readFileSync(path.join(__dirname, "./channels.json"), "utf8"));
        const member = message.member;
        let getChans = channels[member.guild.id];

        const watchList = new MessageEmbed()
            .setColor(settings.color)
            .setTitle(`__**${member.guild.name}'s Watched Channels**__`);

        Object.entries(getChans).forEach(([k, chan]) => {
            watchList.addField(`${chan.ChannelName}`, `Last Post› ${chan.LastPost ? bot.Timestamp(chan.LastPost) : "Hasn't been live yet."}\nStatus› ${chan.Offline === true ? "Offline" : `[Live on Twitch](https://www.twitch.tv/${chan.ChannelName})`}`);
        });

        message.channel.send({ embed: watchList })

    }
}