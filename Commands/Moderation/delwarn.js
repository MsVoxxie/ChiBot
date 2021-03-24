const path = require("path");
const { readFileSync, writeFileSync } = require("fs");

module.exports = {
    name: "delwarn",
    aliases: [],
    description: "Remove a user COMPLETELY from the warning list.",
    category: "Moderation",
    usage: "<userid> or <@user>",
    userPerms: ["BAN_MEMBERS"],
    botPerms: ["BAN_MEMBERS"],
    async execute(bot, message, args, settings) {

        //Declarations
        let warns = JSON.parse(readFileSync(path.join(__dirname, "../../DataStore/Warnings/", "./Warnings.json"), "utf8"));

        let delWarn = (message.mentions.members.first() || message.guild.members.cache.get(args[0]));

        //Checks
        if (!delWarn) message.reply(`\nPlease provide a user to remove from the warning list.`).then(s => s.delete({ timeout: 30 * 1000 }));

        console.log(delWarn.id);

        //Setup "Database"
        if (!warns[message.guild.id]) { warns[message.guild.id] = {}; }
        if (!warns[message.guild.id][delWarn.id]) return message.reply(`\nThis user has not been warned.`).then(s => s.delete({ timeout: 30 * 1000 }));

        delete warns[message.guild.id][delWarn.id]

        //Write to Database
        writeFileSync(path.join(__dirname, "../../DataStore/Warnings/", "./Warnings.json"), JSON.stringify(warns, null, 2), function (err) {
            if (err) return message.reply(`\nAn error occured, Could not save..`).then(s => s.delete({ timeout: 30 * 1000 }));
        });
        message.reply(`\nDeleted ${delWarn} from the warnings list.`).then(s => s.delete({ timeout: 30 * 1000 }));
    }
}