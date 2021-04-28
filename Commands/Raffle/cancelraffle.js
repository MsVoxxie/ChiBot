module.exports = {
	name: 'cancelraffle',
	aliases: ['cancel'],
	description: 'Cancel a raffle',
	category: 'Raffle',
	usage: '<message ID>',
	cooldown: '15',
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		// Declarations
		const messageID = args[0];

		// Checks
		if (!messageID) return message.lineReply('\nPlease provide a valid message ID of raffle to cancel.').then(s => s.delete({ timeout: 30 * 1000 }));

		// Do the reroll
		try {
			bot.Raffle.delete(messageID);
			message.lineReply('\nRaffle Cancelled.').then(s => s.delete({ timeout: 30 * 1000 }));
		}
		catch (e) {
			console.log(e);
		}
	},
};