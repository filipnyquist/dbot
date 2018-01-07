import Discord from "discord.js";
import cfg from "config";
import fs from "fs";
import path from "path";

class MessageHandler {
  /**
   * Handles all the messages from discord and sends to correct subcommand.
   * @param {object} client - The discord.js client.
   * @param {object} db - A databaseHandler.
   */
  constructor(bot, db) {
    this.bot = bot;
    this.commands = new Map();
    this.db = db;
    this.trigger = cfg.get("Bot.trigger");
    this.bot.on("message", msg => {
      this.handleMsg(msg);
    });
    console.log("MessageHandler Started...");
    this.loadCommands();
  }

  loadCommands() {
    fs.readdir(path.join(__dirname, "../cmds"), (err, files) => {
      if (err) console.error(err);

      const jsfiles = files.filter(f => f.split(".").pop() === "js");
      if (jsfiles.length <= 0) {
        console.log("No commands to load!");
        return null;
      }

      console.log(`Loading ${jsfiles.length} commands!`);

      jsfiles.forEach((f, i) => {
        import(path.join(path.join(__dirname, `../cmds/${f}`))).then(p => {
          let props = new p.default( // eslint-disable-line
            Discord,
            this.bot,
            this.db,
            this.db.getRawRethink()
          );
          this.commands.set(props.info.bCommand, props);
        });
      });
    });
  }

  async handleMsg(msg) {
    if (msg.author.bot) return;
    const msgArray = msg.content.split(/\s+/g);
    const command = msgArray[0];
    const args = msgArray.slice(1);
    if (!command.startsWith(this.trigger)) return;
    const cmd = this.commands.get(command.slice(this.trigger.length));
    if (cmd) cmd.run(msg, args);
  }
}

export default MessageHandler;
