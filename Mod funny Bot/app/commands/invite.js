module.exports = {
  name: "invite",
  description: "get invite link for this server",
 run: async (client, message, args) => {
    message.channel.send(
      "Here is an invite link for this server/bot :- "
    );
  }
};
