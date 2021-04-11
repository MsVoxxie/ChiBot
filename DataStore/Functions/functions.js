const mongoose = require('mongoose');
const moment = require('moment');
// const usersDB = require('../Database Models/Schematics/User.js');
const { Guild, User } = require('../Database Models');

module.exports = bot => {

	// User DB Functions
	bot.getMember = async (member) => {
		const data = await User.findOne({ guildID: member.guild.id, id: member.id });
		if(data) return data;
		else return 'No user was found!';
	};

	bot.updateMember = async (member, settings) => {
		let data = await bot.getMember(member);
		if (typeof data !== 'object') data = {};
		for (const key in settings) {
			if (data[key] !== settings[key]) data[key] = settings[key];
			else return;
		}
		console.log(`Member ${data.tag} had their data updated: ${Object.keys(settings)}`);
		return await data.updateOne(settings);
	};

	bot.createMember = async (settings) => {
		const newMember = await new User(settings);
		return newMember.save().then(console.log(`New user Created: ${settings.tag}`));
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
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

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