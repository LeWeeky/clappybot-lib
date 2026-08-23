/**
 * ClappyBot - A powerful framework for bot developers
 * Copyright (C) 2019–2026 LeWeeky
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////    CLAPPYBOTS ~ MAIN     //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { readdirSync } from "fs";
import dotenv from "dotenv";
import DiscordClient from "./libraries/client.js";
import { getOwnerId } from "./libraries/api/owner.js";
import package_json from "../package.json" with { type: "json" };
import DataBaseWrapper from "./libraries/drivers/DataBaseWrapper.js";
import Config from "./models/Config.js";
import RebootMessage from "./models/RebootMessage.js";
import type { Client } from "discord.js";
import type ADriver from "./libraries/drivers/ADriver.js";
import Roles from "./models/Roles.js";
import {
  getCacheDatabaseDriver,
  getMainDatabaseDriver,
} from "./libraries/drivers/getDatabaseDriver.js";

class ClappyBot {
  /**
   * The bot instance, used to access the discord.js client
   */
  bot: DiscordClient;

  /** Discord bot id */
  id: string;

  /**
   * Basic bot configuration, like prefix, activity, etc.
   */
  config: Config;

  /**
   * Discord guild id of the main guild
   */
  guild_id: string | null;

  /**
   * Discord id of the bot owner, used for admin commands
   */
  owner_id: string | null;

  /**
   * Envelops several databases, for example if you want
   * a faster local database for small items and a larger
   * remote one linked to your panel
   */
  databases: DataBaseWrapper;

  /**
   * Shortcut to the main database, used for most of the bot's data
   */
  database: ADriver | null = null;

  /**
   * Shortcut to the main database, used for most of the bot's data
   */
  cache: ADriver | null = null;

  /**
   * Start up status
   */
  ready: boolean;

  /**
   * Current version of the package
   */
  version: string;

  /**
   * The prefix used for commands
   */
  prefix: string;

  // TODO check if needed
  /**
   * The swap object, used to store data between files
   */
  swap: Record<string, any>;

  constructor() {
    dotenv.config({ path: ".env", override: true });
    this.bot = new DiscordClient();
    this.databases = new DataBaseWrapper();
    this.guild_id = null;
    this.owner_id = null;
    this.id = "abcde";
    this.ready = false;
    this.version = package_json.version;
    this.prefix = "+";
    this.swap = {};
    this.config = new Config();
  }

  /**
   * Initialize the bot, connect to the database and login to Discord
   */
  async init(bot?: DiscordClient | Client) {
    if (!bot) bot = this.bot;
    this.databases.add(getMainDatabaseDriver(), "main");
    this.databases.add(getCacheDatabaseDriver(), "cache");
    if (!process.env.TOKEN || process.env.TOKEN.length == 0) {
      this.critical("Token not found ...");
      process.exit(2);
    }
    bot.login(process.env.TOKEN);
    for (const file of readdirSync(import.meta.dirname + "/listeners")) {
      if (!file.endsWith(".js")) continue;
      const event = await import(`./listeners/${file}`);
      bot.on(event.name, (...args) => {
        if (!event.listen) {
          this.warning(`Event ${event.name} has no listen method`);
          return;
        }
        if (event.name == "ready") event.listen(bot);
        else event.listen(...args);
      });
    }
  }

  async new(bot: DiscordClient | Client) {
    this.bot = bot;
    if (process.env.SERVICE_ID) this.id = process.env.SERVICE_ID;
    else this.id = "EMPTY";

    const main_db = clappybot.databases.select("main");

    if (main_db) {
      this.database = main_db;
      Config.use(this.database!);
      Roles.use(this.database!);
      await Promise.all([Config.init(), Roles.init()]);

      this.config =
        (await Config.first()) ??
        (await Config.create({
          prefix: "+",
          activity: 1,
          twitch: "leweeky",
        }));

      globalThis.guild_id = this.guild_id = this.config.guild_id;
      this.prefix = this.config.prefix ?? "+";
    } else {
      this.critical("clappybot.database can't be set !");
      process.exit(127);
    }

    const cache_db = clappybot.databases.select("cache");
    if (cache_db) {
      this.cache = cache_db;
      RebootMessage.use(cache_db);
      RebootMessage.init();
    } else {
      this.critical("clappybot.cache can't be set !");
      process.exit(127);
    }

    this.owner_id = await getOwnerId(process.env.SERVICE_ID);

    this.ready = true;

    return this;
  }

  warning(message: string) {
    if (process.env.DEBUG_WARNING != "false") {
      console.warn("\x1b[31m%s\x1b[0m", "[ ! WARING ! ]:", message);
    }
  }

  critical(message: string) {
    if (process.env.DEBUG_CRITICAL != "false") {
      console.error("\x1b[31m%s\x1b[0m", "[ !!! CRITICAL !!! ]:", message);
    }
  }

  async setPrefix(prefix: string) {
    this.prefix = this.config.prefix = prefix;
    await this.config.save();
  }

  async setGuild(guild_id: string) {
    globalThis.guild_id = this.config.guild_id = this.guild_id = guild_id;
    await this.config.save();
  }

  getGuild() {
    if (this.ready) {
      if (this.guild_id) {
        if (this.bot.guilds.cache.has(this.guild_id))
          return this.bot.guilds.cache.get(this.guild_id);
      }
    }
    return null;
  }

  async countMembers(bots: boolean = false): Promise<number> {
    let members = 0;

    if (this.ready) {
      if (this.guild_id) {
        const guild = this.bot.guilds.cache.get(this.guild_id);
        if (guild) {
          guild.members.cache.forEach(function (member) {
            if (!member.user.bot || bots) members++;
          });
        }
      }
    }

    return members;
  }
}

export const clappybot = new ClappyBot();
