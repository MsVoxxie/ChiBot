const { bot } = require("../CleanChiBot");
const moment = require("moment");
require("moment-duration-format");

function BotUpTime() {
    setTimeout(async () => {
        bot.ActiveFor = moment.duration(bot.uptime).format("Y [Y], M [M], W [W], D [D], H [h], m [m], s [s]");
        bot.user.setActivity(`Uptime: ${bot.ActiveFor}`)
        BotUpTime()
    }, 10 * 1000);
}

bot.on('ready', () => {
    BotUpTime()
});