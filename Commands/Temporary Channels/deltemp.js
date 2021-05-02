module.exports = {
	name: 'deltemp',
	aliases: ['dt'],
	description: '',
	example: '',
	category: '',
	usage: '',
	hidden: true,
	ownerOnly: false,
	userPerms: ['SEND_MESSAGES'],
	botPerms: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		// Declarations
		const Valid = await bot.tempchannels.find(o => o.guild === message.guild && o.owner === message.author);
		if(!Valid) return message.lineReply('You don\'t have any temporary Categories.').then(s => s.delete({ timeout: 30 * 1000 }));

		// Check if channel is owned by the users category
		if(message.channel.parentID !== Valid.category.id) { return message.lineReply('This channel is not owned by your Category, canceling.').then(s => s.delete({ timeout: 30 * 1000 })); }

		// Get Channels
		const Category = await Valid.category;
		const Children = Category.children;

		// Delete Them
		await Children.forEach(async ch => {
			if(ch.deletable) {
				await ch.delete(`Category owned by ${message.member.user.tag} requested the deletion of their own category.`);
			}
		});
		await Category.delete(`Category owned by ${message.member.user.tag} requested the deletion of their own category.`);
		const filter = await bot.tempchannels.filter((item) => item.id !== Valid.id);
		bot.tempchannels = filter;
		console.log(`Deleted Array - ${Valid.id}`);
	},
};