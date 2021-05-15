const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'temp',
	aliases: ['tc'],
	description: 'Creates a temporary voice and text channel.',
	category: 'TempChans',
	userPerms: ['SEND_MESSAGES'],
	botPerms: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		// Check
		const Valid = await bot.tempchannels.find(o => o.guild === message.guild && o.owner === message.author);
		if(Valid) return message.lineReply(`You already own the category \`${Valid.category.name}\`, please delete it before making a new one.`).then(s => s.delete({ timeout: 30 * 1000 }));

		// Declarations
		const Roles = await message.mentions.roles;
		const Members = await message.mentions.members;
		const Permissions = [
			{
				id: message.guild.id,
				deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
			},
			{
				id: message.author,
				allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
			},
			{
				id: message.guild.me.id,
				allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
			},
		];

		// Setup embed
		const embed = new MessageEmbed()
			.setTitle(`Welcome to ${message.member.user.tag}'s Private Channels`)
			.setColor(settings.color)
			.setDescription(`<@!${message.member.id}>\nPlease use the \`${settings.prefix}deltemp\` command once you are done with the channels!`)
			.setTimestamp();

		// Create Category and Channels
		const Category = await message.guild.channels.create(`${bot.trim(`${message.member.nickname ? message.member.nickname : message.member.user.tag}`, 20)}'s Channels`, {
			type: 'category',
		});
		// await Category.createOverwrite(message.guild.id, { VIEW_CHANEL: false });
		const Voice = await message.guild.channels.create('voice-chat', { type: 'voice' });
		const Text = await message.guild.channels.create('text chat', { type: 'text' });

		// Set Permissions for Roles
		await Roles.forEach(async (role) => {
			Roles.push({ id: role.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] });
		});

		// Set Permissions for Members
		await Members.forEach(async (member) => {
			Permissions.push({ id: member.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] });
		});

		await Category.overwritePermissions(Permissions);

		// Set Parents
		await Voice.setParent(Category, { lockPermissions:true });
		await Text.setParent(Category, { lockPermissions:true }).then(s => s.send({ embed: embed }));
		await bot.tempchannels.push({ id: bot.tempid, guild: message.guild, owner: message.author, category: Category });
		console.log(bot.tempid);
		bot.tempid++;

		// Send Messages
		await message.lineReply(`Created your personal Category ${Category.name}`).then(s => s.delete({ timeout: 30 * 1000 }));
	},
};