const Discord = require("discord.js");

const client = new Discord.Client();

const enmap = require("enmap");

const { readdirSync } = require("fs");

const { join } = require("path");

const moment = require("moment");

const ms = require("parse-ms");

const config = require("./config.json");
client.config = config;

const { GiveawaysManager } = require("discord-giveaways");
const { type } = require("os");

const welcome = require("./welcome");

client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    embedColor: "#a40000",
    reaction: "🎉"
  }
});

client.commands = new Discord.Collection();

const prefix = "-";
//You can change the prefix if you like. It doesn't have to be ! or ;
const commandFiles = readdirSync(join(__dirname, "commands")).filter(file =>
  file.endsWith(".js")
);

for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("error", console.error);

client.on("ready", () => {
  console.log("I am ready");
  client.user.setActivity(`To -help || LR19`);

  welcome(client);
});

let stats = {
  serverID: "<ID>",
  total: "<ID>",
  member: "<ID>",
  bots: "<ID>"
};

client.on("guildMemberAdd", member => {
  if (member.guild.id !== stats.serverID) return;
  client.channels.cache
    .get(stats.total)
    .setName(`Total Users: ${member.guild.memberCount}`);
  client.channels.cache
    .get(stats.member)
    .setName(
      `Members: ${member.guild.members.cache.filter(m => !m.user.bot).size}`
    );
  client.channels.cache
    .get(stats.bots)
    .setName(
      `Bots: ${member.guild.members.cache.filter(m => m.user.bot).size}`
    );
});

client.on("guildMemberRemove", member => {
  if (member.guild.id !== stats.serverID) return;
  client.channels.cache
    .get(stats.total)
    .setName(`Total Users: ${member.guild.memberCount}`);
  client.channels.cache
    .get(stats.member)
    .setName(
      `Members: ${member.guild.members.cache.filter(m => !m.user.bot).size}`
    );
  client.channels.cache
    .get(stats.bots)
    .setName(
      `Bots: ${member.guild.members.cache.filter(m => m.user.bot).size}`
    );
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  if (message.content.startsWith(prefix)) {
    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/);

    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
      client.commands.get(command).run(client, message, args);
    } catch (error) {
      console.error(error);
    }
  }
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.id === "") await message.delete();
  if (
    message.content.toLowerCase() === "-verify" &&
    message.channel.id === "758659315690504216"
  ) {
    await message.delete().catch(err => console.log(err));
    const role = message.guild.roles.cache.get("761528120107991060");
    if (role) {
      try {
        await message.member.roles.add(role);
        console.log("Role added!");
      } catch (err) {
        console.log(err);
      }
    }
  }
});

client.on("guildMemberAdd", member => {
  console.log(member.user.tag);
});

const settings = new enmap({
  name: "settings",
  autoFetch: true,
  cloneLevel: "deep",
  fetchAll: true
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command == "ticket") {
    // ticket-setup #channel

    let channel = message.mentions.channels.first();
    if (!channel) return message.reply("Usage: `$ticket #channel`");

    let sent = await channel.send(
      new Discord.MessageEmbed()
        .setTitle("Ticket System")
        .setDescription("React to open a ticket!")
        .setFooter("Ticket System")
        .setColor("#a40000")
    );

    sent.react("🎫");
    settings.set(`${message.guild.id}-ticket`, sent.id);

    message.channel.send("Ticket System Setup Done!");
  }

  if (command == "close") {
    if (!message.channel.name.includes("ticket-"))
      return message.channel.send("You cannot use that here!");
    message.channel.delete();
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (user.partial) await user.fetch();
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();

  if (user.bot) return;

  let ticketid = await settings.get(`${reaction.message.guild.id}-ticket`);

  if (!ticketid) return;

  if (reaction.message.id == ticketid && reaction.emoji.name == "🎫") {
    reaction.users.remove(user);

    reaction.message.guild.channels
      .create(`ticket-${user.username}`, {
        permissionOverwrites: [
          {
            id: user.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
          },
          {
            id: reaction.message.guild.roles.everyone,
            deny: ["VIEW_CHANNEL"]
          }
        ],
        type: "text"
      })
      .then(async channel => {
        channel.send(
          `<@${user.id}>`,
          new Discord.MessageEmbed()
            .setTitle("Welcome to your ticket!")
            .setDescription("We will be with you shortly")
            .setColor("#a40000")
        );
      });
  }
});

client.on("message", async message => {
  let messageArray = message.content.split(" ");
  const args = message.content.substring(message.content.indexOf(" ") + 1);
  const command = messageArray[0];

  if (command === `${prefix}roles`) {
    let embed = new Discord.MessageEmbed()
      .setTitle("Roles")
      .setDescription("React to obtain your roles!")
      .setFooter("If the bot is offline, Please try again later :-)")
      .setThumbnail(
        "https://cdn.discordapp.com/icons/743984192836075541/71c8170cd9b0322a76e1669612fd6d82.png"
      )
      .setColor("#a40000");

    let msgEmbed = await message.channel.send(embed);
    msgEmbed.react("🎧");
    msgEmbed.react("💻");
    msgEmbed.react("🖌");
    msgEmbed.react("746059333594513547");
    msgEmbed.react("📢");
    msgEmbed.react("🎉");
    msgEmbed.react("📊");
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();

  if (user.client) return;
  if (reaction.message.channel.id === "744002012743598080") {
    if (reaction.emoji.name === "🎧") {
      await reaction.message.guild.memebers.cache
        .get(user.id)
        .role.add("747965218444804116");
    }
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();

  if (user.client) return;
  if (reaction.message.channel.id === "744002012743598080") {
    if (reaction.emoji.name === "💻") {
      await reaction.message.guild.memebers.cache
        .get(user.id)
        .role.add("747966515768459366");
    }
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();

  if (user.client) return;
  if (reaction.message.channel.id === "744002012743598080") {
    if (reaction.emoji.name === "🖌") {
      await reaction.message.guild.memebers.cache
        .get(user.id)
        .role.add("747966404183195740");
    }
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();

  if (user.client) return;
  if (reaction.message.channel.id === "744002012743598080") {
    if (reaction.emoji.name === "📰") {
      await reaction.message.guild.memebers.cache
        .get(user.id)
        .role.add("747965137763172392");
    }
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();

  if (user.client) return;
  if (reaction.message.channel.id === "744002012743598080") {
    if (reaction.emoji.name === "746059333594513547") {
      await reaction.message.guild.memebers.cache
        .get(user.id)
        .role.add("743984654822146159");
    }
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();

  if (user.client) return;
  if (reaction.message.channel.id === "744002012743598080") {
    if (reaction.emoji.name === "📢") {
      await reaction.message.guild.memebers.cache
        .get(user.id)
        .role.add("743984655702687755");
    }
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();

  if (user.client) return;
  if (reaction.message.channel.id === "744002012743598080") {
    if (reaction.emoji.name === "🎉") {
      await reaction.message.guild.memebers.cache
        .get(user.id)
        .role.add("746057906205622444");
    }
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();

  if (user.client) return;
  if (reaction.message.channel.id === "744002012743598080") {
    if (reaction.emoji.name === "📊") {
      await reaction.message.guild.memebers.cache
        .get(user.id)
        .role.add("745788287217696849");
    }
  }
});

client.login(process.env.token);
