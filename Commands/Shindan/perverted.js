const { MessageEmbed } = require('discord.js');
const shindan = require('shindan')

module.exports = {
    name: "perverted",
    aliases: ["perv"],
    description: "How perverted are you?",
    example: "",
    category: "Shindan",
    botPerms: ["MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {

        const Member = message.mentions.members.first() || message.member;

        shindan.diagnose(289267, Member.displayName).then(async gen => {

            const embed = new MessageEmbed()
                .setDescription(`${gen.result} .`)
                .setColor(settings.color)
                .setFooter(`Requested by: ${message.member.displayName}`)

            message.channel.send({ embed: embed })

        });
    }
}