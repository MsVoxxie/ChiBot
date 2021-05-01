const { bot } = require('../CleanChiBot');
const path = require('path');
const fs = require('fs');
const points = JSON.parse(fs.readFileSync(path.join(__dirname, '../DataStore/', './Points.json'), 'utf8'));


bot.on('message', async message => {
	if (message.author.bot) return;

	// Declairations
	const member = message.member;

	// Calculate score to add
	const data = await bot.getMember(member);
	const Score = data.trust + (0.01 * message.content.length / 10);
	const fixedScore = Score.toFixed(5);
	await bot.updateMember(member, { trust: fixedScore });

	// Snags Thing
	if(message.guild.id === '513574570179952650') {
		const urlReg = /(((https?:\/\/)|(www\.))[^\s]+)/g;
		const url = urlReg.test(message.content);
		if(url && message.channel.nsfw) {

			if(!points[member.guild.id]) {points[member.guild.id] = {}; }
			if(!points[member.guild.id][member.id]) {
				points[member.guild.id][member.id] = {
					tag: '',
					score: 0,
				};
			}

			points[member.guild.id][member.id].tag = member.user.tag;
			points[member.guild.id][member.id].score++;

			fs.writeFileSync(path.join(__dirname, '../DataStore/', './Points.json'), JSON.stringify(points, null, 2), function(err) {
				if (err) console.log(err);
			});

		}
	}

});