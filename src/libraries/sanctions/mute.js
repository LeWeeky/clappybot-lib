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

import History from "./history.js";
import Member from "../../models/Member.js";

/**
 *
 * @param {import("discord.js").Guild} guild
 * @param {string} user_id
 * @returns {Promise<boolean>}
 */
export async function is_mute(guild, user_id) {
  if (guild && guild.members.cache.has(user_id)) {
    const mute_role_id = null;//await clappybot.roles.get("mute");
    if (!mute_role_id) return false;
    return (
      guild.members.cache
        .get(user_id)
        ?.roles.cache.has(mute_role_id) || false
    );
  }
  const member = await Member.firstBy({ user_id: user_id, guild_id: guild.id });
  return (member && member.mute) || false;
}

export async function mute_role_exists(guild) {
  const mute_role_id = null;//await clappybot.roles.get("mute");
  if (mute_role_id) return guild.roles.cache.has(mute_role_id);
  return false;
}

/**
 * 
 * @param {import("discord.js").User} user 
 * @param {string} reason 
 * @param {import("discord.js").Guild} guild 
 * @param {import("discord.js").User} author 
 * @returns 
 */
export async function mute(user, reason, guild, author) {
  const db_member = await Member.firstByOrCreate({
    user_id: user.id,
    guild_id: guild.id,
  });
  db_member.mute = true;
  await db_member.save();

  new History(user, guild.id).add("mute", reason, author);

  const member = guild.members.cache.get(user.id);
  const mute_role_id = null;//await clappybot.roles.get("mute");
  if (member && mute_role_id) {
    const res = await member.roles
      .add(mute_role_id)
      .then((_res) => {
        return true;
      })
      .catch((error) => {
        console.error("Impossible to add mute role:", error);
        return false;
      });
    return res;
  }
  return true;
}
