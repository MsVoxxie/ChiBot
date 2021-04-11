const { MessageEmbed } = require('discord.js');
const { bot } = require('../CleanChiBot');
bot.on('guildCreate', async guild => {

	const settings = await bot.getGuild(guild);

	try {

		const joinEmbed = new MessageEmbed()
			.setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
			.setDescription(`Hey there! Thanks a bunch for showing interest in using me!

        To get started with configuration please see the command \`${settings.prefix}config\`

        If any errors or issues come up, You're welcome to use \`${settings.prefix}source\` for info on how to contact my creator!`)
			.setColor(settings.color)
			.setTimestamp();

		const firstChan = await guild.channels.cache.filter(ch => ch.isText()).sort((a, b) => a.position - b.position).first();
		firstChan.send({ embed: joinEmbed });

		const newGuild = {
			guildID: guild.id,
			guildName: guild.name,
		};

		await bot.createGuild(newGuild);

		guild.members.cache.map(async member => {

			const mRoles = member.roles.cache
				.sort((a, b) => b.position - a.position)
				.map(r => { if (!r.managed && r.id !== member.guild.id) { return r.name; } })
				.filter(x => x !== undefined);

			const newMember = {
				guildName: member.guild.name,
				guildID: member.guild.id,
				id: member.id,
				tag: member.user.tag,
				nickname: member.nickname ? member.nickname : 'none',
				trust: '0',
				roles: mRoles,
			};

			await bot.createMember(newMember);

		});
	}
	catch (error) {
		console.error(error);
	}
});
