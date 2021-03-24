const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "enlarge",
    aliases: ["e"],
    description: "Enlarge an emoji",
    category: "Utility",
    usage: "<emoji>",
    args: true,
    botPerms: ["MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {
        
        //Declarations
        let type;
        
        //Split Emoji into pieces
        const CutFront = args[0].replace("<", "");
        const CutBack = CutFront.replace(">", "");
        const Slice = CutBack.split(":");
        if (Slice.includes("a")) {
            type = ".gif";
        } else {
            type = ".png";
        }

        const Emoji = `https://cdn.discordapp.com/emojis/${Slice[2]}${type}?v=1`;
        if (Emoji) {
            try {
                const embed = new MessageEmbed()
                    .setColor(settings.color)
                    .setImage(Emoji)
                    .setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }));
                message.channel.send({ embed: embed });
            } catch (e) {
                console.log(e);
            }
        } else {
            return message.reply("Please provide a valid Emoji to enlarge.").then(s => s.delete({ timeout: 10 * 1000 }));
        }
    }
}