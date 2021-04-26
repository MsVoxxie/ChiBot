const Similar = require('string-similarity');
const { MessageEmbed, escapeMarkdown } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	name: 'removerole',
	aliases: ['rmrole', 'rr'],
	description: 'Allows users to unassign roles from themselves.',
	category: 'Roles',
	usage: '<role>',
	args: true,
	ownerOnly: false,
	hidden: false,
	nsfw: false,
	userPerms: [],
	botPerms: ['MANAGE_ROLES', 'MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {
		// Basic Checks
		if (isNaN(settings.roleAssignChannel)) return message.reply('\nSorry, This command connot be used without a `roleAssignChannel` set up.');
		if (message.channel.id != settings.roleAssignChannel) return message.reply(`\nPlease use this command in <#${settings.roleAssignChannel}>.`);

		// Init Embed
		const embed = new MessageEmbed()
			.setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
			.setColor(settings.color)
			.setFooter('Deleting Message in 1m');

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
		const validRoles = message.guild.roles.cache
			.sort((a, b) => b.position - a.position)
			.map(r => {
				if (
					!r.permissions.any(ignoredRoles) &&
                    r.permissions.has('SEND_MESSAGES') &&
                    r.id !== message.guild.id &&
                    !r.name.includes('Trusted') &&
                    !r.name.includes('Nitro')
				) {return r.name;}
			})
			.filter(x => x !== undefined);

		// Declarations
		const member = message.member;
		const PossibleRoles = validRoles;
		const Rolecase = args.join(' ');
		const Words = Rolecase.split(' ');
		const UpperWords = [];
		let wasMatched = false;

		// Make the first letter of each word uppercase
		for (let x = 0; x < Words.length; x++) { UpperWords.push(Words[x].charAt(0).toUpperCase() + Words[x].slice(1)); }
		const Role = UpperWords.join(' ');

		// Check if Role matches a role in the Guild, if not. Find best match.
		let gRole = await message.guild.roles.cache.find(r => r.name === Role.charAt(0).toUpperCase() + Role.slice(1));

		if (!gRole) {
			if (!PossibleRoles.length) return message.reply('\nNo role found. Check spelling or spacing.').then(s => s.delete({ timeout: 30 * 1000 }));
			const Matches = Similar.findBestMatch(Role, PossibleRoles);
			gRole = await message.guild.roles.cache.find(r => r.name === Matches.bestMatch.target);
			if (badList.includes(gRole.id)) return message.reply('\nSorry, This role is blacklisted.').then(s => s.delete({ timeout: 30 * 1000 }));
			embed.addField(`Failed to find "${Role}".`, `unAssigning Best Match "\`${Matches.bestMatch.target}\`"`).then(s => s.delete({ timeout: 60 * 1000 }));
			wasMatched = true;
		}

		// Nothing Found, Return.
		if (!gRole) return message.reply('\nNo Roles found of similar spelling.').then(s => s.delete({ timeout: 60 * 1000 }));

		// Check if user has the role
		if (!member.roles.cache.has(gRole.id)) return message.reply(`\nYou don't have the role \`${gRole.name}\`.`).then(s => s.delete({ timeout: 60 * 1000 }));

		// Update embed with information
		if (!wasMatched) {
			embed.setDescription(`**Role unAssigned**\nunAssigned \`${gRole.name}\``);
		}

		// Assign Role
		await member.roles.remove(gRole.id);
		const mRoles = message.member.roles.cache
			.sort((a, b) => b.position - a.position)
			.map(r => {if (!r.managed && r.id !== message.guild.id) {return r.name;}})
			.filter(x => x !== undefined);
		await bot.updateMember(member, { roles: mRoles });
		await message.channel.send({ embed: embed });
	},
};