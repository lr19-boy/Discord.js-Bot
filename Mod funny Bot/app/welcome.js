const { Message } = require("discord.js");

module.exports = client => {
  const channelId = "743984193293516832"; //welcome channel

  const targetChannelId = "744002012743598080"; //rules channel

  client.on("guildMemberAdd", member => {
    console.log(member);

    const message = `Welcome <@${
      member.id
    }>!to Rolli's Community Official Discord server!Make sure to read rules in in <@${member.guild.channels
      .get(targetChannelId)
      .toString()}> :smile:`;

    const channel = member.guild.channels.cache.get(channelId);

    channel.send(message);
  });
};
