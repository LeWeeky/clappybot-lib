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

export default class SlashCommands {
  
  /**
   * @type {Array<Object>}
   */
  guild_cmds;

  /**
   * @type {Array<Object>}
   */
  global_cmds

  constructor() {
    this.guild_cmds = [];
    this.global_cmds = [];
  }

  /**
 * @typedef {{
  * name: string, alias: string[] | undefined, builder: import('discord.js').SlashCommandBuilder | undefined,
  * permissions: Function[] | undefined, dm: boolean | undefined ,
  * any_guild: boolean | undefined, parse: (interaction: import('discord.js').ChatInputCommandInteraction, command_name: string, args: string[]) => Promise<void>, conditions: undefined
  * }} CommandFields
 */

  /**
   *
   * @param {CommandFields} command commande à ajouter
   */
  add(command) {
    if (command.builder) {
      const cmd_json = command.builder.toJSON();

      if (command.any_guild) this.global_cmds.push(cmd_json);
      else this.guild_cmds.push(cmd_json);
    }
  }

  /**
   * Supprime toutes les commandes
   */
  destroy() {
    this.guild_cmds = [];
    this.global_cmds = [];
  }
}
