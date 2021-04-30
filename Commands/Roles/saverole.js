module.exports = {
	name: 'saverole',
	aliases: ['sr'],
	description: '',
	example: '',
	category: '',
	usage: '',
	cooldown: 0,
	hidden: true,
	ownerOnly: true,
	async execute(bot, message, args, settings) {

		// Definitions
		const guild = await bot.getRoles(message.guild);
		const oldRoles = guild.assignableRoles.sort((a, b) => b.position - a.position);
		const compareRoles = [];
		const newRoles = [];
		await oldRoles.forEach(r => {
			newRoles.push(r);
		});

		// Generate comparison list
		Object.entries(oldRoles).forEach(async ([k, role]) => {
			compareRoles.push(role.name);
		});

		// Get Role
		const role = args.join(' ');
		if(compareRoles.includes(role)) return message.lineReply(`The role \`${role}\` has already been added to the guild.`).then(s => s.delete({ timeout: 30 * 1000 }));
		const findRole = await message.guild.roles.cache.find(r => r.name === role);
		if(!findRole) return message.lineReply(`Couldn't find the role \`${role}\`, check spelling and casing.`).then(s => s.delete({ timeout: 30 * 1000 }));
		newRoles.push({ name: findRole.name, id: findRole.id });
		await bot.updateRoles(message.guild, { assignableRoles: newRoles });
		await message.lineReply(`Added \`${findRole.name}\`.`).then(s => s.delete({ timeout: 30 * 1000 }));
	},
};