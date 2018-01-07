import RethinkDb from "rethinkdbdash";
import cfg from "config";

class DatabaseHandler {
  /**
   * Create the database handler, handles all the database integration for
   * the bot.
   */
  constructor() {
    this.db = RethinkDb({
      servers: [cfg.get("Bot.dbConfig")]
    });
    console.log("DatabaseHandler Started...");
  }

  async getGuildConfig() {
    // Get guild config via function
  }

  async createIfNotExists(guild) {
    this.query = await this.db
      .dbList()
      .contains(guild.id)
      .do(databaseExists =>
        this.db.branch(
          databaseExists,
          {
            dbs_created: 0
          },
          this.db.dbCreate(guild.id)
        )
      )
      .run();
    await this.db
      .db(guild.id)
      .tableCreate("tickets")
      .run();
    await this.db
      .db("guildSettings")
      .table("guilds")
      .insert([
        {
          guildId: guild.id,
          guildName: guild.name
        }
      ])
      .run();
    return this.query;
  }
}

export default DatabaseHandler;
