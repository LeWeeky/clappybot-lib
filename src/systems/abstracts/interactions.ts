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

import { MessageFlags, type Interaction } from "discord.js";
import { AActions, AAction } from "./actions.js";
import type { InteractionProps } from "../../interfaces/interaction.interface.js";

export class AInteractions<InteractionType extends Interaction, T extends AInteraction, C extends new (...args: any[]) => T> extends AActions<InteractionProps<InteractionType>, T, C> {
  /** Constructor
   *  @param {C} type
   *  @param {{"title": string, "descriptior": string | undefined,
   * 	direct_names?: string[] | undefined,
   * 	"extension": string, "folder": string, "addons": string }} config
   */
  constructor(type: C, config) {
    super(type, config);
  }

  /**
   * @param {*} interaction
   * @param {Function[] | undefined} permissions
   */
  async has_permissions(interaction, permissions) {
    let i = 0;

    if (!permissions || permissions.length == 0) return true;
    while (permissions[i]) {
      if (await permissions[i](interaction.member)) return true;
      i++;
    }
    return false;
  }

  /**
   * @param {*} interaction
   * @param {Function[] | undefined} conditions
   */
  async has_conditions(interaction, conditions) {
    let i = 0;

    if (!conditions) return false;
    while (conditions[i]) {
      if (await conditions[i](interaction)) return true;
      i++;
    }
    return false;
  }

  /**
   *
   * @param {AInteraction} source
   * @param {*} interaction
   */
  isEqual(source, interaction) {
    return source.customId && source.customId == interaction.customId;
  }

  /**
   *
   * @param {*} interaction
   */
  async scan(interaction) {
    if (interaction.customId == "test") {
      interaction.reply({
        content: "Waow, ça marche !",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }
    for (let i in this._list) {
      if (this.validChannel(interaction, this._list[i])) {
        if (
          this.isEqual(this._list[i], interaction) ||
          (await this.has_conditions(interaction, this._list[i].conditions))
        ) {
          if (
            await this.has_permissions(interaction, this._list[i].permissions)
          ) {
            try {
              this._list[i].parse(interaction);
            } catch (error) {
              console.error(interaction.customId, error);
            }
          } else {
            interaction.reply({
              content:
                "Désolé mais, vous n'avez pas la permission d'utiliser " +
                this._config.descriptior +
                " !",
              flags: [MessageFlags.Ephemeral],
            });
          }
          return;
        }
      }
    }
    console.error(
      `${this._config.title}:`,
      interaction.customId,
      "doesn't work or doesn't exist!",
    );
    interaction.reply({
      content:
        "Désolé mais, une erreur est survenue, contactez le développeur !",
      flags: [MessageFlags.Ephemeral],
    });
  }
}


export class AInteraction extends AAction {
  /**
   * @type {string | undefined}
   */
  customId;

  /**
   * @type {Function[] | undefined}
   */
  conditions;

  /**
   * @type {Function[] | undefined}
   */
  permissions;

  /**
   * @type {boolean | undefined}
   */
  dm;

  /**
   *
   * @param {InteractionFields} interaction
   * @param {string} file_path
   */
  constructor(interaction, file_path) {
    super(interaction, file_path);
    this.parse = interaction.parse;
    if ("conditions" in interaction)
      this.conditions = interaction.conditions;
    if ("customId" in interaction)
      this.customId = interaction.customId;
    this.dm = interaction.dm;
    this.permissions = interaction.permissions;
  }
}
