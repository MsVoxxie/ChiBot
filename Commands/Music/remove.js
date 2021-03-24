const { canModifyQueue } = require("../../DataStore/Functions/util");

module.exports = {
    name: "remove",
    aliases: ["rm"],
    description: "Remove song from queue.",
    category: "Music",
    botPerms: ["CONNECT", "SPEAK", "MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send("There is no queue.").then(s => s.delete({ timeout: 30 * 1000 }));
        if (!canModifyQueue(message.member)) return;

        if (!args.length) return message.reply(`Usage: ${settings.prefix}remove <Queue Number>`).then(s => s.delete({ timeout: 30 * 1000 }));
        if (isNaN(args[0])) return message.reply(`Usage: ${settings.prefix}remove <Queue Number>`).then(s => s.delete({ timeout: 30 * 1000 }));

        const song = queue.songs.splice(args[0] - 1, 1);
        queue.textChannel.send(`${message.author} ❌ removed **${song[0].title}** from the queue.`).then(s => s.delete({ timeout: 30 * 1000 }));
    }
};