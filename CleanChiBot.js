const Discord = require('discord.js');
const { Token } = require('./DataStore/Config/Config.json');
const { GiveawaysManager } = require('discord-giveaways');
const ascii = require('ascii-table');
const table = new ascii().setHeading('Servers', 'Connection Status');

const lib = require('./Core/EventLoader.js');
const bot = new Discord.Client();
lib.setup(bot);

module.exports = { bot: bot };

// Debug mode
bot.debug = false;

// Command Info
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.cooldowns = new Discord.Collection();

// MusicBot
bot.queue = new Map();

// Database
bot.mongoose = require('./DataStore/Functions/mongoose');
bot.defaults = require('./DataStore/Database Models/databaseDefaults');
require('./DataStore/Functions/functions')(bot);

// Declare myself as Owner of bot.
bot.Owners = ['101789503634554880', '101790332437405696', '151636912602480640'];

// Raffle Manager
bot.Raffle = new GiveawaysManager(bot, {
	storage: './giveaways.json',
	updateCountdownEvery: 10000,
	default: {
		botsCanWin: false,
		embedColor: '#51db8f',
		embedColorEnd: '#4ee32d',
		reaction: '🎉',
	},
});

['Command Loader'].forEach(handler => {
	require(`./Events/${handler}`)(bot);
});

bot.once('ready', () => {
	bot.guilds.cache.forEach((f) => {
		table.addRow(`${f.name}`, '✔ -> Connected');
	});
	console.log(table.toString());
	bot.StartedAt = Date.now();
});

bot.mongoose.init();
bot.login(Token);