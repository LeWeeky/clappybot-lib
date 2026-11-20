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

import type { VoiceState } from "discord.js";
import type { VoiceStateProps } from "../interfaces/voice_state.interface.js";
import { clappybot } from "../main.js";
import { AEvents, AEvent } from "./abstracts/events.js";

const config = {
  title: "voiceStateUpdate",
  descriptior: undefined,
  direct_names: ["voiceStateUpdate", "voicesStateUpdate"],
  shared_folder: true,
  extension: "update.js",
  folder: "voices",
  addons: "voices/update",
};

export default class VoicesStateUpdate extends AEvents<VoiceStateProps, VoiceStateUpdate, typeof VoiceStateUpdate> {
  constructor() {
    super(VoiceStateUpdate, config);
  }

  async scan(old_state: VoiceState, new_state: VoiceState) {
    for (let i in this._list) {
      if (
        this._list[i] &&
        (old_state.guild?.id == clappybot.guild_id || this._list[i].any_guild)
      ) {
        this._list[i].parse(old_state, new_state);
      }
    }
  }
}

class VoiceStateUpdate extends AEvent {
  constructor(event_handler: VoiceStateProps, file_path: string) {
    super(event_handler, file_path);
  }
}
