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

const { AEvents, AEvent } = require("../abstracts/events");
const config = {
	"title": "ChannelCreate",
	"descriptior": undefined,
	"direct_names": ["channelCreate", "channelsCreate"],
	"shared_folder": true,
	"extension": "create.js",
	"folder": "channels",
	"addons": "channels/create"
}


class ChannelsCreate extends AEvents
{
	constructor()
	{
		super(ChannelCreate, config)
	}

	async scan(channel)
	{
		for (let i in this._list)
		{
			if (this._list[i] &&
				(channel.guild.id == globalThis.guild_id || this._list[i].any_guild))
			{
				if (this._list[i].parse)
					this._list[i].parse(channel)
				else
					console.log("Empty parse", config.title)
			}
		}
	}
}


class ChannelCreate extends AEvent
{
	/**
	 * 
	 * @param {{
	 * 	conditions: Function[] | undefined | undefined, dm: boolean
	 * | undefined , any_guild: boolean | undefined, parse: Function
	 * }} event_handler Informations du nouveau message
	 * @param {string} file_path
	 */
	constructor(event_handler, file_path)
	{
		super(event_handler, file_path)
	}
}

module.exports = { ChannelsCreate }