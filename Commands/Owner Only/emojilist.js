module.exports = {
	name: 'emojilist',
	aliases: ['el'],
	description: 'List all of the guilds emoji\'s',
	category: 'Owner Only',
	ownerOnly: true,
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args) {

		const list = [];

		message.guild.emojis.cache.map(em => {
			list.push(`${em.toString()} => :${em.name}:`);
		});

		message.channel.send(list.sort().join('\n'), { split: true });

	},
};