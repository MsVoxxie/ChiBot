const ms = require("ms");

module.exports = {
    name: "mute",
    aliases: ["m"],
    description: "Mute a user.",
    category: "Moderation",
    usage: "<@user> <time>(optional)",
    userPerms: ["MUTE_MEMBERS"],
    botPerms: ["MANAGE_ROLES"],
    async execute(bot, message, args, settings) {

        //Setup variables
        const toMute = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));

        //Checks
        if (!toMute) return message.reply(`\nSpecify a user who to mute.`).then(s => s.delete({ timeout: 30 * 1000 }));
        if (toMute.hasPermission("MUTE_MEMBERS")) return message.reply(`\nSorry you can't mute this user.`).then(s => s.delete({ timeout: 30 * 1000 }));

        //Check if muted role exists, if not, create it.
        let MuteRole = await message.guild.roles.cache.find(r => r.name === "Muted");
        if (!MuteRole) {
            try {
                MuteRole = await message.guild.roles.create({
                    data: {
                        name: "Muted",
                        color: "#ff1100",
                        permissions: []
                    },
                    reason: "Muted role was not found, So I crated one.",
                });

                //Update overwrites
                message.guild.channels.cache.forEach(async (channel, id) => {
                    await channel.updateOverwrite(MuteRole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });
                await message.channel.send(`Created <@&${MuteRole.id}>.`).then(s => s.delete({ timeout: 30 * 1000 }));
            } catch (e) {
                console.log(e);
            }
        }

        //Apply Role
        await toMute.roles.add(MuteRole.id);
        await message.reply(`\n<@${toMute.id}> has been muted ${args[1] ? `for \`${ms(ms(args[1]))}\`.` : "indefinitely"}`).then(s => s.delete({ timeout: 30 * 1000 }));

        //If time provided, unmute them once it has passed.
        if (args[1]) {
            setTimeout(async () => {
                if (!toMute.roles.has(MuteRole.id)) {
                    await toMute.roles.remove(MuteRole.id)
                    message.channel.send(`<@${toMute.id}> has been unmuted.`);
                }
            }, ms(args[1]));
        }
    }
}