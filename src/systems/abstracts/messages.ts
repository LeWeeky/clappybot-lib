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

import type { Message } from "discord.js";
import type { ActionProps } from "../../interfaces/abstracts/action.interface.js";
import type { MessageProps } from "../../interfaces/message.interface.js";
import { clappybot } from "../../main.js";
import { AActions, AAction } from "./actions.js";
import type { ConfigFields } from "../../interfaces/abstracts/config.interface.js";

export type AConstructor<T extends AMessage> = new (
  fields: MessageProps,
  file_path: string
) => T;

export class AMessages<T extends AMessage = AMessage> extends AActions<MessageProps, T, AConstructor<T>> {
  constructor(type: AConstructor<T>, config: ConfigFields) {
    super(type, config);
  }

  async has_conditions(message: Message, conditions: Function[] | undefined) {
    let i = 0;

    if (!conditions) return true;
    while (conditions[i]) {
      if (await conditions[i](message)) return true;
      i++;
    }
    return false;
  }


  validChannel(message: Message, action: AAction) {
    if (this.isDM(message.channel) && action.dm) return true;
    if (
      message.guild &&
      (message.guild.id == clappybot.guild_id || action.any_guild)
    )
      return true;
    return false;
  }

  async scan(..._args: unknown[]): Promise<void> {
    console.error("abstract call to scan method");
  }
}

export class AUniqueStateMessages extends AMessages {
  async scan(message: Message) {
    for (let i in this._list) {
      if (
        this._list[i] &&
        message.author &&
        (!message.author.bot || this._list[i].allow_bots) &&
        this.validChannel(message, this._list[i])
      ) {
        if (await this.has_conditions(message, this._list[i].conditions)) {
          this._list[i].parse(message);
        }
      }
    }
  }
}

export class AMessage<T extends ActionProps & { allow_bots?: boolean } = MessageProps> extends AAction {
  allow_bots: boolean;

  constructor(interaction: T, file_path: string) {
    super(interaction, file_path);
    this.allow_bots = interaction.allow_bots || false;
  }
}
