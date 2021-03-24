const Similar = require("string-similarity");
const path = require('path');
const fs = require('fs');
let roles = JSON.parse(fs.readFileSync(path.join(__dirname, "../../DataStore/Blacklists/", "./roles.json"), "utf8"));

module.exports = {
    name: "roleblacklist",
    aliases: ["rbl"],
    description: "Blacklist roles from showing up in RoleList",
    example: "Admin",
    category: "Roles",
    usage: "<Role Name>(Case Sensitive)",
    args: true,
    ownerOnly: false,
    hidden: false,
    nsfw: false,
    botPerms: ["MANAGE_MESSAGES"],
    async execute(bot, message, args, settings) {

        //Declarations
        const getRole = args.join(" ");
        const serverRoles = message.guild.roles.cache
            .map(r => {
                return r.name;
            });
        let Matches = Similar.findBestMatch(getRole, serverRoles);
        const bRole = await message.guild.roles.cache.find(r => r.name === Matches.bestMatch.target);
        if (!bRole) return message.reply(`\nRole not found.`).then(s => s.delete({ timeout: 30 * 1000 }));

        //Database Setup
        if (!roles[message.guild.id]) { roles[message.guild.id] = {}; }
        if (!roles[message.guild.id][bRole.id]) {
            roles[message.guild.id][bRole.id] = {
                roleName: "",
                roleID: ""
            };
        }

        roles[message.guild.id][bRole.id].roleName = bRole.name;
        roles[message.guild.id][bRole.id].roleID = bRole.id;

        fs.writeFileSync(path.join(__dirname, "../../DataStore/Blacklists/", "./roles.json"), JSON.stringify(roles, null, 2), function (err) {
            if (err) console.log(err);
        });

        message.reply(`\nAdded ${bRole.name} to this guilds Blacklisted roles list.`).then(s => s.delete({ timeout: 30 * 1000 }));

    }
}