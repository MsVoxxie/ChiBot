const { MessageEmbed, escapeMarkdown } = require('discord.js');
const { readdirSync } = require('fs');
const ms = require('ms');

module.exports = {
	name: 'help',
	aliases: ['h'],
	description: 'Display list of Commands',
	category: 'Utility',
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {

		//                                                   //
		//  Reminder to self - Clean this monster up later.  //
		//                                                   //

		// Setup
		const cmd = args[0];
		const Categories = readdirSync('./Commands/');
		const embeds = [];
		let currentPage = 0;

		// Generate full embed
		const fullHelp = new MessageEmbed()
			.setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
			.setColor(settings.color);

		// Generate Pagination

		Categories.forEach(Cat => {
			const dir = bot.commands.filter(c => {
				if (!c.hidden) {
					if(c.category === Cat) {
						console.log(`${Cat}> ${c.name}`);
					}
					return c.category === Cat;
				}
			});

			const capitalize = Cat.slice(0, 1).toUpperCase() + Cat.slice(1);

			fullHelp
				.addField(`${capitalize ? capitalize : 'Missing Category Name'} [${dir.size}] āŗ`, dir.map(command => `**${command.name}**${command.disabled ? '<:xmark:753802620682109019>' : ''}${command.nsfw ? 'š' : ''}${command.ownerOnly ? 'š' : ''} āŗ ${command.description ? command.description : ''}`).join('\n'));


			const embed = new MessageEmbed()
				.setAuthor(`${bot.user.username}'s Commands List`, bot.user.displayAvatarURL({ dynamic: true }))
				.setDescription(`Command prefix is: ${settings.prefix}\nTo view more information on a command, use \`${settings.prefix}help <command>\`\nTo view the full list use \`${settings.prefix}help all\`\nš Represents an NSFW Command.\nš Represents a Locked Command.\n<:xmark:753802620682109019> Represents a Disabled Command.\n`)
				.addField(`${capitalize ? capitalize : 'Missing Category Name'} [${dir.size}] āŗ`, dir.map(command => `**${command.name}**${command.nsfw ? 'š' : ''}${command.ownerOnly ? 'š' : ''} āŗ ${command.description ? command.description : ''}`).join('\n'))
				.setColor(settings.color);

			embeds.push(embed);

			return embeds;
		});


		// Command Info
		if (cmd) {

			if (cmd === 'all') {
				return message.channel.send({ embed: fullHelp });
			}
			// Init Embed
			const helpEmbed = new MessageEmbed()
				.setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
				.setColor(settings.color);

			const command = bot.commands.get(bot.aliases.get(cmd.toLowerCase()) || cmd.toLowerCase());
			if (!command) {
				helpEmbed
					.setTitle('Invalid Command')
					.setDescription(`Use \`${settings.prefix}help\` for the command list.`);
				return message.channel.send({ embed: helpEmbed }).then(s => s.delete({ timeout: 300 * 1000 }));
			}

			helpEmbed.setDescription(`
            This guilds prefix is \`${settings.prefix}\`
            **Commandāŗ** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}
            **Aliasesāŗ** ${command.aliases.length ? command.aliases.join(' | ') : 'None.'}
            **Usageāŗ** ${command.usage ? `${settings.prefix}${command.name} ${command.usage}` : `${settings.prefix}${command.name}`}
            **Cooldownāŗ** ${command.cooldown ? ms(command.cooldown * 1000) : ms(2 * 1000)}
            **Descriptionāŗ** ${escapeMarkdown(command.description)}
            **Exampleāŗ** ${escapeMarkdown(command.example ? `${settings.prefix}${command.name} ${command.example}` : 'None Provided.')}
            `);
			message.channel.send({ embed: helpEmbed });
		}
		else {

			// Sort
			embeds.sort();

			// Send the pagination
			const queueEmbed = await message.channel.send(
				`**Current Page - ${currentPage + 1}/${embeds.length}**`,
				embeds[currentPage],
			);

			try {
				await queueEmbed.react('ā¬ļø');
				await queueEmbed.react('ā¹');
				await queueEmbed.react('ā”ļø');
			}
			catch (error) {
				console.error(error);
				message.channel.send(error.message).then(s => s.delete({ timeout: 30 * 1000 }));
			}

			const filter = (reaction, user) =>
				['ā¬ļø', 'ā¹', 'ā”ļø'].includes(reaction.emoji.name) && message.author.id === user.id;
			const collector = queueEmbed.createReactionCollector(filter, { time: 300 * 1000 });

			collector.on('collect', async (reaction, user) => {
				try {
					if (reaction.emoji.name === 'ā”ļø') {
						if (currentPage < embeds.length - 1) {
							currentPage++;
							queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
						}
					}
					else if (reaction.emoji.name === 'ā¬ļø') {
						if (currentPage !== 0) {
							--currentPage;
							queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
						}
					}
					else {
						collector.stop();
						reaction.message.reactions.removeAll();
						queueEmbed.delete({ timeout: 600 * 1000 });
					}
					await reaction.users.remove(message.author.id);
				}
				catch (error) {
					console.error(error);
					return message.channel.send(error.message).then(s => s.delete({ timeout: 600 * 1000 }));
				}
			});
			collector.on('end', async (reaction, user) => {
				if (queueEmbed) {
					queueEmbed.delete({ timeout: 300 * 1000 });
				}
			});
		}
	},
};