const { bot } = require('../CleanChiBot');
const { permissions } = require('../DataStore/Functions/util');
const ms = require('ms');
const { Collection } = require('discord.js');

bot.on('messageUpdate', async (oldMessage, newMessage) => {

	const message = newMessage;

	// Get Guild Settings
	let settings;
	try {
		settings = await bot.getGuild(message.guild);
	}
	catch (error) {
		console.error(error);
	}

	const prefixMention = new RegExp(`^<@!?${bot.user.id}> `);
	const prefixes = [message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : settings.prefix, 'chi,'];
	// const prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : settings.prefix;
	const prefix = prefixes.find(p => message.content.startsWith(p.toLowerCase()));

	// Check if users are improperly using role assignment channel.
	if (!isNaN(settings.roleAssignChannel)) {
		if (message.channel.id === settings.roleAssignChannel) {
			if (message.author.id != bot.user.id) {
				if (!message.content.startsWith(prefix)) {
					// message.lineReply('\nPlease do not talk in this channel, It is only for role assignment.').then(s => s.delete({ timeout: 30 * 1000 }));
					if(bot.HasChannelPermission(message.channel, 'MANAGE_MESSAGES')) {
						message.delete({ timeout: 15 * 1000 });
					}
					return;
				}
			}
		}
	}

	// Set up settings
	if (!message.content.startsWith(settings.prefix) || message.author.bot) return;
	const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
	const cmd = args.shift().toLowerCase();
	if (cmd.length === 0) return;

	// Command loader
	let command = bot.commands.get(cmd);
	if (!command) command = bot.commands.get(bot.aliases.get(cmd));
	if (!command) return;
	// if (!command) return message.delete({ timeout: 30 * 1000 });

	// Cooldown Manager
	if(command.cooldown !== 0) {
		if (!bot.cooldowns.has(command.name)) { bot.cooldowns.set(command.name, new Collection()); }

		const now = Date.now();
		const timestamps = bot.cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 2) * 1000;

		if (timestamps.has(message.author.id)) {
			const expireationTime = timestamps.get(message.author.id) + cooldownAmount;
			if (now < expireationTime) {
				const timeLeft = (expireationTime - now);
				return message.lineReply(`Please wait ${ms(timeLeft)} before using \`${command.name}\``).then(s => s.delete({ timeout: 30 * 1000 }));
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => {
			timestamps.delete(message.author.id);
		}, cooldownAmount);
	}

	// Check if command is Owner Only
	if (command.ownerOnly && !bot.Owners.includes(message.member.id)) {
		return message.lineReply('\nSorry, This command is locked.');
	}

	// Check if command is Disabled
	if (command.disabled && command.disabled === true) {
		return message.lineReply(`\nSorry, The command \`${command.name}\` is disabled.`).then(s => {
			if(bot.HasChannelPermission(s.channel, 'MANAGE_MESSAGES')) {
				s.delete({ timeout: 30 * 1000 });
			}
		});
	}

	// Check if args are required
	if (command.args && !args.length) {
		return message.lineReply(`\nThe command \`${command.name}\` requires arguments to function.\n**For example›** ${command.example ? `\`${settings.prefix}${command.name} ${command.example}\`` : `\`${settings.prefix}${command.name} ${command.usage}\``}`);
	}

	// Check for permissions of user
	if (command.userPerms) {
		const usermissing = message.channel.permissionsFor(message.author).missing(command.userPerms);
		if (usermissing.length > 0) {
			return message.lineReply(`\nSorry, The command \`${command.name}\` requires the following permissions:\n\`${usermissing.map(perm => permissions[perm]).join(', ')}\``).then(s => {
				if(bot.HasChannelPermission(s.channel, 'MANAGE_MESSAGES')) {
					s.delete({ timeout: 30 * 1000 });
				}
			});
		}
	}

	// Check for bot permissions
	if (command.botPerms) {
		const botmissing = message.channel.permissionsFor(message.guild.me).missing(command.botPerms);
		if (botmissing.length > 0) {
			return message.lineReply(`\nI cannot execute the command \`${command.name}\`, I'm missing the the following permissions:\n\`${botmissing.map(perm => permissions[perm]).join(', ')}\``).then(s => {
				if(bot.HasChannelPermission(s.channel, 'MANAGE_MESSAGES')) {
					s.delete({ timeout: 30 * 1000 });
				}
			});
		}
	}

	// Check if channel is nsfw
	if (!message.channel.nsfw && command.nsfw) {
		return message.lineReply('\nSorry this command may only be used in channels marked as `NSFW`.');
	}

	// Run Command
	try {
		if (command) {
			if (message) {
				if (message.channel) {
					if(bot.HasChannelPermission(message.channel, 'MANAGE_MESSAGES')) {
						message.delete({ timeout: 60 * 1000 }).catch(err => console.error(err));
					}
				}
			}
			if (bot.debug === true) {
				console.log(`User ${message.author.tag} executed the command "${command.name}" in ${message.guild.name} | ${message.channel.name}`);
			}
			command.execute(bot, message, args, settings);
		}
	}
	catch (e) {
		message.lineReply(`\nCommaned Execution Failed:\n${e}`);
	}
});