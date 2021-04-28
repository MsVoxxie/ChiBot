const { MessageEmbed, escapeMarkdown } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	name: 'rolelist',
	aliases: [],
	description: 'Displays this servers assignable roles.',
	category: 'Roles',
	usage: '',
	ownerOnly: false,
	hidden: false,
	nsfw: false,
	userPerms: ['MANAGE_ROLES'],
	botPerms: ['MANAGE_ROLES', 'MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {
		// Basic Checks
		if (isNaN(settings.roleAssignChannel)) return message.lineReply('\nSorry, This command connot be used without a `roleAssignChannel` set up.');
		if (message.channel.id != settings.roleAssignChannel) return message.lineReply(`\nPlease use this command in <#${settings.roleAssignChannel}>.`);

		// Get blacklist
		const badList = [];
		const Blacklist = JSON.parse(fs.readFileSync(path.join(__dirname, '../../DataStore/Blacklists/', './roles.json'), 'utf8'));
		const thisGuild = Blacklist[message.guild.id];

		if (thisGuild) {
			Object.entries(thisGuild).forEach(([k, role]) => {
				badList.push(role.roleID);
			});
		}

		// Assume staff roles are not assignable.
		const ignoredRoles = [
			'ADMINISTRATOR',
			'KICK_MEMBERS',
			'BAN_MEMBERS',
			'MANAGE_CHANNELS',
			'VIEW_AUDIT_LOG',
			'MANAGE_GUILD',
		];

		// Get the Roles and filter out undefined.
		const Roles = message.guild.roles.cache
			.sort((a, b) => b.position - a.position)
			.map(r => {
				if (
					!r.permissions.any(ignoredRoles) &&
                    !r.managed &&
                    r.id !== message.guild.id &&
                    !r.name.includes('Muted') &&
                    !r.name.includes('Trusted') &&
                    !r.name.includes('Nitro') &&
                    !badList.includes(r.id)
				) {return r.name;}
			})
			.filter(x => x !== undefined).join('\n');

		// Create the Embed
		const embed = new MessageEmbed()
			.setColor(settings.color)
			.setTitle(`**${message.guild.name}'s Roles**`)
			.setDescription(escapeMarkdown(Roles))
			.addField('To Assign a Role›', `${settings.prefix}role <rolename>`)
			.addField('To unAssign a Role›', `${settings.prefix}rmrole <rolename>`)
			.setFooter('Please Note› <rolename> means the roles name WITHOUT <> around it.');

		// Send it
		message.channel.send({ embed: embed });
	},
};