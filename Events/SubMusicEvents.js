const { bot } = require("../CleanChiBot");
const ms = require("ms");

const timeoutLimit = "10s";

bot.on("voiceStateUpdate", async (oldState, newState) => {
    //If we arent in a vc, ignore.
    if (!oldState.guild.me.voice.channel) return;

    //Get the VC we are in.
    const voiceChannel = oldState.member.guild.voice.channel;
    //Get queue, if it exists.
    const queue = await bot.queue.get(newState.member.guild.id);

    if (newState.guild.me.voice.deaf === false) {
        newState.guild.me.voice.setDeaf(true)
    }

    if (voiceChannel.members.size <= 1) {
        //Timeout!
        setTimeout(async () => {
            voiceChannel.leave()
            //If there is a queue, clear it!
            if (queue) {
                await bot.queue.delete(oldState.member.guild.id);
                await queue.textChannel.send(`🚫 **${queue.channel.name}** has been empty for ${ms(ms(timeoutLimit))}, Clearing queue and leaving channel.`).then(s => s.delete({ timeout: 30 * 1000 }));
            }
        }, ms(timeoutLimit));
    }
})