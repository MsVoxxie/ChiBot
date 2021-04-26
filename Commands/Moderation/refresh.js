const { MessageEmbed, splitMessage, escapeMarkdown } = require('discord.js');
const { writeFile } = require('fs');
const path = require('path');

module.exports = {
	name: 'refresh',
	aliases: ['delall'],
	description: 'Completely clear the channels contents.',
	category: 'Moderation',
	usage: '',
	userPerms: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
	botPerms: ['MANAGE_CHANNELS'],
	async execute(bot, message, args, settings) {

		const oldChan = message.channel;
		const oldName = oldChan.name;
		const isNSFW = oldChan.nsfw;
		const oldTopic = oldChan.topic;
		const oldParent = oldChan.parent;
		const oldPerms = oldChan.permissionOverwrites;
		const oldPos = oldChan.position;

		const filter = m => m.author.id === message.author.id;
		message.reply('\nAre you sure you want to delete the contents of this channel? This cannot be undone.\nType `yes` to confirm, or `no` to cancel.').then(s => s.delete({ timeout: 30 * 1000 }));
		message.channel.awaitMessages(filter, {
			max: 1,
			time: 30 * 1000,
			errors: ['time'],
		})
			.then(async message => {
				message = message.first();
				if (message.content.toLowerCase() === 'yes') {

					try {

						await message.channel.delete();

						const newChan = await message.guild.channels.create(oldName, {
							type: 'text',
							topic: oldTopic,
							nsfw: isNSFW,
							parent: oldParent,
							permissionOverwrites: oldPerms,
							position: oldPos,
						});

						newChan.setPosition(oldPos);

					}
					catch (error) {

						console.log(error);

					}

				}
				else {
					return message.reply('\nCancelled.').then(s => s.delete({ timeout: 30 * 1000 }));
				}
			});
	},
};