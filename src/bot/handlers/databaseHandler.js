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

  getRawRethink() {
    // Get raw db for commands
    return this.db;
  }

  async cmdIsEnabled(guildId, command) {
    const enabledCommands = await this.db
      .db(guildId)
      .table("settings")
      .get("enabled")
      .run();
    if (!enabledCommands.enabled) return false;
    if (enabledCommands.enabled.includes(command)) return true;

    return false;
  }

  async userHasPermission(guildId, guildUser, command) {
    const userRoles = guildUser.roles.map(r => r.name);
    const permissions = await this.db
      .db(guildId)
      .table("settings")
      .get("permissions")
      .run();
    if (!permissions) return false;
    if (!permissions.permissions[command]) return false;
    if (permissions.permissions[command].some(r => userRoles.includes(r))) {
      return true;
    }
    return false;
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
      .tableCreate("settings")
      .run();
    await this.db
      .db(guild.id)
      .table("settings")
      .insert([
        {
          id: "permissions",
          permissions: []
        },
        {
          id: "enabled",
          enabled: ["ping", "me"]
        }
      ])
      .run();
    return this.query;
  }
}

export default DatabaseHandler;
