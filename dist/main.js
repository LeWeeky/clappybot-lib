/**
 * ClappyBot - A powerful framework for bot developers
 * Copyright (C) 2019–2025 LeWeeky
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

const { Random } = require('clappybot/dist/libraries/random_numbers');
const { Client } = require('discord.js');
const { readdirSync } = require('fs');
const dotenv = require("dotenv");
const { exit } = require('process');
const { get_owner_id } = require('./libraries/fetching/owner');
const { version } = require("clappybot/package.json");
const { DataBaseWrapper } = require('clappybot/dist/libraries/models/DataBaseWrapper');
const { MySQLDriver } = require('clappybot/dist/libraries/models/MySQLDriver');
const { SqliteDriver } = require('clappybot/dist/libraries/models/SqliteDriver');
const { ADriver } = require('clappybot/dist/libraries/models/ADriver');
const { Config } = require('clappybot/dist/models/Config');
const { RebootMessage } = require('clappybot/dist/models/RebootMessage');

function getAscii()

{
    const ASCII =

    [
`
.__                        
/  | _  _  _   |__| _  _|_ 
\\__|(_||_)|_)\\/|  |(_)_)|_ 
    |  |  /             
`.trim()

        ,

`-------- ปรบมือโฮสติ้ง --------`

        ,

`-------- paʻipaʻi hoʻokipa --------`
        ,

`
-.-. .-.. .- .--. .--. -.-- .... --- ... -
`.trim(),
`-------- クラッピークルー --------`
        ,

`
.---..-.   .---..---..---..-..-..-. .-..----..---..---.
| |  | |__ | | || |-'| |-' >  / | |=| || || | \\ \\ \`| |'
\`---'\`----'\`-^-'\`-'  \`-'   \`-'  \`-' \`-'\`----'\`---' \`-' 
`.trim()

        ,

`
.  ,___ _                       __             
  /   ///                      ( /  /       _/_
 /    // __,   ,_    ,_   __  , /--/ __ (   /  
(___/(/_(_/(__/|_)__/|_)_/ (_/_/  /_(_)/_)_(__ 
            /|    /|      /                  
            (/    (/      '                  
`.trim()
        ,

`
.  ____ _                         _   _           _   
  / ___| | __ _ _ __  _ __  _   _| | | | ___  ___| |_ 
 | |   | |/ _\` | '_ \\| '_ \\| | | | |_| |/ _ \\/ __| __|
 | |___| | (_| | |_) | |_) | |_| |  _  | (_) \__ \ |_ 
 \\____|_|\\__,_| .__/| .__/ \\__, |_| |_|\\___/|___/\\__|
            |_|   |_|    |___/                                   
`.trim()
    ]

    const i = new Random(0, ASCII.length).next();
    return (ASCII[i])
}

function showMissingParameters()
{
	/**
	 * 
	 * @param {string} parameter 
	 */
	function warn(parameter)
	{
		console.warn(`${parameter} is missing`)
	}

	if (!process.env.DB_HOST)
		warn("DB_HOST");
	if (!process.env.DB_USER)
		warn("DB_HOST");
	if (!process.env.DB_PASSWORD)
		warn("DB_HOST");
	if (!process.env.DB_NAME)
		warn("DB_HOST");
}

class ClappyBot
{
	/**
	 * @type {Config}
	 */
	config;
	/**
	 * @type {string | null}
	 */
	guild_id;

	/**
	 * @type {string | null}
	 */
	owner_id;

	/**
	 * This class is deprecated and will be
	 * removed in few updates
	 * @type {ADriver}
	 */
	database;

	/**
	 * Envelops several databases, for example if you want
	 * a faster local database for small items and a larger
	 * remote one linked to your panel
	 * @type {DataBaseWrapper}
	 */
	databases;

    constructor ()

    {
		dotenv.config({path: "./data/.env", override: true});
        this.bot = new Client({intents: 3276799});
		this.databases = new DataBaseWrapper();
        this.guild_id = null;
        this.owner_id = null;
        this.id = "abcde";
        this.ready = false;
        this.version = version
        this.modules = {};
		this.tmp_modules = {};
        this.disabled_modules = {};
        this.prefix = "+";
        this.dolphin = false;
        this.swap = {
            ram_log: [],
            invives: {},
            antiraid: {
                members: {},
                channels: {},
                guild: {}
            },
            mutex: {},
            tmp: {}
        };
    }

    /**
     * 
     * @param {Client} bot 
     */
    async init (bot)

    {
		switch (process.env.DB_DRIVER)
		{
			case "mysql":
				if (process.env.DB_HOST && process.env.DB_USER
					&& process.env.DB_PASSWORD && process.env.DB_NAME)
				{
					this.databases.add(
						new MySQLDriver({
							host: process.env.DB_HOST,
							user: process.env.DB_USER,
							password: process.env.DB_PASSWORD,
							database: process.env.DB_NAME,
							supportBigNumbers: true,
							bigNumberStrings: true
						}),
						"main"
					);
				}
				else
				{
					this.critical("some database parameters are missing");
					showMissingParameters();
					process.exit(78);
				}	
				break;

			case "sqlite":
				if (process.env.DB_PATH)
				{
					this.databases.add(
						new SqliteDriver({
							path: process.env.DB_PATH,
						}),
						"main"
					);
				}
				else
				{
					this.critical("You have to set DB_PATH when DB_DRIVER=sqlite");
					process.exit(78);
				}
				break;

			default:
				if (process.env.DB_DRIVER)
					this.critical(`${process.env.DB_DRIVER} is not a valid driver for the database!`);
				else
					this.critical("DB_DRIVER not set!");
				process.exit(78);
		}
		this.databases.add(
			new SqliteDriver({
				path: "data/cache.db",
			}),
			"cache"
		);
		if (!process.env.TOKEN || process.env.TOKEN.length == 0)
        {
			this.critical("Token not found ...");
			exit(2);
		}
        if (!process.env.TOKEN || process.env.TOKEN.length == 0)
        {
			console.error("Token not found ...");
			exit(2);
		}
        bot.login(process.env.TOKEN);
        readdirSync("./node_modules/clappybot/dist/listeners/")
        .forEach(file => 
        {
            const event = require(`clappybot/dist/listeners/${file}`);
            bot.on(event.name, (...args) => {
                if (event.name == "ready")
                    event.listen(bot)
                else
                    event.listen(...args)
            });
        });
    }

    async new (bot)

    {
        this.bot = bot
		if (process.env.SERVICE_ID)
        	this.id = process.env.SERVICE_ID
		else
			this.id = "EMPTY";

		const main_db = clappybot.databases.select("main");

		if (main_db)
		{
			this.database = main_db;
			Config.use(this.database);
			await Config.init();

			this.config = await Config.first() ?? await Config.create({
					prefix: "+",
					activity: 1,
					twitch: "leweeky"
				});
		
			globalThis.guild_id = this.guild_id = this.config.guild_id;
			this.prefix = this.config.prefix ?? '+';
		}
		else
		{
			this.critical("clappybot.database can't be set !")
			process.exit(127);
		}

		const cache_db = clappybot.databases.select("cache");
		if (cache_db)
		{
			this.cache = cache_db;
			RebootMessage.use(cache_db);
			RebootMessage.init();
		}
		else
		{
			this.critical("clappybot.cache can't be set !")
			process.exit(127);
		}

       	this.owner_id = await get_owner_id(process.env.SERVICE_ID);

        this.ready = true;

        return (this);
    }

	warning(message)
	{
		if (process.env.DEBUG_WARNING != "false")
		{
			console.warn('\x1b[31m%s\x1b[0m', "[ ! WARING ! ]:", message)
		}
	}

	critical(message)
	{
		if (process.env.DEBUG_CRITICAL != "false")
		{
			console.error('\x1b[31m%s\x1b[0m', "[ !!! CRITICAL !!! ]:", message)
		}
	}
	/**
	 * 
	 * @param {string} prefix 
	 */
    async setPrefix(prefix)
    {
        this.prefix = this.config.prefix = prefix;
		await this.config.save();
    }

	/**
	 * 
	 * @param {string} guild_id 
	 */
    async setGuild(guild_id)
    {
		globalThis.guild_id = this.config.guild_id = this.guild_id = guild_id;
		await this.config.save();
    }

	getGuild()
    {
        if (this.ready)
        {
            if (this.guild_id)
            {
                if (this.bot.guilds.cache.has(this.guild_id))
                    return (this.bot.guilds.cache.get(this.guild_id))
            }
        }
        return (null)
    }

	/**
	 * 
	 * @param {boolean} bots 
	 * @returns 
	 */
    async getMembers(bots= false)

    {
        let members = 0;

        if (this.ready)

        {
            if (this.guild_id)

            {
				const guild = this.bot.guilds.cache.get(this.guild_id);
                if (guild)

                {
                    guild.members.cache.forEach(
                        function(member)
                        {
                            if (!member.user.bot || bots) members++;
                        }
                    )
                }
            }
        }

        return (members);
    }

    ram_debug()

    {
        const ram_now = Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 10) / 10;
        let i = 0;
        let total = ram_now;

        this.swap['ram_log'].push(ram_now)

        while (this.swap['ram_log'][i])
        {
            total+= this.swap['ram_log'][i]
            i++;
        }

        const avarage = Math.round(total / i * 10) / 10;
        console.log(
            `---------------\n`+
            `   RAM USAGE\n`+
            `---------------\n`+
            `Now: ${ram_now}Mb\n`+
            `Avarage: ${avarage}Mb\n`+
            `---------------`
        )

        return (
            ` -------------------\n`+
            `   Actuel: ${ram_now}Mb\n`+
            `   Moyenne: ${avarage}Mb\n`+
            ` -------------------`
        );
    }

	// depreciate, will be deleted
    async last_version(data = "version")
    {
        const version_page = await fetch("https://clappycrew.com/clappybots/last_version");
        if (version_page)

        {
            const version_to_json = await version_page.json();
            if (version_to_json)

            {
                if (data == "all")
                    return (version_to_json);
                return (version_to_json[data])
            }
        }
        return (version);
    }
}

const clappybot = new ClappyBot();

module.exports = { clappybot, version, getAscii }