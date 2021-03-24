const ms = require("ms");

module.exports = {
    name: "unmute",
    aliases: [],
    description: "unMute a user.",
    category: "Moderation",
    usage: "<@user> <time>(optional)",
    userPerms: ["MUTE_MEMBERS"],
    botPerms: ["MANAGE_ROLES"],
    async execute(bot, message, args, settings) {

        //Setup variables
        const toMute = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));

        //Check for mute role
        let MuteRole = await message.guild.roles.cache.find(r => r.name === "Muted");

        //Checks
        if (!toMute) return message.reply(`\nSpecify a user who to unmute.`).then(s => s.delete({ timeout: 30 * 1000 }));
        if (toMute.roles.has(MuteRole.id)) return message.reply(`\nThis user is not muted.`).then(s => s.delete({ timeout: 30 * 1000 }));

        //Apply Role
        await toMute.roles.remove(MuteRole.id);
        await message.reply(`\n<@${toMute.id}> has been unmuted`).then(s => s.delete({ timeout: 30 * 1000 }));

    }
}