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

import { PermissionsBitField } from "discord.js";
import History from "./history.js";

const Permissions = PermissionsBitField.Flags;
/**
 * 
 * @param {import("discord.js").Guild} guild 
 * @returns {boolean}
 */
export function bot_can_kick(guild) {
  return guild.members.me?.permissions.has(Permissions.KickMembers) || false;
}

/**
 * 
 * @param {import("discord.js").GuildMember} member 
 * @returns 
 */
export function user_can_kick(member) {
  return member.permissions.has(Permissions.KickMembers);
}

/**
 * 
 * @param {import('discord.js').User} user 
 * @param {string} reason 
 * @param {import('discord.js').User} author 
 * @param {import('discord.js').Guild} guild 
 */
export async function kick(user, reason, author, guild) {
  const date = new Date();
  let day = String(date.getDate());
  let month = String(date.getMonth() + 1);
  const year = date.getFullYear();

  if (day.length == 1) day = "0" + day;
  if (month.length == 1) month = "0" + month;

  const member = guild.members.cache.get(user.id);
  if (member) {
    member.kick(
      `Modérateur: ${author.tag}, Date: ${day}/${month}/${year}, Raison: ${reason}`,
    );
    new History(user, guild.id).add("kick", reason, author);
  }
}
