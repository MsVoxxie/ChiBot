module.exports = {
	name: 'restart',
	aliases: [],
	description: 'Restart the Bot',
	category: 'Owner Only',
	ownerOnly: true,
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args) {
		try {
			await message.lineReply('Restarting!');
			process.exit(1);
		}
		catch (e) {
			message.lineReply(`\nERROR: ${e.message}`);
		}
	},
};