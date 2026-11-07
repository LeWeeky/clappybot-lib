/**
 * ClappyBot - A powerful framework for bot developers
 * Copyright (C) 2025-2026 LeWeeky
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

import {
  GlobalPermissions,
  GuildPermissions,
} from "../../models/Permissions.js";

export default class UserPermissions {
  /**
   * @type {GlobalPermissions | null}
   */
  global;

  /**
   * @type {GuildPermissions | null}
   */
  guild;

  /**
   * @type {string}
   */
  user_id;

  /**
   * @type {string | null}
   */
  guild_id;

  /**
   *
   * @param {string} user_id
   * @param {string | null} guild_id
   */
  constructor(user_id, guild_id = null) {
    this.user_id = user_id;
    this.guild_id = guild_id;
    this.global = null;
    this.guild = null;
  }

  /**
   * 
   * @param {boolean} force 
   * @returns 
   */
  async fetchGlobal(force = false) {
    if (!this.global || force)
      this.global = await GlobalPermissions.firstByOrCreate({
        user_id: this.user_id,
      });
    return this.global;
  }

  /**
   * 
   * @param {boolean} force 
   * @returns 
   */
  async fetchGuild(force = false) {
    if ((!this.guild || force) && this.guild_id)
      this.guild = await GuildPermissions.firstByOrCreate({
        user_id: this.user_id,
        guild_id: this.guild_id,
      });
    return this.guild;
  }

  async refresh() {
    await Promise.all([this.fetchGlobal(true), this.fetchGuild(true)]);
  }

  /**
   *
   * @param {string} guild_id
   */
  async setGuild(guild_id) {
    this.guild = await GuildPermissions.firstByOrCreate({
      user_id: this.user_id,
      guild_id: guild_id,
    });
  }
  /**
   *
   * @param {number} permission_bit
   */
  has(permission_bit) {
    if (this.global?.has(permission_bit)) return true;
    if (this.guild) return this.guild.has(permission_bit);
    return false;
  }
}
