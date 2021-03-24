const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "kick",
    aliases: [],
    description: "Kick a user with an optional reason.",
    category: "Moderation",
    usage: "<@user> <reason>(optional)",
    userPerms: ["KICK_MEMBERS"],
    botPerms: ["KICK_MEMBERS"],
    async execute(bot, message, args, settings) {

        //Declarations
        const toKick = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const kickReason = args.slice(1).join(" ");

        //Checks
        if (!toKick) return message.reply(`\nPlease provide a user to kick.`).then(s => s.delete({ timeout: 30 * 1000 }));
        if (!toKick.kickable) return message.reply(`\nThis user is not kickable.`).then(s => s.delete({ timeout: 30 * 1000 }));

        //Init Embed
        const embed = new MessageEmbed()
            .setAuthor(message.member.displayName, message.member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`<@${toKick.id}> has been kicked by ${message.member.displayName}\n**Reason›** ${kickReason ? kickReason : "No reason provided."}`)
            .setColor(settings.color);

        try {
            await toKick.kick(`Kicked by ${message.member.displayName} for reason: ${kickReason}`)
            message.channel.send({ embed: embed });
        } catch (e) {
            console.log(e);
        }
    }
}