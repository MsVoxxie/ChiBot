const { bot } = require("../CleanChiBot");

bot.on('message', async message => {
    if (!bot.ShitPost) return;
    const settings = await bot.getGuild(message.guild);
    const args = message.content.split(" ");

    //SpyCrabby Nickname
    if (message.member.id === "151636912602480640") {
        message.member.setNickname(`1000 Metric Tonnes of ${args[0]}`);
    }

})