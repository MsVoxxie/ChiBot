module.exports = {
	name: 'loadroles',
	aliases: ['lr'],
	description: 'Load your previously saved roles, if you had any!',
	example: '',
	category: 'Roles',
	usage: '',
	hidden: false,
	ownerOnly: false,
	userPerms: ['SEND_MESSAGES'],
	botPerms: ['MANAGE_ROLES'],
	async execute(bot, message, args, settings) {

		// Declarations
		const member = await bot.getMember(message.member);
		const memRoles = await member.roles;
		const roles = [];
		let assignedCount = 0;

		await memRoles.forEach(async r => {
			const found = await message.guild.roles.cache.find(fr => fr.name === r);
			roles.push(found.id);
		});

		roles.forEach(async r => {
			if(!message.member.roles.cache.has(r)) {
				console.log(`Assigning ${r} to ${message.member.user.tag}`);
				assignedCount++;
				await message.member.roles.add(r);
			}
		});
		if(message.channel) {
			await message.lineReply(`Reassigned a total of ${assignedCount} roles!`).then(s => s.delete({ timeout: 60 * 1000 }));
		}
	},
};