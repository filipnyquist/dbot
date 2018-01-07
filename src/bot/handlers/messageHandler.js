import cfg from "config";

class MessageHandler {
  /**
   * Handles all the messages from discord and sends to correct subcommand.
   * @param {object} client - The discord.js client.
   * @param {object} db - A databaseHandler.
   */
  constructor(client, db) {
    this.c = client;
    this.db = db;
    this.c.on("message", m => {
      this.handleMsg(m);
    });
    console.log("MessageHandler Started...");
  }

  handleMsg(m) {
    // Handle the messages here
  }
}

export default MessageHandler;
