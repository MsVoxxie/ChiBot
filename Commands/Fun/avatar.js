const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "avatar",
    aliases: [],
    description: "Get the avatar of your self or a user",
    category: "Fun",
    usage: " | avatar <@user>",
    async execute(bot, message, args, settings) {


        //Get own Avatar
        if (message.mentions.users.size === 0) {
            const senderembed = new MessageEmbed()
                .setTitle(`__**Requested By: ${message.member.displayName}**__`)
                .setImage(message.author.avatarURL({ dynamic: true, size: 1024 }))
                .setColor(settings.color)
                .setFooter(`${message.author.username}'s Avatar.`);
            return message.channel.send({ embed: senderembed });
        }

        //Get Users Avatar
        const themember = message.mentions.users.first();
        const otherembed = new MessageEmbed()
            .setTitle(`__**Requested By: ${message.member.displayName}**__`)
            .setImage(themember.avatarURL({ dynamic: true, size: 1024 }))
            .setColor(settings.color)
            .setFooter(`${themember.username}'s Avatar.`);
        message.channel.send({ embed: otherembed });
    }
}