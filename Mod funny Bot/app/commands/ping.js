const Discord = require('discord.js')

module.exports = {
    name: "ping",
    description: "test command",

    async run (client, message, args) {


        const ping = new Discord.MessageEmbed()
        .setDescription(`🏓\`${client.ws.ping}\`ms`)
        .setColor('#a40000');


        message.channel.send(ping);
    }
}