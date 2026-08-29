const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let lastMessage = null;

client.once('ready', () => {
  console.log(`[Discord] Bot online als ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  lastMessage = {
    id: message.id,
    author: message.author.username,
    content: message.content,
    timestamp: message.createdTimestamp,
    channelId: message.channelId,
  };
});

function getLastMessage() {
  const msg = lastMessage;
  lastMessage = null;
  return msg;
}

async function sendMessage(channelId, content) {
  try {
    const channel = await client.channels.fetch(channelId);
    if (channel) {
      await channel.send(content);
      return true;
    }
  } catch (err) {
    console.error('[Discord] Fehler beim Senden:', err.message);
  }
  return false;
}

module.exports = { client, getLastMessage, sendMessage };
