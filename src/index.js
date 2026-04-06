// Made by Ayliee, All rights are reserved to AeroX Development

import 'dotenv/config';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import {
  msg,
  ContainerBuilder,
  MessageFlags,
  thinDivider,
  text,
} from './ui.js';
import { BotManager } from './BotManager.js';

// ─── Startup validation ────────────────────────────────────────────────────────

if (!process.env.DISCORD_TOKEN) {
  console.error('[ERROR] DISCORD_TOKEN is not set. Add it to your .env file or Pterodactyl startup variables.');
  process.exit(1);
}

const GUILD_ID = process.env.GUILD_ID?.trim() || null;

// ─── Client ───────────────────────────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const botManager = new BotManager();

client.on('clientReady', () => {
  if (GUILD_ID) {
    console.log(`Discord bot logged in as ${client.user.tag} — restricted to guild ${GUILD_ID}`);
  } else {
    console.log(`Discord bot logged in as ${client.user.tag} — active in all servers`);
  }
});

// ─── Help ─────────────────────────────────────────────────────────────────────

const COMMANDS = [
  { usage: '!join <ip[:port]> [username]',  desc: 'Join a cracked server.' },
  { usage: '!premjoin <ip[:port]>',         desc: 'Join an online-mode server via Microsoft account.' },
  { usage: '!leave <ip> <username>',        desc: 'Disconnect a bot.' },
  { usage: '!say <username> <message>',     desc: 'Send a chat message in-game.' },
  { usage: '!bots',                         desc: 'List all active bots.' },
  { usage: '!jump <ip> <username>',         desc: 'Force a bot to jump.' },
  { usage: '!help',                         desc: 'Show this reference.' },
];

function buildHelp() {
  const c = new ContainerBuilder();

  c.addTextDisplayComponents(text('## MC AFK Bot Commands'));
  c.addSeparatorComponents(thinDivider());

  const commandLines = COMMANDS
    .map((cmd) => `\`${cmd.usage}\` **- ${cmd.desc}**`)
    .join('\n');

  c.addTextDisplayComponents(
    text(
      '**Send Minecraft AFK bots to any server and control them from Discord.**\n' +
      '\n' +
      '**Main Commands:**\n' +
      commandLines
    )
  );

  c.addSeparatorComponents(thinDivider());

  c.addTextDisplayComponents(
    text('**Made by:** Ayliee  ·  AeroX Development')
  );

  c.addSeparatorComponents(thinDivider());

  c.addTextDisplayComponents(
    text('-# Bots auto-jump every 5s and rotate view every 30s to prevent AFK kicks.')
  );

  return { components: [c], flags: MessageFlags.IsComponentsV2 };
}

// ─── Commands ─────────────────────────────────────────────────────────────────

client.on('messageCreate', async (message) => {
  // Ignore bots, DMs, empty messages, and messages outside the configured guild
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content) return;
  if (GUILD_ID && message.guild.id !== GUILD_ID) return;

  const args = message.content.trim().split(/\s+/);
  const command = args[0].toLowerCase();

  // !help
  if (command === '!help') {
    return message.reply(buildHelp());
  }

  // !join <ip[:port]> [username]  —  cracked / offline-mode server
  if (command === '!join') {
    if (!args[1]) return message.reply(msg('usage: `!join <ip[:port]> [username]`'));
    const [host, rawPort] = args[1].split(':');
    const port = parseInt(rawPort) || 25565;
    const username = args[2] || `AFK_${Math.floor(Math.random() * 9999)}`;
    botManager.joinCracked({ host, port, username }, message.channel);
    return;
  }

  // !premjoin <ip[:port]>  —  online-mode server via Microsoft account
  if (command === '!premjoin') {
    if (!args[1]) return message.reply(msg('usage: `!premjoin <ip[:port]>`'));
    const [host, rawPort] = args[1].split(':');
    const port = parseInt(rawPort) || 25565;
    botManager.joinPremium(message.author.id, { host, port }, message.channel);
    return;
  }

  // !leave <ip> <username>
  if (command === '!leave') {
    if (!args[1] || !args[2]) return message.reply(msg('usage: `!leave <ip> <username>`'));
    const [host] = args[1].split(':');
    botManager.removeBot(args[2], host, message.channel);
    return;
  }

  // !say <username> <message...>  —  send an in-game chat message through the named bot
  if (command === '!say') {
    if (!args[1] || !args[2]) return message.reply(msg('usage: `!say <username> <message>`'));
    const username = args[1];
    const chatText = args.slice(2).join(' ');
    botManager.say(username, chatText, message.channel);
    return;
  }

  // !bots
  if (command === '!bots') {
    return message.reply(botManager.getStatus());
  }

  // !jump <ip> <username>
  if (command === '!jump') {
    if (!args[1] || !args[2]) return message.reply(msg('usage: `!jump <ip> <username>`'));
    const [host] = args[1].split(':');
    botManager.jump(args[2], host, message.channel);
    return;
  }
});

client.login(process.env.DISCORD_TOKEN);
