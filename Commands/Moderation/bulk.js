const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");
const { writeFile } = require("fs");
const path = require("path");

module.exports = {
    name: "bulk",
    aliases: ["purge"],
    description: "Bulk Delete messages.",
    category: "Moderation",
    usage: "<count> | <count> <@user>",
    userPerms: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    botPerms: ["MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {

        //Declarations
        const User = message.mentions.users.first();
        let from;
        let logMsgs = [];
        let Amount = parseInt(args[0]);

        //Check if Amount is provided
        if (!Amount) return message.reply(`\nPlease provide the number of messages you'd like deleted.`);
        if (Amount >= 100) {
            Amount = 99
        }

        //Map the messages and the author.
        message.channel.messages.fetch({ limit: Amount + 1 }).then(async messages => {
            if (User) {
                from = `from \`${User.tag}\``;
                const filterBy = User ? User.id : bot.user.id;
                messages = messages.filter(m => m.author.id === filterBy).array().slice(0, Amount);
            } else {
                from = "";
            }

            //Send the purge as a txt file.
            let sortedMessages = messages.filter(t => t !== undefined).sort((a, b) => a.createdTimestamp - b.createdTimestamp);
            sortedMessages.map(async m => { logMsgs.push(`${escapeMarkdown(`[${bot.Time(m.createdTimestamp)}] - ${m.member.displayName}: ${m.cleanContent ? m.cleanContent : m.embeds[0].description}`)}`) });

            settings.lastPurge.push(logMsgs.join("\n"));
            settings.lastPurge.shift();
            await settings.save();

            if (settings.shouldLog === true && settings.auditLogChannel) {
                const auditChan = message.guild.channels.cache.get(settings.auditLogChannel);

                //setup Embed
                const embed = new MessageEmbed()
                    .setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle("**Purge Executed**")
                    .setColor(settings.color)
                    .setDescription(settings.lastPurge.join("\n"))
                    .setFooter(`Purged at› ${bot.Timestamp(Date.now())}.`);

                const splitLogs = splitMessage(settings.lastPurge.join("\n"), {
                    maxLength: 2048,
                    char: "\n",
                    preappend: "",
                    append: ""
                });

                splitLogs.forEach(async m => {
                    embed.setDescription(m);
                    auditChan.send({ embed: embed });
                })
            }
            //Do the purge.
            await message.channel.bulkDelete(messages).catch(err => message.reply(`\nAn error occured:\n**${err.message}**`));
            await message.reply(`\nPurge Successful, Deleted \`${Amount}\` messages ${from}`);
        })

    }
}