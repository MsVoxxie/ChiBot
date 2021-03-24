const Discord = module.require("discord.js");
const moment = require("moment");
const path = require('path');
const fs = require('fs');
let warns = JSON.parse(fs.readFileSync(path.join(__dirname, "../../DataStore/Warnings/", "./Warnings.json"), "utf8"));

module.exports = {
    name: "warn",
    aliases: [],
    description: "Warn a user.",
    category: "Moderation",
    usage: "<@user> <#number of strikes> <reason>",
    example: "@User 2 Two strikes for a harsh rule break.",
    userPerms: ["BAN_MEMBERS"],
    botPerms: ["BAN_MEMBERS"],
    async execute(bot, message, args, settings) {

        let lastWarning;

        const warnee = (message.mentions.members.first() || message.guild.members.cache.get(args[0]));

        let numWarn = parseInt(args[1]);
        let numSlice = 2;

        if (isNaN(numWarn)) {
            numWarn = parseInt("1");
            numSlice = 1;
        }

        console.log(numSlice);

        const sentence = args.join(" ");
        const spacing = sentence.split(" ");
        const final = spacing.slice(numSlice).join(" ");

        if (!warnee) return message.channel.send('Specify a user.');
        if (!warns[warnee.guild.id]) { warns[warnee.guild.id] = {}; }
        if (!warns[warnee.guild.id][warnee.id]) {
            warns[warnee.guild.id][warnee.id] = {
                warnings: 0,
                username: "",
                userid: "",
                reasons: [],
                timestamp: ""
            };
        }

        warns[warnee.guild.id][warnee.id].warnings += numWarn;
        warns[warnee.guild.id][warnee.id].username = warnee.user.tag;
        warns[warnee.guild.id][warnee.id].userid = warnee.id;
        warns[warnee.guild.id][warnee.id].reasons.push(final.toString());
        warns[warnee.guild.id][warnee.id].timestamp = moment(Date.now()).format("MMMM Do YYYY, h:mm a");

        lastWarning = final.toString();

        fs.writeFileSync(path.join(__dirname, "../../DataStore/Warnings/", "./Warnings.json"), JSON.stringify(warns, null, 2), function (err) {
            if (err) console.log(err);
        });

        const warned = new Discord.MessageEmbed()
            .setTitle("__**Warned User**__")
            .setColor(settings.color)
            .setDescription(`
      **User Warned›** ${warnee.displayName}
      **Warned By›** ${message.member.displayName}
      **Reason›** ${final.toString()}
      **Number of Warnings›** ${warns[warnee.guild.id][warnee.id].warnings}`);

        let punishment = "";
        let appeal = "";

        //Kick
        if (warns[warnee.guild.id][warnee.id].warnings == 3) {
            punishment = "24 hour kick";
            appeal = "Once 24 hours pass, you may contact a staff team member to ask for a reinvitation.";
            if (warnee.kickable) {
                warnee.kick()
            }
        }
        //TBan
        if (warns[warnee.guild.id][warnee.id].warnings == 4) {
            punishment = "7 day Ban";
            appeal = "Once the week is over, you may contact a staff team member to request a reinvitation, if you have learned your lesson.";
            if (warnee.bannable) {
                warnee.ban({
                    days: 7,
                    reason: `${lastWarning || "No Reason Provided"} | ${warns[warnee.guild.id][warnee.id].warnings} warnings.`
                })
            }
        }
        //PBan
        if (warns[warnee.guild.id][warnee.id].warnings >= 5) {
            punishment = "Permanent Ban";
            appeal = "Unfortunately we cannot trust you will learn from your mistakes, You will not be allowed an appeal.";
            if (warnee.bannable) {
                warnee.ban({
                    days: 0,
                    reason: `${lastWarning || "No Reason Provided"} | ${warns[warnee.guild.id][warnee.id].warnings} warnings.`
                })
            }
        }

        const punish = new Discord.MessageEmbed()
            .setColor(settings.color)
            .setDescription(`
      **You have received warning** #${warns[warnee.guild.id][warnee.id].warnings}
      Reason for Warning: ${lastWarning || "No Reason Provided"}
      This means a ${punishment}
      ${appeal}
      `);

        if (warns[warnee.guild.id][warnee.id].warnings == 3 || warns[warnee.guild.id][warnee.id].warnings == 4 || warns[warnee.guild.id][warnee.id].warnings == 5) {
            warnee.send({ embed: punish });
        }

        message.channel.send({ embed: warned });

    }
}