const { MessageEmbed, escapeMarkdown } = require("discord.js");
const { readdirSync } = require("fs");
const ms = require("ms");

module.exports = {
    name: "help2",
    aliases: ["h2"],
    disabled: true,
    description: "(OLD) Display list of Commands",
    category: "Utility",
    botPerms: ["MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {

        //Init
        const cmd = args[0];
        const Categories = readdirSync("./Commands/");

        //Init Embed
        const helpEmbed = new MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
            .setColor(settings.color);

        //Command Info
        if (cmd) {
            const command = bot.commands.get(bot.aliases.get(cmd.toLowerCase()) || cmd.toLowerCase());
            if (!command) {
                helpEmbed
                    .setTitle("Invalid Command")
                    .setDescription(`Use \`${settings.prefix}help\` for the command list.`);
                return message.channel.send({ embed: helpEmbed });
            }

            helpEmbed.setDescription(`
            This guilds prefix is \`${settings.prefix}\`
            **Command›** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}
            **Aliases›** ${command.aliases.length ? command.aliases.join(" | ") : "None."}
            **Usage›** ${command.usage ? `${settings.prefix}${command.name} ${command.usage}` : `${settings.prefix}${command.name}`}
            **Cooldown›** ${command.cooldown ? ms(command.cooldown * 1000) : ms(2 * 1000)}
            **Description›** ${escapeMarkdown(command.description)}
            **Example›** ${escapeMarkdown(command.example ? `${settings.prefix}${command.name} ${command.example}` : "None Provided.")}
            `)
            message.channel.send({ embed: helpEmbed });
        } else {
            //Command List
            //Add Description
            helpEmbed
                .setTitle(`__**${bot.user.username} Commands**__`)
                .setDescription(`Command prefix is: ${settings.prefix}\nTo view more information on a command, use \`${settings.prefix}help <command>\`\n🔞 Represents an NSFW Command.\n🔒 Represents a Locked Command.\n<:xmark:753802620682109019> Represents a Disabled Command.\n`)
                .setFooter(`Total Commands› ${bot.commands.size}`);

            //Add commands to Embed
            Categories.forEach(Cat => {
                const dir = bot.commands.filter(c => {
                    if (!c.hidden) {
                        return c.category === Cat
                    }
                });
                const capitalize = Cat.slice(0, 1).toUpperCase() + Cat.slice(1);
                try {
                    helpEmbed.addField(`${capitalize} [${dir.size}] ›`, dir.map(command => `**${command.name}**${command.disabled ? "<:xmark:753802620682109019>" : ""}${command.nsfw ? "🔞" : ""}${command.ownerOnly ? "🔒" : ""} › ${command.description ? command.description : ""}`).join("\n"));
                } catch (e) {
                    console.log(e);
                }
            });
            message.channel.send({ embed: helpEmbed });
        }
    }
}