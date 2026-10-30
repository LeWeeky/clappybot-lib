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

import { clappybot } from "../../main.js";
import { AEvents, AEvent } from "../abstracts/events.js";
const config = {
  title: "ChannelCreate",
  descriptior: undefined,
  direct_names: ["channelCreate", "channelsCreate"],
  shared_folder: true,
  extension: "create.js",
  folder: "channels",
  addons: "channels/create",
};

/**
 * @typedef {{
   * 	conditions: Function[] | undefined | undefined, dm: boolean
   * | undefined , any_guild: boolean | undefined, parse: (channel: import('discord.js').GuildChannel) => Promise<void>
   * }} ChannelFields
 */
/**
 * @extends {AEvents<ChannelFields, ChannelCreate, typeof ChannelCreate>}
 */
export default class ChannelsCreate extends AEvents {
  constructor() {
    super(ChannelCreate, config);
  }

  /**
	 *
	 * @param {import("discord.js").GuildChannel} channel
	 */
  async scan(channel) {
    for (let i in this._list) {
      if (channel.guild.id == clappybot.guild_id || this._list[i].any_guild)
        this._list[i].parse(channel);
    }
  }
}

class ChannelCreate extends AEvent {
  /**
   *
   * @param {ChannelFields} event_handler Informations du nouveau message
   * @param {string} file_path
   */
  constructor(event_handler, file_path) {
    super(event_handler, file_path);
  }
}
