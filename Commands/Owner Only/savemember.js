module.exports = {
	name: 'saveMember',
	aliases: ['sm'],
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
		const newMember = {
			guildID: member.guild.id,
			id: member.id,
			tag: member.user.tag,
			nickname: member.nickname ? member.nickname : 'none',
			trust: '0',
			roles: [],
		};
		await bot.createMember(newMember);
	},
};