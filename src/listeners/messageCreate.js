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

import split from "../libraries/formating/split.js";
import { clappybot } from "../main.js";
import isStaff from "../libraries/permissions/guild_staff.js";
import { system } from "../systems/system.js";

export const name = "messageCreate";
/**
 *
 * @param {import('discord.js').Message} message
 * @returns
 */
export async function listen(message) {
  const prefix = clappybot.prefix;

  let command_name;
  let args = split(message.content.toLocaleLowerCase());

  if (message.content.startsWith(prefix) && message.content.length > 1) {
    command_name = args[0].substring(prefix.length);
    args = args.slice(1, args.length);
  }

  if (command_name) system.commands.scan(message, command_name, args);
  system.messageCreate.scan(message);

  if (
    message.member &&
    message.guild &&
    message.guild.id == clappybot.guild_id
  ) {
    if (await isStaff(message.member)) {
      if (message.content == prefix + "join") {
        clappybot.bot.emit("guildMemberAdd", message.member);
        message.delete();
      }

      if (message.content == prefix + "leave") {
        clappybot.bot.emit("guildMemberRemove", message.member);
        message.delete();
      }
    }
  }
}
