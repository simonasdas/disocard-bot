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

const PREFIX = '!';

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  lastMessage = {
    id: message.id,
    author: message.author.username,
    content: message.content,
    timestamp: message.createdTimestamp,
    channelId: message.channelId,
  };

  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'ping':
      message.reply('pong!');
      break;

    case 'hallo':
    case 'hi':
      message.reply(`Hallo ${message.author.username}!`);
      break;

    case 'help':
      message.reply(
        'Verfügbare Befehle:\n' +
          '`!ping` - Pong!\n' +
          '`!hallo` - Begrüßung\n' +
          '`!info` - Bot-Infos\n'
      );
      break;

    case 'info':
      message.reply(
        `Name: ${client.user.username}\n` +
          `Status: Online auf ${client.guilds.cache.size} Server(n)`
      );
      break;

    case 'bau':
      message.reply('Was möchtest du bauen?');
      break;

    default:
      message.reply(`Unbekannter Befehl \`${command}\`. Gib \`!help\` ein.`);
      break;
  }
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
