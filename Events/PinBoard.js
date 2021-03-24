const { bot } = require("../CleanChiBot");
const { MessageEmbed, escapeMarkdown } = require("discord.js");

const ReactLimit = 3;
// Add

bot.on("messageReactionAdd", async function (reaction, user) {
    if (user === bot.user) return;
    const message = reaction.message;
    const settings = await bot.getGuild(message.guild);
    if (reaction.emoji.name !== "📌") return;
    const starChannel = await message.guild.channels.cache.get(settings.pinboardChannel)
    if (!starChannel) return message.channel.send("Cannot find the channel pinboard, does it exist?").then(s => { s.delete({ timeout: "10000" }); });
    if (!settings.pinboardEnabled) return;
    const fetch = await starChannel.messages.fetch({ limit: 100 });
    const stars = fetch.find(
        m =>
            m.embeds[0].footer.text.startsWith("📌") &&
            m.embeds[0].footer.text.endsWith(message.id)
    );

    if (stars) {
        const star = /^\📌\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(
            stars.embeds[0].footer.text
        );
        const foundStar = stars.embeds[0];
        const image = message.attachments.size > 0 ? await extension(reaction, message.attachments.array()[0].url) : "";
        const embed = new MessageEmbed()
            .setColor(settings.color)
            .setDescription(`
        **Channel›** ${message.channel.name}
        **Message›**
        ${escapeMarkdown(message.cleanContent)}
        [Jump To Message](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}/)`)
            .setTimestamp(new Date())
            .setAuthor(`${message.author.username}`, `${message.author.avatarURL({ dynamic: true })}`)
            .setFooter(`📌 ${parseInt(star[1]) + 1} | ${message.id}`)
            .setImage(message.attachments.url ? message.attachments.url : image);

        const starMsg = await starChannel.messages.fetch(stars.id);
        await starMsg.edit({ embed });
    }

    if (!stars && reaction.emoji.name === "📌" && reaction.count >= ReactLimit) {
        const image = message.attachments.size > 0 ? await extension(reaction, message.attachments.array()[0].url) : "";
        if (image === "" && message.cleanContent.length < 1) return message.channel.send(`${user}, you cannot star an empty message.`).then(s => { s.delete({ timeout: "10000" }); });
        const embed = new MessageEmbed()
            .setColor(settings.color)
            .setDescription(`
        **Channel›** ${message.channel.name}
        
        **Message›**
        ${message.cleanContent}
        [Jump To Message](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}/)`)
            .setTimestamp(new Date())
            .setAuthor(`${message.author.username}`, `${message.author.avatarURL({ dynamic: true })}`)
            .setFooter(`📌 ${reaction.count} | ${message.id}`)
            .setImage(message.attachments.url ? message.attachments.url : image);
        await starChannel.send({ embed });
    }

    function extension(reaction, attachment) {
        const imageLink = attachment.split(".");
        const typeOfImage = imageLink[imageLink.length - 1];
        const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
        if (!image) return "";
        return attachment;
    }
});