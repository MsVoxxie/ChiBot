const mongoose = require('mongoose');
const moment = require('moment');
// const usersDB = require('../Database Models/Schematics/User.js');
const { Guild, GuildRoles, User } = require('../Database Models');

module.exports = bot => {

	// User DB Functions
	bot.getMember = async (member) => {
		const data = await User.findOne({ guildID: member.guild.id, id: member.id });
		if(data) {return data;}
		else {
			const mRoles = member.roles.cache
				.sort((a, b) => b.position - a.position)
				.map(r => {if (!r.managed && r.id !== member.guild.id) {return r.name;}})
				.filter(x => x !== undefined);
			const newMember = {
				guildName: member.guild.name,
				guildID: member.guild.id,
				id: member.id,
				tag: member.user.tag,
				nickname: member.nickname ? member.nickname : 'none',
				trust: '0',
				roles: mRoles ? mRoles : [],
			};
			return await bot.createMember(newMember);
		}
	};

	bot.updateMember = async (member, settings) => {
		let data = await bot.getMember(member);
		if (typeof data !== 'object') data = {};
		for (const key in settings) {
			if (data[key] !== settings[key]) data[key] = settings[key];
			else return;
		}
		if(bot.debug) {console.log(`Member ${data.tag} had their data updated: ${Object.keys(settings)}`);}
		return await data.updateOne(settings);
	};

	bot.createMember = async (settings) => {
		const newMember = await new User(settings);
		return newMember.save().then(console.log(`New user Created: ${settings.tag} in Guild: ${settings.guildName}`));
	};

	// Guild Roles
	bot.getRoles = async (guild) => {
		const data = await GuildRoles.findOne({ guildID: guild.id });
		if(data) {return data;}
		else {
			const newRoles = {
				guildName: guild.name,
				guildID: guild.id,
				assignableRoles: [],
			};
			return bot.createRoles(newRoles);
		}
	};

	bot.updateRoles = async (guild, settings) => {
		let data = await bot.getRoles(guild);
		if (typeof data !== 'object') data = {};
		for (const key in settings) {
			if (data[key] !== settings[key]) data[key] = settings[key];
			else return;
		}
		if(bot.debug) {console.log(`Guild ${guild.name} updated it's role data: ${Object.keys(settings)}`);}
		return await data.updateOne(settings);
	};

	bot.createRoles = async (guild) => {
		const newGuild = await new GuildRoles(guild);
		return newGuild.save().then(console.log(`New GuildRoles array created for ${guild.guildName}`));
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
		if(bot.debug) {console.log(`Guild "${data.guildName}" updated its settings: ${Object.keys(settings)}`);}
		return await data.updateOne(settings);
	};

	bot.createGuild = async (settings) => {
		const defaults = Object.assign({ _id: mongoose.Types.ObjectId() }, bot.defaults.defaultSettings);
		const merged = Object.assign(defaults, settings);

		const newGuild = await new Guild(merged);
		return newGuild.save().then(console.log(`Default settings saved for guild "${merged.guildName}" (${merged.guildID})`));
	};

	// Bot Util Functions

	bot.HasChannelPermission = async (channel, permission) => {
		if(channel) {
			try {
				return channel.permissionsFor(channel.guild.me).has(`${permission}`);
			}
			catch (error) {
				console.error(error);
			}
		}
	};

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

	bot.trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

	bot.chunkArray = (array, size) => {
		const result = [];
		for (value of array) {
			const lastArray = result[result.length - 1 ];
			if(!lastArray || lastArray.length == size) {
				result.push([value]);
			}
			else{
				lastArray.push(value);
			}
		}
		return result;
	};

};