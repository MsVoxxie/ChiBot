const { bot } = require('../CleanChiBot');
const { MessageEmbed } = require('discord.js');

bot.on('guildMemberUpdate', async (oldMember, newMember) => {
	// Declare settings
	const settings = await bot.getGuild(oldMember.guild);
	const logChan = oldMember.guild.channels.cache.get(settings.auditLogChannel);

	// Checks
	if (!settings.shouldLog) return;
	if (!logChan) return;

	// Check if nicknames are actually changed.
	if(oldMember.nickname !== newMember.nickname) {
		const embed = new MessageEmbed()
			.setAuthor(`${oldMember.user.tag} Updated their Nickname.`, oldMember.user.displayAvatarURL({ dynamic: true }))
			.setColor(settings.color)
			.addFields(
				{ name: 'Old Nickname›', value:`${oldMember.nickname}` },
				{ name: 'New Nikcname›', value: `${newMember.nickname}` },
				{ name: 'Additional Information›', value: `**Member-ID›** ${oldMember.id}` },
			);
		// Send It
		if(bot.HasChannelPermission(logChan, 'SEND_MESSAGES')) {
			await logChan.send({ embed: embed });
		}
		await bot.updateMember(newMember, { nickname: newMember.nickname });
	}

});