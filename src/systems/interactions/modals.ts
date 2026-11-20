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

import type { ModalSubmitInteraction } from "discord.js";
import { AInteractions, AInteraction } from "../abstracts/interactions.js";
import type { InteractionProps } from "../../interfaces/interaction.interface.js";

const config = {
  title: "modal",
  descriptior: "ce formulaire",
  extension: "modal.js",
  folder: "modals",
  addons: "interactions/modals",
};

export class Modals extends AInteractions<ModalSubmitInteraction, Modal, typeof Modal> {
  constructor() {
    super(Modal, config);
  }
}

export class Modal extends AInteraction {
  constructor(interaction: InteractionProps<ModalSubmitInteraction>, file_path: string) {
    super(interaction, file_path);
  }
}
