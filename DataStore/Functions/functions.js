const mongoose = require('mongoose');
const moment = require('moment');
const usersDB = require('../Database Models/Schematics/User.js');
const { Guild } = require('../Database Models');

module.exports = bot => {

	// SaveUserRoles
	bot.SaveUserRoles = async function(user) {
		let userDB = await usersDB.findOne({ id: user.id });

		const userRoles = [];
		user.roles.cache.forEach(r => {
			if(r.id !== user.guild.id) {
				userRoles.push(r);
			}
		});
		userDB = new usersDB({
			id: user.id,
			name: user.user.username,
			roles: userRoles,
			saveDate: bot.Timestamp(Date.now()),
		});
		await userDB.save().catch(err => console.log(err));
		return userDB;
	};

	// GetUserRoles
	bot.GetUserRoles = async function(user) {
		const userDB = await usersDB.findOne({ id: user.id });
		if(userDB) {
			return userDB;
		}
		else{
			return 'No User Found';
		}
	};

	// Database Functions
	bot.getGuild = async (guild) => {
		const data = await Guild.findOne({ guildID: guild.id });
		if (data) return data;
		else return bot.defaults.defaultSettings;
	};

	bot.updateGuild = async (guild, settings) => {
		let data = await bot.getGuild(guild);

		if (typeof data !== 'object') data = {};
		for (const key in settings) {
			if (data[key] !== settings[key]) data[key] = settings[key];
			else return;
		}
		console.log(`Guild "${data.guildName}" updated its settings: ${Object.keys(settings)}`);
		return await data.updateOne(settings);
	};

	bot.createGuild = async (settings) => {
		const defaults = Object.assign({ _id: mongoose.Types.ObjectId() }, bot.defaults.defaultSettings);
		const merged = Object.assign(defaults, settings);

		const newGuild = await new Guild(merged);
		return newGuild.save().then(console.log(`Default settings saved for guild "${merged.guildName}" (${merged.guildID})`));
	};

	// Bot Util Functions
	bot.clean = text => {
		if (typeof (text) === 'string') {
			return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
		}
		else {
			return text;
		}
	};

	bot.Timestamp = date => {
		return moment(date).format('MMMM Do YYYY, h:mm A');
	};

	bot.Time = date => {
		return moment(date).format('h:mm A');
	};

	bot.toThousands = x => {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	bot.msToTime = s => {
		let hrs = '';
		const ms = s % 1000;
		s = (s - ms) / 1000;
		const secs = s % 60;
		s = (s - secs) / 60;
		const mins = s % 60;
		const h = (s - mins) / 60;
		if (h >= 1) hrs = `${h}h`;

		return `${hrs} ${mins}m ${secs}s`;
	};

	bot.scramble = v => [...v].sort(_ => Math.random() - 0.5).join('');

};