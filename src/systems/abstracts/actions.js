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

import { ChannelType } from "discord.js";
import { AEvents, AEvent } from "./events.js";
import { clappybot } from "../../main.js";

/**
 * @typedef {{
 * 	dm: boolean | undefined , any_guild: boolean | undefined , parse: (...args: any[]) => Promise<void>, conditions: Function[] | undefined
 * }} ActionFields
 */

/**
 * @template {ActionFields} P
 * @template {AEvent} T
 * @typedef {new (fields: P, file_path: string) => T} AConstructor
 */

/**
 * @template {ActionFields} P
 * @template {AAction} T
 * @template {AConstructor<P, T>} C
 * @extends {AEvents<P, T, AConstructor<P, T>>}
 */
export class AActions extends AEvents {
  /** Constructor
   *  @param {C} type
   *  @param {{"title": string, "descriptior": string | undefined,
   * 	direct_names?: string[] | undefined, shared_folder?: boolean | undefined,
   * 	"extension": string, "folder": string, "addons": string }} config
   */
  constructor(type, config) {
    super(type, config);
  }

  /**
   * 
   * @param {import("discord.js").Channel} channel 
   * @returns {boolean}
   */
  isDM(channel) {
    return (
      channel.type == ChannelType.DM || channel.type == ChannelType.GroupDM
    );
  }

  /**
   *
   * @param {*} interaction
   * @param {AAction} action
   * @returns {boolean}
   */
  validChannel(interaction, action) {
    if (this.isDM(interaction.channel) && action.dm) return true;
    if (
      interaction.guild &&
      (interaction.guild.id == clappybot.guild_id || action.any_guild)
    )
      return true;
    return false;
  }
}

export class AAction extends AEvent {
  /**
   * @type {Function[] | undefined}
   */
  conditions;

  /**
   * @type {boolean | undefined}
   */
  dm;

  /**
   *
   * @param {ActionFields} interaction Informations e la nouvelle interaction
   * @param {string} file_path
   */
  constructor(interaction, file_path) {
    super(interaction, file_path);
    this.conditions = interaction.conditions;
    this.dm = interaction.dm;
  }
}
