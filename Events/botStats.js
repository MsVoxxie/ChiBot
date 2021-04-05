const { bot } = require('../CleanChiBot');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
require('moment-duration-format');


function BotStats() {
	setTimeout(async () => {

		let stats = await JSON.parse(fs.readFileSync(path.join(__dirname, '../DataStore/BotStatistics/', './stats.json'), 'utf8'));

		stats = {
			Uptime: moment.duration(bot.uptime).format('Y[Y] M[M] W[W] D[D] H[h] m[m] s[s]'),
			TotalGuilds: bot.toThousands(bot.guilds.cache.size),
			TotalUsers: bot.toThousands(bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)),
		};

		fs.writeFileSync(path.join(__dirname, '../DataStore/BotStatistics/', './stats.json'), JSON.stringify(stats, null, 2), function(err) {
			if (err) console.log(err);
		});

		BotStats();

	}, 10 * 1000);
}

bot.on('ready', () => {
	BotStats();
});