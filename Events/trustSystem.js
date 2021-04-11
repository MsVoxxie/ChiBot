const { bot } = require('../CleanChiBot');

bot.on('message', async message => {
	if (message.author.bot) return;

	// Declairations
	const member = message.member;

	// Calculate score to add
	const data = await bot.getMember(member);
	const Score = data.trust + (0.01 * message.content.length / 10);
	const fixedScore = Score.toFixed(5);
	await bot.updateMember(member, { trust: fixedScore });

});