const { MessageEmbed } = require('discord.js');
// const ampapi = require('@cubecoders/ampapi');

module.exports = {
	name: 'test',
	aliases: [],
	description: 'test cmd',
	category: 'Owner Only',
	usage: '',
	ownerOnly: false,
	hidden: true,
	nsfw: false,
	userPerms: [],
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		async function start() {
			const API = new ampapi.AMPAPI('http://web.voxxie.me:8080/');
			try {
				// Perform first-stage API initialization.
				let APIInitOK = await API.initAsync();
				if (!APIInitOK) {
					console.log('API Init failed');
					return;
				}

				// The third parameter is either used for 2FA logins, or if no password is specified to use a remembered token from a previous login, or a service login token.
				const loginResult = await API.Core.LoginAsync('MsVoxxie', 'Rikapoo12', '', false);
				if (loginResult.success) {
					console.log('Login successful');
					API.sessionId = loginResult.sessionID;

					// Perform second-stage API initialization, we only get the full API data once we're logged in.
					APIInitOK = await API.initAsync();

					if (!APIInitOK) {
						console.log('API Stage 2 Init failed');
						return;
					}

					// API call parameters are simply in the same order as shown in the documentation.
					// await API.Core.SendConsoleMessageAsync("say Hello Everyone, this message was sent from the Node API!");
					// var currentStatus = await API.Core.GetStatusAsync();
					// console.log(`Current CPU usage is: ${currentStatus.Metrics["CPU Usage"].Percent}%`);
					const Ints = await API.ADSModule.UpgradeInstance;
					console.log(Ints);
				}
				else {
					console.log('Login failed');
					console.log(loginResult);
				}
			}
			catch (err) {
				console.log(err);
			}
		}

		start();

	},
};