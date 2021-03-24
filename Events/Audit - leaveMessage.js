const { bot } = require("../CleanChiBot");
const { MessageEmbed } = require("discord.js");

bot.on("guildMemberRemove", async member => {
    //Get Settings
    const settings = await bot.getGuild(member.guild);

    //Get channel
    const auditChan = member.guild.channels.cache.get(settings.auditLogChannel);

    //Setup embed
    const embed = new MessageEmbed()
        .setAuthor(member.displayName, member.user.displayAvatarURL({ dynamic: true }))
        .setColor(settings.color)
        .setFooter(`At› ${bot.Timestamp(new Date())}`);

    //audit Leave
    if (auditChan && settings.shouldLog) {
        try {
            //Setup Embed
            embed.setDescription(`${member} left the server.`);

            //Send it
            auditChan.send({ embed: embed });
        } catch (e) {
            console.log(e);
        }
    }
});