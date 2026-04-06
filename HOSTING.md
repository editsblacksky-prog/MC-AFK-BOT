━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MC AFK Bot — Pterodactyl Hosting Guide
  Made by Ayliee · AeroX Development
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REQUIREMENTS
────────────
  • Pterodactyl panel with a Node.js egg (v18 or higher)
  • A Discord bot token from https://discord.com/developers/applications
  • The bot application must have these Privileged Gateway Intents enabled:
      – Message Content Intent
      – Server Members Intent  (optional but recommended)

STEP 1 — CREATE THE EGG (if not already set up)
─────────────────────────────────────────────────
  In your Pterodactyl panel:
    Admin → Nests → Import Egg
  Use the official "Node.js Generic" egg, or any Node.js egg that:
    • Runs `npm install` before start
    • Uses `npm start` (or `node src/index.js`) as the startup command

  Recommended startup command:
    npm install --omit=dev && npm start

STEP 2 — CREATE THE SERVER
────────────────────────────
  Admin → Servers → Create New
    • Choose your Node.js egg
    • Set Node.js version to 18 or higher
    • RAM: 256 MB minimum (512 MB recommended if running many bots)
    • Disk: 512 MB minimum

STEP 3 — UPLOAD THE BOT
─────────────────────────
  In your server's File Manager:
    1. Upload mc-afk-bot-fixed.zip to the root of the server
    2. Right-click the zip → Extract
    3. The result should look like:
         /home/container/
           src/
             index.js
             BotManager.js
             MinecraftBot.js
             ui.js
           package.json
           .env.example

STEP 4 — SET ENVIRONMENT VARIABLES
─────────────────────────────────────
  Option A — Via Pterodactyl Startup Variables (recommended):
    Go to your server → Startup tab
    Add the following variables:
      DISCORD_TOKEN   → your bot token
      GUILD_ID        → your Discord server ID (optional, leave blank for all guilds)

  Option B — Via .env file:
    In the File Manager, copy .env.example → .env
    Edit .env and fill in your DISCORD_TOKEN and optionally GUILD_ID

STEP 5 — START THE SERVER
───────────────────────────
  Click Start. Pterodactyl will run `npm install` and then `npm start`.
  You should see in the console:
    Discord bot logged in as YourBot#1234 — restricted to guild 123456789...

  If you see:
    [ERROR] DISCORD_TOKEN is not set.
  → Go back to Step 4 and make sure the token is configured.

STEP 6 — INVITE THE BOT
─────────────────────────
  Go to https://discord.com/developers/applications
  Select your bot → OAuth2 → URL Generator
  Scopes:   bot
  Permissions:
    • Read Messages / View Channels
    • Send Messages
    • Read Message History
  Copy the URL and open it in your browser to invite the bot.

  IMPORTANT: In the bot's settings page, enable:
    • Message Content Intent  (required for commands to work)

COMMANDS
────────
  !join <ip[:port]> [username]   Join a cracked server
  !premjoin <ip[:port]>          Join an online-mode server (Microsoft login)
  !leave <ip> <username>         Disconnect a bot
  !say <username> <message>      Send a chat message in-game
  !bots                          List all active bots
  !jump <ip> <username>          Force a bot to jump
  !help                          Show command reference in Discord

GUILD ID RESTRICTION
─────────────────────
  Setting GUILD_ID limits all commands to one Discord server.
  Any message from another server is silently ignored.
  To get your server ID:
    1. Open Discord Settings → Advanced → Enable Developer Mode
    2. Right-click your server icon → Copy Server ID

NOTES
─────
  • Microsoft (premium) auth tokens are cached in auth-cache/ inside the
    server folder. Delete that folder to force a new Microsoft login.
  • Bots auto-jump every 5 seconds and look around every 30 seconds to
    prevent AFK kicks.
  • Each bot auto-reconnects up to 5 times before being removed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
