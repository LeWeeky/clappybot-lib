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

import { clappybot } from "../main.js";
import { system } from "../systems/system.js";
import build_commands from "../systems/interactions/slashBuilder.js";
import { get_invites_data } from "../libraries/fetching/invites.js";
import RebootMessage from "../models/RebootMessage.js";

/**
 *
 * @param {number} date
 * @returns {string} renvoie une date au format
 * "mécanique" (toujours 2 éléments)
 */
function mecanicDate(date) {
  const string_date = date.toString();
  if (string_date.length == 1) return `0${string_date}`;
  return string_date;
}

function printReadyMessage(bot) {
  const date = new Date();
  console.log(
    "[" +
      mecanicDate(date.getDate()) +
      "/" +
      mecanicDate(date.getMonth()) +
      "/" +
      date.getFullYear() +
      "-" +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds() +
      "] -> " +
      bot.user.tag +
      " started",
  );
}

export const name = "clientReady";
/**
 *
 * @param {import('discord.js').Client} bot
 */
export async function listen(bot) {
  await clappybot.new(bot);
  await system.init();
  await build_commands();

  {
    const guild = clappybot.getGuild();
    if (guild && guild.invites) {
      clappybot.swap["invites"] = await get_invites_data(guild);
    }
  }

  printReadyMessage(bot);

  const reboot_messages = await RebootMessage.all();

  // TODO check if needed
  if (reboot_messages.length > 0) {
    for (let i = 0; i < reboot_messages.length; i++) {
      const reboot_message = reboot_messages[i];

      if (!reboot_message.guild_id || !reboot_message.channel_id)
        continue;
      const guild = bot.guilds.cache.get(reboot_message.guild_id);
      if (guild) {
        const channel = guild.channels.cache.get(reboot_message.channel_id);
        if (channel && channel.isSendable())
          channel.send("✅ The bot has started successfully!");
        reboot_messages[i].delete();
      }
    }
  }
}
