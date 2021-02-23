const pagination = require("discord.js-pagination");
const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "The help command, what do you expect?",

  async run(client, message, args) {
    //Sort your commands into categories, and make seperate embeds for each category

    const moderation = new Discord.MessageEmbed()
      .setTitle("Moderation")
      .addField("`-ban`", "Bans a member from your server via mention or ID")
      .addField("`-clear`", "Purges messages")
      .addField("`-warn`", "Warn a member")
      .addField("`-warnings`", "check a users warnings")
      .setTimestamp()
      .setColor("#ffffff");

    const fun = new Discord.MessageEmbed()
      .setTitle("Fun")
      .addField("`-meme`", "Generates a random meme")
      .addField("`-ascii`", "Converts text into ascii")
      .addField("`-buy`", "buy a item from the shop!")
      .addField("`-bal`", "Check your balance")
      .addField("`-daily`", "Get a daily reward!")
      .addField("`-work`", "Do your Work!")
      .addField("`-say`", "Tell bot what it should say")
      .addField("`-hello`", "Telling the bot hi to user")
      .setTimestamp()
      .setColor("#ffffff");

    const utility = new Discord.MessageEmbed()
      .setTitle("Utlity")
      .addField("`-calculate`")
      .addField("`-ping`", "Get the bot's API ping")
      .addField("`-weather`", "Checks weather forecast for provided location")
      .addField("`-covid`", "Get the stats of Covid-19")
      .addField("`-invite`", "Get a invite link for this server!")
      .addField(
        "`-ticket`",
        "This will open a new channel automatically to give feedbacks or someother things."
      )
      .setTimestamp()
      .setColor("#ffffff");

    const pages = [moderation, fun, utility];

    const emojiList = ["⏪", "⏩"];

    const timeout = "1000000000";

    pagination(message, pages, emojiList, timeout);
  }
};
