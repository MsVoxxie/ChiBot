module.exports = {
    name: "rerollraffle",
    aliases: ["reroll"],
    description: "Reroll a raffle",
    category: "Raffle",
    usage: "<message ID>",
    cooldown: "15",
    botPerms: ["MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {

        //Declarations
        const messageID = args[0]

        //Checks
        if (!messageID) return message.reply(`\nPlease provide a valid message ID of a previously ran raffle to reroll.`).then(s => s.delete({ timeout: 30 * 1000 }));

        //Do the reroll
        try {
            bot.Raffle.reroll(messageID);
            message.reply(`\nRaffle Rerolled.`).then(s => s.delete({ timeout: 30 * 1000 }));
        } catch (e) {
            console.log(e);
        }
    }
}