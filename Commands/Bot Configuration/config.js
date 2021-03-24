const { MessageEmbed, escapeMarkdown } = require("discord.js");
module.exports = {
    name: "config",
    aliases: ["set"],
    description: "Changes Guild Configuration files for the Bot.",
    category: "Bot Configuration",
    usage: " | <setting> | <setting> <new setting>",
    example: "prefix %",
    userPerms: ["MANAGE_GUILD"],
    async execute(bot, message, args, settings) {

        const setting = args[0];
        const newSetting = args.slice(1).join(" ");

        switch (setting) {
            //Prefix
            case "prefix": {
                if (!newSetting) return message.reply(`\nCurrent prefix: \`${settings.prefix}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {
                    await bot.updateGuild(message.guild, { prefix: newSetting });
                    message.reply(`\nPrefix Updated: \`${newSetting}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: **${error.message}**`).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //Color
            case "color": {
                if (!newSetting) return message.reply(`\nCurrent color: \`${settings.color}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {
                    await bot.updateGuild(message.guild, { color: newSetting });
                    message.reply(`\nColor Updated: \`${newSetting}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: **${error.message}**`).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //welcomeMessage
            case "welcomeMessage": {
                if (!newSetting) return message.reply(`\nCurrent welcomeMessage: \`${escapeMarkdown(settings.welcomeMessage)}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {
                    await bot.updateGuild(message.guild, { welcomeMessage: newSetting });
                    message.reply(`\nwelcomeMessage Updated: \`${escapeMarkdown(newSetting)}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: **${error.message}**`).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }

            //Start Booleans
            //Allow Invites
            case "allowUserInvites": {
                if (!newSetting) return message.reply(`\nallowUserInvites: \`${settings.allowUserInvites}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {
                    await bot.updateGuild(message.guild, { allowUserInvites: newSetting });
                    message.reply(`\nSetting Updated: allowUserInvites:\`${newSetting}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: **${error.message}**`).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //shouldLog
            case "shouldLog": {
                if (!newSetting) return message.reply(`\nshouldLog: \`${settings.shouldLog}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {
                    await bot.updateGuild(message.guild, { shouldLog: newSetting });
                    message.reply(`\nSetting Updated: shouldLog:\`${newSetting}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: **${error.message}**`).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //shouldWelcome
            case "shouldWelcome": {
                if (!newSetting) return message.reply(`\nshouldWelcome: \`${settings.shouldWelcome}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {
                    await bot.updateGuild(message.guild, { shouldWelcome: newSetting });
                    message.reply(`\nSetting Updated: shouldWelcome:\`${newSetting}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: **${error.message}**`).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //profanityFilter
            case "profanityFilter": {
                if (!newSetting) return message.reply(`\nprofanityFilter: \`${settings.profanityFilter}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {
                    await bot.updateGuild(message.guild, { profanityFilter: newSetting });
                    message.reply(`\nSetting Updated: profanityFilter:\`${newSetting}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: **${error.message}**`).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //pinboardEnabled
            case "pinboardEnabled": {
                if (!newSetting) return message.reply(`\npinboardEnabled: \`${settings.pinboardEnabled}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {
                    await bot.updateGuild(message.guild, { pinboardEnabled: newSetting });
                    message.reply(`\nSetting Updated: pinboardEnabled:\`${newSetting}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: **${error.message}**`).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //Start Roles
            //ownerRole
            case "ownerRole": {
                if (!newSetting) return message.reply(`\nownerRole: \`${settings.ownerRole}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {

                    const role = message.mentions.roles.first();

                    await bot.updateGuild(message.guild, { ownerRole: `${role.id ? role.id : newSetting}` });
                    message.reply(`\nSetting Updated: ownerRole: ${role.id ? role.name : newSetting}`).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: **${error.message}**`).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //adminRole
            case "adminRole": {

                const role = message.mentions.roles.first();

                if (!newSetting) return message.reply(`\nadminRole: \`${settings.adminRole}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {
                    await bot.updateGuild(message.guild, { adminRole: `${role.id ? role.id : newSetting}` });
                    message.reply(`\nSetting Updated: adminRole: ${role.id ? role.name : newSetting}`).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: **${error.message}**`).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //modRole
            case "modRole": {

                const role = message.mentions.roles.first();

                if (!newSetting) return message.reply(`\nmodRole: ${role.id ? role.name : newSetting}`).then(s => s.delete({ timeout: 60 * 1000 }));
                try {
                    await bot.updateGuild(message.guild, { modRole: newSetting });
                    message.reply(`\nSetting Updated: modRole:\`${newSetting}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: **${error.message}**`).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //Start Channels
            //welcomeChannel
            case "welcomeChannel": {
                if (!newSetting) return message.reply(`\nwelcomeChannel: \`${settings.welcomeChannel}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {

                    let channel = message.mentions.channels.first();

                    await bot.updateGuild(message.guild, { welcomeChannel: `${channel.id ? channel.id : newSetting}` });
                    message.reply(`\nSetting Updated: welcomeChannel: ${channel.id ? channel : newSetting}`).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: ** ${error.message} ** `).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //rulesChannel
            case "rulesChannel": {
                if (!newSetting) return message.reply(`\nrulesChannel: \`${settings.rulesChannel}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {

                    let channel = message.mentions.channels.first();

                    await bot.updateGuild(message.guild, { rulesChannel: `${channel.id ? channel.id : newSetting}` });
                    message.reply(`\nSetting Updated: rulesChannel: ${channel.id ? channel : newSetting}`).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: **${error.message}**`).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //auditLogChannel
            case "auditLogChannel": {
                if (!newSetting) return message.reply(`\nauditLogChannel: \`${settings.auditLogChannel}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {

                    let channel = message.mentions.channels.first();

                    await bot.updateGuild(message.guild, { auditLogChannel: `${channel.id ? channel.id : newSetting}` });
                    message.reply(`\nSetting Updated: auditLogChannel: ${channel.id ? channel : newSetting}`).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: ** ${error.message} ** `).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //roleAssignChannel
            case "roleAssignChannel": {
                if (!newSetting) return message.reply(`\nroleAssignChannel: \`${settings.roleAssignChannel}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {

                    let channel = message.mentions.channels.first();

                    await bot.updateGuild(message.guild, { roleAssignChannel: `${channel.id ? channel.id : newSetting}` });
                    message.reply(`\nSetting Updated: roleAssignChannel: ${channel.id ? channel : newSetting}`).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: **${error.message}**`).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //streamNotifChannel
            case "streamNotifChannel": {
                if (!newSetting) return message.reply(`\nstreamNotifChannel: \`${settings.streamNotifChannel}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {

                    let channel = message.mentions.channels.first();

                    await bot.updateGuild(message.guild, { streamNotifChannel: `${channel.id ? channel.id : newSetting}` });
                    message.reply(`\nSetting Updated: streamNotifChannel: ${channel.id ? channel : newSetting}`).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: **${error.message}**`).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //pinboardChannel
            case "pinboardChannel": {
                if (!newSetting) return message.reply(`\npinboardChannel: \`${settings.pinboardChannel}\``).then(s => s.delete({ timeout: 60 * 1000 }));
                try {

                    let channel = message.mentions.channels.first();

                    await bot.updateGuild(message.guild, { pinboardChannel: `${channel.id ? channel.id : newSetting}` });
                    message.reply(`\nSetting Updated: pinboardChannel: ${channel.id ? channel : newSetting}`).then(s => s.delete({ timeout: 60 * 1000 }));
                } catch (error) {
                    message.reply(`\nAn error occurred: **${error.message}**`).then(s => s.delete({ timeout: 60 * 1000 }));
                }
                break;
            }
            //Default
            default: {
                try {
                    const list = new MessageEmbed()
                        .setTitle(`__**${message.guild.name}'s Configuration**__`)
                        .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
                        .setColor(settings.color)
                        .setDescription(`

                    **prefix›** ${settings.prefix}
                    **color›** ${settings.color}

                    **welcomeMessage›** ${escapeMarkdown(settings.welcomeMessage)}
                    *Note:
                    {nl} = new line.
                    {user} = joined user.
                    {server} = server name.
                    {channel} = the guilds configured rules channel.*

                    **allowUserInvites›** ${settings.allowUserInvites}

                    **shouldLog›** ${settings.shouldLog}
                    **shouldWelcome›** ${settings.shouldWelcome}
                    **profanityFilter›** ${settings.profanityFilter}
                    **pinboardEnabled›** ${settings.pinboardEnabled}

                    **ownerRole›** ${!isNaN(settings.ownerRole) ? message.guild.roles.cache.get(settings.ownerRole) : "Not Set, Please mention Role or set Role ID."}
                    **adminRole›** ${!isNaN(settings.adminRole) ? message.guild.roles.cache.get(settings.adminRole) : "Not Set, Please mention Role or set Role ID."}
                    **modRole›** ${!isNaN(settings.modRole) ? message.guild.roles.cache.get(settings.modRole) : "Not Set, Please mention Role or set Role ID."}
                    
                    **welcomeChannel›** ${!isNaN(settings.welcomeChannel) ? message.guild.channels.cache.get(settings.welcomeChannel) : "Not Set, Please mention Channel or set Channel ID."}
                    **rulesChannel›** ${!isNaN(settings.rulesChannel) ? message.guild.channels.cache.get(settings.rulesChannel) : "Not Set, Please mention Channel or set Channel ID."}
                    **auditLogChannel›** ${!isNaN(settings.auditLogChannel) ? message.guild.channels.cache.get(settings.auditLogChannel) : "Not Set, Please mention Channel or set Channel ID."}
                    **roleAssignChannel›** ${!isNaN(settings.roleAssignChannel) ? message.guild.channels.cache.get(settings.roleAssignChannel) : "Not Set, Please mention Channel or set Channel ID."}
                    **streamNotifChannel›** ${!isNaN(settings.streamNotifChannel) ? message.guild.channels.cache.get(settings.streamNotifChannel) : "Not Set, Please mention Channel or set Channel ID."}
                    **pinboardChannel›** ${!isNaN(settings.pinboardChannel) ? message.guild.channels.cache.get(settings.pinboardChannel) : "Not Set, Please mention Channel or set Channel ID."}
                    `)
                        .setFooter(`To update a setting - ${settings.prefix}config <option> <newoption>`);
                    message.channel.send({ embed: list }).then(s => s.delete({ timeout: 600 * 1000 }));
                } catch (error) {
                    console.error(error);
                }
            }
        }

    }
}