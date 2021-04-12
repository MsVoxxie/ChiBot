const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const table = new ascii().setHeading('Commands', 'Reloaded?');
const path = require('path');

module.exports = {
	name: 'reload',
	aliases: ['rlcmd'],
	category: 'Owner Only',
	description: 'Reload Bot Commands',
	ownerOnly: true,
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		async function reloadCommands() {
			readdirSync('./Commands/').forEach(dir => {
				const commandFiles = readdirSync(`./Commands/${dir}/`).filter(f => f.endsWith('.js'));

				for (const file of commandFiles) {

					const pull = require(path.join(__dirname, '..', dir, file));
					delete require.cache[require.resolve(path.join(__dirname, '..', dir, file))];

					try {

						if (pull.name) {
							bot.commands.delete(pull.name, pull);
							bot.commands.set(pull.name, pull);
							table.addRow(`${dir} | ${file}`, '✔ -> Reloaded');
						}
						else {
							continue;
						}
						if (pull.aliases) {
							pull.aliases.forEach(alias => bot.aliases.delete(alias, pull.name));
							pull.aliases.forEach(alias => bot.aliases.set(alias, pull.name));
						}

					}
					catch (error) {
						console.error(error);
					}
				}
			});
		}

		await reloadCommands();
		await reloadCommands();

		console.log(table.toString());

		const reloadedEmbed = new MessageEmbed()
			.setAuthor(message.member.displayName, message.member.user.displayAvatarURL({ dynamic: true }))
			.setDescription('<:check:753802620644360213> Commands Reloaded')
			.setColor(settings.color)
			.setTimestamp();

		message.channel.send({ embed: reloadedEmbed }).then(s => s.delete({ timeout: 60 * 1000 }));
	},
};