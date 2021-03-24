const { bot } = require("../CleanChiBot");
const moment = require("moment");
const { MessageEmbed } = require("discord.js");

const profanity = [
    /n[i1]gg?[e3]r[s\$]?/i,
    /(ph|f)[a@]g[s\$]?(?![A-Z])/i,
    /(ph|f)[a@]gg[s\$]?(?![A-Z])/i,
    /(ph|f)[a@]gg?[o0][t\+][s\$]?(?![A-Z])/i,
    /w[i1]gg[e3]r[s]?/i,
    /w[e3]tb[a@]ck[s]?/i,
    /dyke[s]?/i,
    /chink[s]?(?![A-Z])/i,
    /retard[s]?(?![A-Z])/i,
    /retard[e]d?(?![A-Z])/i,
];

bot.on('message', async message => {
    if (!message.guild || message.author.bot) return;

    const settings = await bot.getGuild(message.guild);

    let badWord;
    let send = false;

    const auditLogChannel = message.guild.channels.cache.get(settings.auditLogChannel)
    if (!settings.profanityFilter) return;

    if (message.member.roles.cache.has(settings.ownerRole)) return;
    if (message.member.roles.cache.has(settings.adminRole)) return;
    if (message.member.roles.cache.has(settings.modRole)) return;

    for (let i = 0; i < profanity.length; i++) {
        let result = RegExp(profanity[i]).exec(message.cleanContent);
        if (result !== null) {
            badWord = result[0];
            send = true;
        }
    }

    if (send == true) {

        const ProfaneEmbed = new MessageEmbed()
            .setTitle("__**Profanity Filter**__")
            .setThumbnail(message.author.avatarURL({ dynamic: true }))
            .setColor(settings.color)
            .setDescription(`
            **${message.member.displayName} Said ›** ${badWord}
            **In Channel ›** ${message.channel.name}
            ** At Time ›** ${moment(Date.now()).format("MMMM Do YYYY, h:mm a")}
            `)

        await message.delete();

        message.channel.send(`${message.member.displayName} Today at ${bot.Time(message.createdTimestamp)}\n${message.content.replace(badWord, "*[REDACTED]*")}`)

        if (!settings.shouldLog) return;

        await auditLogChannel.send({ embed: ProfaneEmbed });
    }
})