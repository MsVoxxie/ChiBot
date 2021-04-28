const path = require('path');
const { readFileSync, writeFileSync } = require('fs');

module.exports = {
	name: 'addchan',
	aliases: [],
	description: 'Add a Twitch channel to the Watch list.\n(Requires streamNotifChannel to be Set)',
	category: 'Streaming',
	usage: '<TwitchChannelName> or <Twitch URL>',
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {
		// Declarations
		const channels = JSON.parse(readFileSync(path.join(__dirname, './channels.json'), 'utf8'));
		let addChan = message.content.split('twitch.tv/');
		const setChans = [];

		if (addChan[1]) {
			addChan = addChan[1];
		}
		else {
			addChan = args[0];
		}

		// Checks
		if (!addChan) message.lineReply('\nPlease provide a channel name to add.').then(s => s.delete({ timeout: 30 * 1000 }));

		// Setup "Database"
		if (!channels[message.guild.id]) { channels[message.guild.id] = {}; }
		Object.values(channels[message.guild.id]).forEach(element => { setChans.push(element.ChannelName); });

		if (setChans.some(ch => ch === addChan)) return message.lineReply('\nThis channel is already being watched.').then(s => s.delete({ timeout: 30 * 1000 }));

		channels[message.guild.id][addChan] = {
			ChannelName: '',
			postMessage: '',
			LastPost: '',
			Offline: true,
		};
		channels[message.guild.id][addChan].ChannelName = addChan;

		// Write to Database
		writeFileSync(path.join(__dirname, './channels.json'), JSON.stringify(channels, null, 2), function(err) {
			if (err) return message.lineReply('\nAn error occured, Did not save channel.').then(s => s.delete({ timeout: 30 * 1000 }));
		});
		message.lineReply(`\nAdded ${addChan} to database.`).then(s => s.delete({ timeout: 30 * 1000 }));
	},
};