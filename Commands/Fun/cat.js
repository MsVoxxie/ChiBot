const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "cat",
    aliases: [],
    description: "Random Cat image!",
    example: "",
    category: "Fun",
    usage: "",
    async execute(bot, message, args, settings) {

        let cat;
        await fetch('http://aws.random.cat/meow').then(r => r.json()).then(j => cat = j);

        const embed = new MessageEmbed()
            .setImage(`${cat.file}`)
            .setColor(settings.color)
            .setFooter(`A cat for ${message.author.username}!`);

        message.channel.send({ embed: embed });

    }
}