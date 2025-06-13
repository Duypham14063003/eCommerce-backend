const { Client, GatewayIntentBits } = require("discord.js");
const { DISCORD_BOT_TOKEN, CHANNELID_DISCORD } = process.env;
class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    // add channel ID to the client
    this.channelId = CHANNELID_DISCORD;
    this.client.once("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });
    this.client.login(DISCORD_BOT_TOKEN);
  }
  sendToFormatCode(logData) {
    const {
      code,
      message = "This is some additional information about the code.",
      title = "Code Example",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16), // Convert hexadecimal color code to integer
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    this.sendToMessage(codeMessage);
  }

  sendToMessage(message = "message") {
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.error("Channel not found");
      return;
    }
    channel.send(message).catch((error) => {
      console.error("Error sending message:", error);
    });
  }
}

module.exports = new LoggerService();
