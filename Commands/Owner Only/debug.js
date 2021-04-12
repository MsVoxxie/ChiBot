module.exports = {
	name: 'debug',
	aliases: [],
	description: 'Toggle Verbosity on or off',
	category: 'Owner Only',
	ownerOnly: true,
	hidden: false,
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		if (bot.debug === false) {
			bot.debug = true;
			return message.reply('\nToggled debug mode `ON` for this session.').then(s => s.delete({ timeout: 30 * 1000 }));
		}

		if (bot.debug === true) {
			bot.debug = false;
			return message.reply('\nToggled debug mode `OFF`for this session.').then(s => s.delete({ timeout: 30 * 1000 }));
		}
	},
};