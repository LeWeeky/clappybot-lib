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

import { MessageFlags } from "discord.js";
import { system } from "../systems/system.js";

export const name = "interactionCreate";
/**
 *
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @returns
 */
export async function listen(interaction) {
  if (interaction.isCommand()) {
    const { commandName } = interaction;
    if (!(await system.commands.scan(interaction, commandName, []))) {
      const interaction_reply = /** @type {any} */ (interaction.reply.bind(interaction));
      interaction_reply({
        content: "Sorry but, this command is not available in private messages.",
        flags: [MessageFlags.Ephemeral],
      });
    }
  }
  if (interaction.isButton()) system.buttons.scan(interaction);
  if (interaction.isAnySelectMenu()) system.menus.scan(interaction);
  else if (interaction.isModalSubmit()) system.modals.scan(interaction);
}
