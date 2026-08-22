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

import { AEvents, AEvent } from "../abstracts/events.js";

const config = {
  title: "MemberRemove",
  descriptior: undefined,
  direct_names: [
    "member_remove",
    "members_remove",
    "memberRemove",
    "membersRemove",
  ],
  shared_folder: true,
  extension: "leave.js",
  folder: "members",
  addons: "members/leave",
};

export class MembersRemove extends AEvents {
  constructor() {
    super(MemberRemove, config);
  }

  /**
   *
   * @param {import("discord.js").GuildMember} member
   */
  async scan(member) {
    for (let i in this._list) {
      if (
        this._list[i] &&
        (!member.user.bot || this._list[i].allow_bots) &&
        (member.guild.id == globalThis.guild_id || this._list[i].any_guild)
      ) {
        this._list[i].parse(member);
      }
    }
  }
}

export class MemberRemove extends AEvent {
  /**
   *
   * @param {{
   * 	conditions: Function[] | undefined, dm: boolean
   * | undefined , any_guild: boolean | undefined, allow_bots: true | undefined, parse: Function
   * }} event_handler Informations du nouveau message
   * @param {string} file_path
   */
  constructor(event_handler, file_path) {
    super(event_handler, file_path);
  }
}
