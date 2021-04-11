module.exports = {
	name: 'getMember',
	aliases: ['gm'],
	description: '',
	example: '',
	category: 'Owner Only',
	usage: '',
	hidden: true,
	ownerOnly: true,
	userPerms: [''],
	botPerms: [''],
	async execute(bot, message, args, settings) {

		const member = message.mentions.members.first();

		const fetched = await bot.getMember(member);

		console.log(fetched);

	},
};