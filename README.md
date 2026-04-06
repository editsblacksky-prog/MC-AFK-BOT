# AeroX Minecraft AFK Bot

A Discord-controlled Minecraft AFK bot that keeps your account active on any server. Supports both cracked and premium (Microsoft) accounts.

---

## What It Does

- Join any Minecraft server through a simple Discord command
- Keeps bots alive with automatic jumping and view rotation
- Supports Microsoft OAuth for premium accounts — auth flow handled entirely via Discord DMs
- Auto-registers/logs in on servers running AuthMe or similar plugins
- Relays in-game chat to your Discord channel
- Auto-reconnects up to 5 times if the bot gets kicked or disconnects
- Manage multiple bots simultaneously across different servers

---

## Commands

| Command | Description |
|---|---|
| `!join <ip[:port]> [username]` | Join a server with a cracked account |
| `!premjoin <ip[:port]>` | Join a server with a premium (Microsoft) account |
| `!leave <ip> <username>` | Disconnect a specific bot |
| `!say <username> <message>` | Send a chat message in-game |
| `!jump <ip> <username>` | Manually trigger a jump |
| `!bots` | List all active bots and their status |
| `!help` | Show the command list |

---

## Project Structure

```
├── src/
│   ├── index.js          # Entry point, Discord client & command handler
│   ├── BotManager.js     # Manages lifecycle of all active bot instances
│   ├── MinecraftBot.js   # Core bot logic, anti-AFK, auth, and events
│   └── ui.js             # Discord UI helpers (embeds, components)
├── .env.example          # Example environment variable file
├── HOSTING.md            # Notes on self-hosting
├── package.json
└── LICENSE
```

---

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file and add your Discord bot token:
   ```
   DISCORD_TOKEN=your_token_here
   DISCORD_CHANNEL_ID=your_channel_id_here
   ```
4. Run the bot with `node src/index.js`

---

## License

This project is source-available. You may view, run, and privately modify the code, but distribution, public hosting, and commercial use are strictly prohibited. See [LICENSE](./LICENSE) for the full terms.

---

## Credits

Developed by **aliyie**  
Part of **AeroX Development**

Join the community: [discord.gg/aerox](https://discord.gg/aerox)
