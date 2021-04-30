// const Similar = require('string-similarity');
const { MessageEmbed } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	name: 'roles',
	aliases: ['role2', 'ar2'],
	description: 'Role Assignment v2',
	example: '',
	category: 'Roles',
	usage: '',
	hidden: false,
	ownerOnly: false,
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
		const validRoles = message.guild.roles.cache
			.sort((a, b) => b.position - a.position)
			.map(r => {
				if (
					!r.permissions.any(ignoredRoles) &&
                    r.permissions.has('SEND_MESSAGES') &&
                    r.id !== message.guild.id &&
                    !r.name.includes('Trusted') &&
                    !r.name.includes('Nitro') &&
					!r.name.includes('Muted') &&
                    !r.name.includes('-')
				) {return r.name;}
			})
			.filter(x => x !== undefined);

		// Declarations
		const member = message.member;
		const PossibleRoles = validRoles;
		const assignList = [];
		const removeList = [];

		// Embed Setup
		const embed = new MessageEmbed()
			.setAuthor(message.member.user.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setColor(settings.color)
			.setDescription(`To Add a role please use \`a <rolename>\`\nTo Remove a role please use \`r <rolename>\nOnce you're finished type \`finish\`\n\nRoles to Add› ${assignList.length > 0 ? assignList.map(r => r.name).join(', ') : 'None'}\n\nRoles to Remove› ${removeList.length > 0 ? removeList.map(r => r.name).join(', ') : 'None'}`);

		// Collector
		const filter = m => m.author === message.author;
		const collector = await message.channel.createMessageCollector(filter, { time: 600 * 1000 });
		const Confirm = await message.channel.send({ embed: embed });

		collector.on('collect', async msg => {

			const slice = msg.content.slice(1).trim().split(/ +/);

			if(msg.content.toLowerCase() === 'finish') {
				if(assignList.length > 0) {
					assignList.forEach(async r => {await member.roles.add(r.id);});
				}
				if(removeList.length > 0) {
					removeList.forEach(async r => {await member.roles.remove(r.id);});
				}

				embed.setDescription('***Roles Assigned / Removed!***');
				embed.setFooter('Deleting Message in 1m');
				await Confirm.edit({ embed: embed }).then(c => c.delete({ timeout: 60 * 1000 }));
				await collector.stop();
				return;
			}

			// ADD
			if(msg.content.toLowerCase().startsWith('a')) {
				// Make Arguments Uppercase
				const Rolecase = slice.join(' ');
				const Words = Rolecase.split(' ');
				const UpperWords = [];

				// Make the first letter of each word uppercase
				for (let x = 0; x < Words.length; x++) { UpperWords.push(Words[x].charAt(0).toUpperCase() + Words[x].slice(1)); }
				const Role = UpperWords.join(' ');

				// Check if Role matches a role in the Guild, if not. Find best match.
				const gRole = await message.guild.roles.cache.find(r => r.name === Role.charAt(0).toUpperCase() + Role.slice(1));

				// if (!gRole) {
				// 	// if (!PossibleRoles.length) return message.lineReply('\nNo role found. Check spelling or spacing.').then(s => s.delete({ timeout: 15 * 1000 }));
				// 	// const Matches = Similar.findBestMatch(Role, PossibleRoles);
				// 	// gRole = await message.guild.roles.cache.find(r => r.name === `${Matches.bestMatch.target}`);
				// 	// if (badList.includes(gRole.id)) return message.lineReply('\nSorry, This role is blacklisted.').then(s => s.delete({ timeout: 15 * 1000 }));
				// }

				// Nothing Found, Return.
				if (!gRole) return message.lineReply('\nNo Roles found of similar spelling.').then(s => s.delete({ timeout: 15 * 1000 }));
				if (badList.includes(gRole.id)) return message.lineReply('\nSorry, This role is blacklisted.').then(s => s.delete({ timeout: 15 * 1000 }));
				if (!PossibleRoles.length) return message.lineReply('\nNo role found. Check spelling or spacing.').then(s => s.delete({ timeout: 15 * 1000 }));

				// Return if the role has staff permissions
				if (gRole.permissions.any(ignoredRoles)) return message.lineReply('\nYou cannot assign this role.').then(s => s.delete({ timeout: 15 * 1000 }));

				// Check if user has the role already
				if (member.roles.cache.has(gRole.id)) return message.lineReply(`\nYou already have the role \`${gRole.name}\`.`).then(s => s.delete({ timeout: 15 * 1000 }));

				if(!assignList.includes(gRole)) { assignList.push(gRole); }
				embed.setDescription(`To Add a role please use \`a <rolename>\`\nTo Remove a role please use \`r <rolename>\nOnce you're finished type \`finish\`\n\nRoles to Add› ${assignList.length > 0 ? assignList.map(r => r.name).join(', ') : 'None'}\n\nRoles to Remove› ${removeList.length > 0 ? removeList.map(r => r.name).join(', ') : 'None'}`);
				Confirm.edit({ embed: embed });
			}

			// Remove
			if(msg.content.toLowerCase().startsWith('r')) {
				// Make Arguments Uppercase
				const Rolecase = slice.join(' ');
				const Words = Rolecase.split(' ');
				const UpperWords = [];

				// Make the first letter of each word uppercase
				for (let x = 0; x < Words.length; x++) { UpperWords.push(Words[x].charAt(0).toUpperCase() + Words[x].slice(1)); }
				const Role = UpperWords.join(' ');

				// Check if Role matches a role in the Guild, if not. Find best match.
				const gRole = await message.guild.roles.cache.find(r => r.name === Role.charAt(0).toUpperCase() + Role.slice(1));

				// if (!gRole) {
				// 	// if (!PossibleRoles.length) return message.lineReply('\nNo role found. Check spelling or spacing.').then(s => s.delete({ timeout: 15 * 1000 }));
				// 	// const Matches = Similar.findBestMatch(Role, PossibleRoles);
				// 	// gRole = await message.guild.roles.cache.find(r => r.name === Matches.bestMatch.target);
				// 	// if (badList.includes(gRole.id)) return message.lineReply('\nSorry, This role is blacklisted.').then(s => s.delete({ timeout: 15 * 1000 }));
				// }

				// Nothing Found, Return.
				if (!gRole) return message.lineReply('\nNo Roles found of similar spelling.').then(s => s.delete({ timeout: 15 * 1000 }));
				if (badList.includes(gRole.id)) return message.lineReply('\nSorry, This role is blacklisted.').then(s => s.delete({ timeout: 15 * 1000 }));
				if (!PossibleRoles.length) return message.lineReply('\nNo role found. Check spelling or spacing.').then(s => s.delete({ timeout: 15 * 1000 }));

				// Check if user has the role
				if (!member.roles.cache.has(gRole.id)) return message.lineReply(`\nYou don't have the role \`${gRole.name}\`.`).then(s => s.delete({ timeout: 15 * 1000 }));

				if(!removeList.includes(gRole)) { removeList.push(gRole); }
				embed.setDescription(`To Add a role please use \`a <rolename>\`\nTo Remove a role please use \`r <rolename>\nOnce you're finished type \`finish\`\n\nRoles to Add› ${assignList.length > 0 ? assignList.map(r => r.name).join(', ') : 'None'}\n\nRoles to Remove› ${removeList.length > 0 ? removeList.map(r => r.name).join(', ') : 'None'}`);
				Confirm.edit({ embed: embed });
			}
		});
	},
};