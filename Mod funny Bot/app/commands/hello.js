module.exports = {
    name: 'hello',
    description: 'hi',
    aliases: ["hi"],
    run: async (client, message, args) => {
        message.channel.send('Hi There!');
    }
}