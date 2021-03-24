const backup = require('discord-backup');

module.exports = {
    name: "create-backup",
    aliases: ["cbu"],
    description: "Create a server Backup.",
    category: "Owner Only",
    ownerOnly: true,
    hidden: true,
    async execute(bot, message, args, settings) {

        backup.create(message.guild, {
            maxMessagesPerChannel: 0,
            jsonSave: true,
            jsonBeautify: true,
            saveImages: "base64"
        }).then((backupData) => {

            return message.channel.send('Backup created! Here is your ID: `' + backupData.id + '`! Use `' + settings.prefix + 'load-backup ' + backupData.id + '` to load the backup on another server!');

        }).catch(() => {

            return message.channel.send(':x: An error occurred, please check if the bot is administrator!');

        });

    }
}