const Discord = require("discord.js");
module.exports = {
  name: "revive",
  description: "revive the chat!",
  run: async (client, message, args) => {
    message.reply("has revived the chat.Well,no chats, **Dead Chat**");
  }
};
