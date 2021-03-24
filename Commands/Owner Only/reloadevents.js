const { MessageEmbed } = require("discord.js");
const { readdir } = require("fs");
const path = require('path');

module.exports = {
    name: "reloadevents",
    aliases: ['rlevent'],
    category: "Owner Only",
    disabled: true,
    description: "Reload Bot Events",
    ownerOnly: true,
    botPerms: ["MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {

        readdir("./Events/", (err, files) => {
            if (err) console.error(err);
            const event_files = files.filter(f => f.split(".").pop() === "js");
            if (event_files.length <= 0) return console.log("No Events to reload.");
            event_files.forEach((f, i) => {
                const eventPath = path.join(__dirname, '../../Events/', f);
                delete require.cache[require.resolve(eventPath)]
                require(eventPath);
            });
        });

        const reloadedEmbed = new MessageEmbed()
            .setAuthor(message.member.displayName, message.member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`<:check:753802620644360213> Events Reloaded`)
            .setColor(settings.color)
            .setTimestamp();

        message.channel.send({ embed: reloadedEmbed }).then(s => s.delete({ timeout: 60 * 1000 }));
    }
}