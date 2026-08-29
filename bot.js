const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

let lastMessage = null;

const WELCOME_CHANNELS = new Map();

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

    case 'welcome':
      WELCOME_CHANNELS.set(message.guildId, message.channelId);
      message.reply(
        `✅ Welcome-Kanal für diesen Server auf <#${message.channelId}> gesetzt!`
      );
      break;

    case 'help':
      message.reply(
        'Verfügbare Befehle:\n' +
          '`!ping` - Pong!\n' +
          '`!hallo` - Begrüßung\n' +
          '`!welcome` - Setzt den aktuellen Kanal als Welcome-Kanal\n' +
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

client.on('guildMemberAdd', (member) => {
  const channelId = WELCOME_CHANNELS.get(member.guild.id);
  if (!channelId) return;

  const channel = member.guild.channels.cache.get(channelId);
  if (!channel) return;

  const avatar = member.user.displayAvatarURL({ size: 256, extension: 'png' });

  channel
    .send({
      content: `👋 Willkommen auf dem Server **${member.guild.name}**, ${member.user} (${member.user.username})!\nSchön, dass du hier bist!`,
      files: [{ attachment: avatar, name: 'avatar.png' }],
    })
    .catch((err) => console.error('[Discord] Welcome-Fehler:', err.message));
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
