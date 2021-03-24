const { MessageEmbed, escapeMarkdown } = require("discord.js");
const emojitext = require("../../DataStore/TextFuncs/emojitext")

module.exports = {
    name: "emojitext",
    aliases: ["et"],
    description: "Emojify your text",
    category: "Fun",
    usage: "<text>",
    args: true,
    async execute(bot, message, args, settings) {

        //Convert text
        emoji = function (text) {
            return text.split('').map(function (a) {
                return emojitext.hasOwnProperty(a) ? emojitext[a] : a;
            }).join(' ');
        }

        //Set up embed
        const embed = new MessageEmbed()
            .setColor(settings.color)
            .setAuthor(message.member.displayName, message.author.displayAvatarURL())
            .setDescription(emoji(args.join(" ").toLowerCase()))
        return message.channel.send({ embed: embed });
    }
}