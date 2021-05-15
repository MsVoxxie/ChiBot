const { MessageEmbed, escapeMarkdown } = require('discord.js');
const { readFileSync, writeFileSync } = require('fs');
const config = require('../../DataStore/Config/Config.json');
const path = require('path');

const { ApiClient } = require('twitch');
const { ClientCredentialsAuthProvider } = require('twitch-auth');

const clientId = config.TwitchClientID;
const accessToken = config.TwitchAccessToken;
const authProvider = new ClientCredentialsAuthProvider(clientId, accessToken);
const Twitch = new ApiClient({ authProvider });

module.exports = {
	name: 'getstream',
	aliases: ['forcestream'],
	description: 'Forcefully request streams status.',
	category: 'Streaming',
	usage: '',
	ownerOnly: true,
	botPerms: ['MANAGE_MESSAGES'],
	async execute(bot, message, args, settings) {
		console.log('Cmd Ran');
		// Setup Embed
		let embed;
		async function setEmbed(stream, chan) {
			embed = new MessageEmbed()
				.setColor('#6441a4')
				.setTitle(`${(await stream.getUser()).displayName} is now live!`)
				.setDescription(`[https://www.twitch.tv/${chan.ChannelName}](https://www.twitch.tv/${chan.ChannelName})`)
				.setThumbnail((await stream.getUser()).profilePictureUrl)
				.setImage(stream.thumbnailUrl.replace('{width}', 960).replace('{height}', 540))
				.addField('Playing›', `${(await stream.getGame()).name}`, true)
				.addField('Current Viewers›', `${stream.viewers}`, true)
				.addField('Live Since›', `${bot.Timestamp(stream.startDate)}`);
			// .setFooter(`${bot.Timestamp(stream.startDate)}`)
			return embed;
		}

		// Get Channels
		const channels = await JSON.parse(readFileSync(path.join(__dirname, './channels.json'), 'utf8'));

		// Check Each Channel
		(Object.values(channels[message.guild.id]).map(async (chan) => {
			const stream = await Twitch.helix.streams.getStreamByUserName(chan.ChannelName);
			if (stream) {

				// Setup Embed Settings
				await setEmbed(stream, chan);
				message.channel.send({ embed: embed });

			}
			else {
				return;
			}
		}));
	},
};