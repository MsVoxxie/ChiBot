const { bot } = require("../CleanChiBot");
const config = require("../DataStore/Config/Config.json");
const { MessageEmbed, escapeMarkdown } = require("discord.js");
const { readFileSync, writeFileSync } = require("fs");
const path = require("path");

const { ApiClient } = require('twitch');
const { ClientCredentialsAuthProvider } = require('twitch-auth');

const clientId = config.TwitchClientID;
const accessToken = config.TwitchAccessToken;
const authProvider = new ClientCredentialsAuthProvider(clientId, accessToken);
const Twitch = new ApiClient({ authProvider });

async function streamCheck(delay) {

    //Setup Embed
    let embed;
    async function setEmbed(stream, chan) {
        embed = new MessageEmbed()
            .setColor("#6441a4")
            .setTitle(`${(await stream.getUser()).displayName} is now live!`)
            .setDescription(`[https://www.twitch.tv/${chan.ChannelName}](https://www.twitch.tv/${chan.ChannelName})`)
            .setThumbnail((await stream.getUser()).profilePictureUrl)
            .setImage(stream.thumbnailUrl.replace("{width}", 960).replace("{height}", 540))
            .addField("Playing›", `${(await stream.getGame()).name}`, true)
            .addField("Current Viewers›", `${stream.viewers}`, true)
            .addField("Live Since›", `${bot.Timestamp(stream.startDate)}`)
            .setFooter(`Last Updated› ${bot.Timestamp(Date.now())}`);
        return embed;
    };

    let offembed;
    async function setEmbedOffline(stream, chan) {
        offembed = new MessageEmbed()
            .setColor("#303c42")
            .setTitle(`${chan.ChannelName}'s stream has ended.`)
            .setDescription(`[https://www.twitch.tv/${chan.ChannelName}](https://www.twitch.tv/${chan.ChannelName})`)
            .setThumbnail("https://cdn.iconscout.com/icon/free/png-256/social-190-96705.png")
            .setFooter(`As of› ${bot.Timestamp(Date.now())}`);
        return offembed;
    };

    //Get the channels file
    const channels = await JSON.parse(readFileSync(path.join(__dirname, "../Commands/Streaming/", "./channels.json"), "utf8"));

    //Map each guild to check their watch lists.
    bot.guilds.cache.map(async guild => {
        const settings = await bot.getGuild(guild);
        const streamChan = guild.channels.cache.get(settings.streamNotifChannel);
        if (streamChan) {

            //Get each channel and run checks
            Object.values(channels[guild.id]).map(async (chan) => {
                //Declare Variables
                let postMsg;
                const stream = await Twitch.helix.streams.getStreamByUserName(chan.ChannelName);

                //Check if their stream is online
                if (stream) {
                    try {
                        //Check if this channel has posted
                        if (chan.postMessage) {
                            //Fetch Messages
                            let checkMsg = await streamChan.messages.fetch({ limit: 100 });
                            let streamMsg = await checkMsg.get(chan.postMessage);
                            if (streamMsg) {
                                await setEmbed(stream, chan);
                                streamMsg.edit({ embed: embed });
                            }
                        } else {

                            //Post the message if no post message found.
                            await setEmbed(stream, chan);
                            postMsg = await streamChan.send({ embed: embed });

                            //Write Database
                            chan.postMessage = postMsg.id;
                            chan.LastPost = Date.now();
                            if (chan.Offline === true) { chan.Offline = false; };

                            writeFileSync(path.join(__dirname, "../Commands/Streaming/", "./channels.json"), JSON.stringify(channels, null, 2), function (err) {
                                if (err) return;
                            });
                        }
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    try {
                        //Chan is offline, mark it as so.
                        if (chan.Offline === false) {
                            let checkMsg = await streamChan.messages.fetch({ limit: 100 });
                            let streamMsg = await checkMsg.get(chan.postMessage);
                            setEmbedOffline(stream, chan)
                            streamMsg.edit({ embed: offembed })
                            chan.Offline = true;
                        };
                        chan.postMessage = "";
                        writeFileSync(path.join(__dirname, "../Commands/Streaming/", "./channels.json"), JSON.stringify(channels, null, 2), function (err) {
                            if (err) return;
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }


                //End Object Loop
            });
            //End streamChan
        };
        //End guild map
    });
    //End Function   
    setTimeout(() => streamCheck(delay), delay);
};

//Check every 2 Minutes.
streamCheck(120 * 1000);