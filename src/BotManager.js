// Made by Ayliee, All rights are reserved to AeroX Development

import { MinecraftBot } from './MinecraftBot.js';
import { msg, msgList } from './ui.js';

export class BotManager {
  constructor() {
    // Map key format: "username@host" (post-spawn) or "msa:discordId@host" (pre-spawn premium)
    this.bots = new Map();
  }

  // Join a cracked (offline-mode) server — no account required
  joinCracked(options, channel) {
    const key = `${options.username}@${options.host}`;
    if (this.bots.has(key)) {
      return channel.send(msg(`**${options.username}** is already active on **${options.host}**`));
    }

    const bot = new MinecraftBot(
      { ...options, auth: 'offline' },
      channel,
      () => this.bots.delete(key)
    );
    this.bots.set(key, bot);
    bot.connect().catch((err) => console.error('[BotManager] joinCracked connect error:', err));
  }

  // Join an online-mode (non-cracked) server via Microsoft account.
  // The Discord user ID is used as the stable prismarine-auth cache key,
  // so the user only needs to authenticate with Microsoft once.
  joinPremium(discordUserId, options, channel) {
    // Detect duplicates even after the key has been updated to the real MC username
    const alreadyRunning = [...this.bots.values()].some(
      (b) => b.options.username === discordUserId && b.options.host === options.host
    );
    if (alreadyRunning) {
      return channel.send(msg(`You already have a premium bot on **${options.host}**`));
    }

    // Mutable closure key — starts as pending, updated to real MC username after spawn
    let currentKey = `msa:${discordUserId}@${options.host}`;

    const bot = new MinecraftBot(
      { ...options, username: discordUserId, auth: 'microsoft' },
      channel,
      // onFatal: clean up whichever key is current at the time of fatal failure
      () => this.bots.delete(currentKey),
      // onRealUsername: re-key the map entry under the real MC username
      (realUsername) => {
        this.bots.delete(currentKey);
        currentKey = `${realUsername}@${options.host}`;
        this.bots.set(currentKey, bot);
      }
    );

    this.bots.set(currentKey, bot);
    bot.connect().catch((err) => console.error('[BotManager] joinPremium connect error:', err));
  }

  // Disconnect and remove a bot by username + host.
  // Handles three cases:
  //   1. Normal offline bot:          key = "username@host"
  //   2. Premium bot post-spawn:      key = "realMcUsername@host"
  //   3. Premium bot pre-spawn:       key = "msa:discordId@host"
  //      → Linear scan matches on realUsername or options.username
  removeBot(username, host, channel) {
    // Case 1 & 2: direct key lookup (fastest path)
    const exactKey = `${username}@${host}`;
    if (this.bots.has(exactKey)) {
      this.bots.get(exactKey).stop();
      this.bots.delete(exactKey);
      return channel.send(msg(`**${username}** disconnected from **${host}**`));
    }

    // Case 3: pre-spawn premium bot — key is "msa:discordId@host", not known to user.
    // Scan all bots and match on host + whichever username field is set.
    for (const [key, bot] of this.bots.entries()) {
      if (
        bot.options.host === host &&
        (bot.realUsername === username || bot.options.username === username)
      ) {
        bot.stop();
        this.bots.delete(key);
        return channel.send(msg(`**${username}** disconnected from **${host}**`));
      }
    }

    return channel.send(msg(`no bot named **${username}** on **${host}**`));
  }

  // Force a bot to jump, identified by username + host.
  // Mirrors removeBot's lookup strategy so it works for both cracked and premium bots.
  jump(username, host, channel) {
    // Direct key lookup (covers cracked bots and post-spawn premium bots)
    const exactKey = `${username}@${host}`;
    if (this.bots.has(exactKey)) {
      this.bots.get(exactKey).jump();
      return;
    }

    // Linear scan for pre-spawn premium bots keyed as "msa:discordId@host"
    for (const bot of this.bots.values()) {
      if (
        bot.options.host === host &&
        (bot.realUsername === username || bot.options.username === username)
      ) {
        bot.jump();
        return;
      }
    }

    channel.send(msg(`no bot named **${username}** on **${host}**`));
  }

  // Send a chat message in-game through the named bot
  say(username, text, channel) {
    // Find bot by its real MC username (or pre-spawn options.username) — host-agnostic
    const bot = [...this.bots.values()].find(
      (b) => (b.realUsername || b.options.username) === username
    );
    if (!bot) {
      return channel.send(msg(`no bot named **${username}** found`));
    }
    bot.say(text);
  }

  // Return a V2 message listing all active bots and their state
  getStatus() {
    if (this.bots.size === 0) {
      return msg('no active bots');
    }

    const rows = [...this.bots.values()].map((bot) => {
      const name = bot.realUsername || bot.options.username;
      const state = bot.bot?.entity ? 'online' : 'connecting';
      return `**${name}** — ${bot.options.host} — ${state}`;
    });

    const count = rows.length;
    return msgList(
      '**Active Bots**',
      rows,
      `-# ${count} bot${count === 1 ? '' : 's'} running`
    );
  }
}
