const { canModifyQueue } = require("../../DataStore/Functions/util");

module.exports = {
    name: "skip",
    description: "Skip the current song.",
    category: "Music",
    botPerms: ["CONNECT", "SPEAK", "MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue)
            return message.reply("There is nothing playing that I could skip for you.").then(s => s.delete({ timeout: 30 * 1000 }));
        if (!canModifyQueue(message.member)) return;

        queue.playing = true;
        queue.connection.dispatcher.end();
        queue.textChannel.send(`${message.author} ⏭ skipped the song`).then(s => s.delete({ timeout: 30 * 1000 }));
    }
};