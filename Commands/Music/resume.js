const { canModifyQueue } = require("../../DataStore/Functions/util");

module.exports = {
    name: "resume",
    description: "Resume the music.",
    category: "Music",
    botPerms: ["CONNECT", "SPEAK", "MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);
        if (!canModifyQueue(message.member)) return;

        if (!queue.playing) {
            queue.playing = true;
            queue.connection.dispatcher.resume();
            return queue.textChannel.send(`${message.author} ▶ resumed the music!`).catch(console.error);
        }

        return message.reply("The queue is not paused.").catch(console.error);
    }
};