const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'guildemojis',
	aliases: ['ge'],
	description: 'Displays guild emojis.',
	example: '',
	category: 'Utility',
	usage: '',
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		// Setup variables
		const guild = await message.guild;
		const emojis = [];
		const aemojis = [];

		// Get Emojis
		guild.emojis.cache.map(em =>{
			if(em.animated) {
				aemojis.push(em.toString());
			}
			else{
				emojis.push(em.toString());
			}
		});

		const emojiembed = generateEmbed(message, 'Emojis', emojis, settings);
		const aemojiembed = generateEmbed(message, 'Animated Emojis', aemojis, settings);

		// Send it
		emojiembed.forEach(async e => {await message.channel.send({ embed: e });});
		aemojiembed.forEach(async e => {await message.channel.send({ embed: e });});
	},
};

function generateEmbed(message, tag, list, settings) {
	const embeds = [];
	let k = 50;

	for(let i = 0; i < list.length; i += 50) {
		const current = list.slice(i, k);
		k += 50;

		const emb = new MessageEmbed()
			.setColor(settings.color)
			.setDescription(`**${tag}›**\n${current.sort().join(', ')}`);
		embeds.push(emb);
	}
	return embeds;
}