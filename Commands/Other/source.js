const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "source",
    aliases: [],
    description: "Shows my Source Code",
    category: "Other",
    botPerms: ["MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {

        const embed = new MessageEmbed()
            .setTitle("__**ChiBot's Code**__")
            .setColor("#700707")
            .setThumbnail("https://share.voxxie.me/images/VoxelIco.png")
            .setDescription("Source Code can be found [Here on Github](https://github.com/MsVoxxie/ChiBot)\nMy Creator is 👑 Ms.Voxxie#0001\nCreate an Issue if anything comes up!")

        message.channel.send({ embed: embed });

    }
}