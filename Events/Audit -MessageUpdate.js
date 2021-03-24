const { bot } = require("../CleanChiBot");
const { MessageEmbed } = require("discord.js");

bot.on("messageUpdate", async (oldMessage, newMessage) => {

    //Declarations
    const settings = await bot.getGuild(oldMessage.member.guild);
    const logChan = oldMessage.guild.channels.cache.get(settings.auditLogChannel);

    //Checks
    if (!settings.shouldLog) return;
    if (!logChan) return;
    if (oldMessage.member.id === bot.user.id) return;
    if (newMessage.channel.type == "text" && newMessage.cleanContent != oldMessage.cleanContent) {

        //Set up Embed
        const embed = new MessageEmbed()
            .setAuthor(`${oldMessage.member.displayName}`, oldMessage.author.displayAvatarURL({ dynamic: true }))
            .setColor(settings.color)
            .setDescription(`**Message edited in›**\n<#${oldMessage.channel.id}> [Jump to Message](${oldMessage.url})`)
            .addFields(
                { name: 'Before›', value: `${oldMessage.cleanContent}` },
                { name: 'After›', value: `${newMessage.cleanContent}` },
                { name: 'Additional Information›', value: `**Author-ID›** ${oldMessage.member.id}\n**Channel-ID›** ${oldMessage.channel.id}\n**Message-ID›** ${oldMessage.id}` }
            )
            .setFooter(bot.Timestamp(new Date()));

        //Send It

        await logChan.send({ embed: embed });

    }
})