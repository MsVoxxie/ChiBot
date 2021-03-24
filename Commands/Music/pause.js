const { canModifyQueue } = require("../../DataStore/Functions/util");

module.exports = {
    name: "pause",
    description: "Pause the music.",
    category: "Music",
    botPerms: ["CONNECT", "SPEAK", "MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);
        if (!canModifyQueue(message.member)) return;

        if (queue.playing) {
            queue.playing = false;
            queue.connection.dispatcher.pause(true);
            return queue.textChannel.send(`${message.author} ⏸ paused the music.`).catch(console.error);
        }
    }
};