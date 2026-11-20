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
import type { MessageUpdateProps } from "../../interfaces/message.interface.js";
import { AMessages, AMessage } from "../abstracts/messages.js";

const config = {
  title: "messageUpdate",
  descriptior: undefined,
  direct_names: ["messageUpdate", "messagesUpdate"],
  extension: "update.js",
  shared_folder: true,
  folder: "messages",
  addons: "messages/update",
};

export class MessagesUpdate extends AMessages<MessageUpdate> {
  constructor() {
    super(MessageUpdate, config);
  }

  async scan(old_message: Message, new_message: Message) {
    for (let i in this._list) {
      if (
        this._list[i] &&
        (!new_message.author.bot || this._list[i].allow_bots) &&
        this.validChannel(old_message, this._list[i])
      ) {
        if (await this.has_conditions(new_message, this._list[i].conditions)) {
          this._list[i].parse(old_message, new_message);
        }
      }
    }
  }
}

export class MessageUpdate extends AMessage<MessageUpdateProps> {
  constructor(message: MessageUpdateProps, file_path: string) {
    super(message, file_path);
  }
}
