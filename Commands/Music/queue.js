const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");

module.exports = {
    name: "queue",
    description: "Check the music queue.",
    category: "Music",
    botPerms: ["CONNECT", "SPEAK", "MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {
        const permissions = message.channel.permissionsFor(message.client.user);
        if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"]))
            return message.reply("Missing permission to manage messages or add reactions").then(s => s.delete({ timeout: 30 * 1000 }));

        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send("❌ **Nothing playing in this server**").then(s => s.delete({ timeout: 30 * 1000 }));

        let currentPage = 0;
        const embeds = generateQueueEmbed(message, queue.songs, settings);

        const queueEmbed = await message.channel.send(
            `**Current Page - ${currentPage + 1}/${embeds.length}**`,
            embeds[currentPage]
        );

        try {
            await queueEmbed.react("⬅️");
            await queueEmbed.react("⏹");
            await queueEmbed.react("➡️");
        } catch (error) {
            console.error(error);
            message.channel.send(error.message).then(s => s.delete({ timeout: 30 * 1000 }));
        }

        const filter = (reaction, user) =>
            ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
        const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });

        collector.on("collect", async (reaction, user) => {
            try {
                if (reaction.emoji.name === "➡️") {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                    }
                } else if (reaction.emoji.name === "⬅️") {
                    if (currentPage !== 0) {
                        --currentPage;
                        queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                    }
                } else {
                    collector.stop();
                    reaction.message.reactions.removeAll();
                    queueEmbed.delete({ timeout: 30 * 1000 });
                }
                await reaction.users.remove(message.author.id);
            } catch (error) {
                console.error(error);
                return message.channel.send(error.message).then(s => s.delete({ timeout: 30 * 1000 }));
            }
        });
    }
};

function generateQueueEmbed(message, queue, settings) {
    let embeds = [];
    let k = 10;

    for (let i = 0; i < queue.length; i += 10) {
        const current = queue.slice(i, k);
        let j = i;
        k += 10;

        const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");

        const embed = new MessageEmbed()
            .setTitle("Song Queue\n")
            .setThumbnail(message.guild.iconURL())
            .setColor(settings.color)
            .setDescription(`**Current Song - [${queue[0].title}](${queue[0].url})**\n\n${info}`)
            .setTimestamp();
        embeds.push(embed);
    }

    return embeds;
}