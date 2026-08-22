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

import { REST, Routes } from "discord.js";
import { clappybot } from "../../main.js";
import { system } from "../system.js";

/** @typedef {import("discord.js").ClientUser} ReadyDiscordClient */

/**
 *
 * @param {REST | null} rest
 */
async function buildGlobalCommands(rest = null) {
  if (!rest) rest = new REST().setToken(process.env.TOKEN || "");

  try {
    console.log(
      `Reloading ${system.commands.commands_builder.global_cmds.length} global (/) commands...`,
    );

    const data =
      /** @type {import("discord.js").RESTPutAPIApplicationGuildCommandsResult} */ (
        await rest.put(
          Routes.applicationCommands(
            /** @type {ReadyDiscordClient} */ (clappybot.bot.user).id
          ),
          {
            body: system.commands.commands_builder.global_cmds,
          },
        )
      );

    console.log(
      `${data.length} global (/) commands have been reloaded.`,
    );
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 * @param {REST | null} rest
 */
async function buildGuildCommands(rest = null) {
  if (!rest) rest = new REST().setToken(process.env.TOKEN || "");

  try {
    console.log(
      `Reloading ${system.commands.commands_builder.guild_cmds.length} guild (/) commands...`,
    );

    const data =
      /** @type {import("discord.js").RESTPutAPIApplicationGuildCommandsResult} */ (
        await rest.put(
          Routes.applicationGuildCommands(
            /** @type {ReadyDiscordClient} */ (clappybot.bot.user).id,
            globalThis.guild_id,
          ),
          { body: system.commands.commands_builder.guild_cmds },
        )
      );

    console.log(`${data.length} guild (/) commands have been reloaded.`);
  } catch (error) {
    console.error(error);
  }
}

export default async function build_commands() {
  const rest = new REST().setToken(process.env.TOKEN || "");

  buildGlobalCommands(rest);

  if (!globalThis.guild_id) return;
  buildGuildCommands(rest);
}
