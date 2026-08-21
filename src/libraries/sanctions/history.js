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

import HistoryPage from "../../models/HistoryPage.js";
import Member from "../../models/Member.js";

export default class History {
  /**
   *
   * @type {Member | null} member
   */
  member;

  /**
   * @param {*} user
   * @param {string} guild_id
   */
  constructor(user, guild_id) {
    this.user = user;
    this.guild_id = guild_id;
    this.member = null;
  }

  async fetchMember() {
    if (!this.member)
      this.member = await Member.firstBy({
        user_id: this.user.id,
      });
    return this.member;
  }

  /**
   * @returns {Promise<HistoryPage[]>}
   */
  async get() {
    await this.fetchMember();
    if (!this.member) return [];
    await this.member.fetchStuff();
    // TODO remove the ts-ignore when the Models system will be fully typed
    // @ts-ignore
    if (!this.member.history) return [];
    // @ts-ignore
    return this.member.history;
  }

  /**
   * @param {string} sanction
   * @param {string} reason
   * @param {import('discord.js').User} author
   * @returns {Promise<HistoryPage>}
   */
  async add(sanction, reason, author) {
    if (!this.member)
      this.member = await Member.create({
        guild_id: this.guild_id,
        user_id: this.user.id,
      });
    const history = new HistoryPage({
      sanction: sanction,
      author: author.username,
      reason: reason,
    });

    this.member.addToHistory(history);
    return history;
  }
}
