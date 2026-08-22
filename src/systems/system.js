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

import fs from "fs";
import ChannelsCreate from "./channels/channelCreate.js";
import ChannelsDelete from "./channels/channelDelete.js";
import ChannelsUpdate from "./channels/channelUpdate.js";
import { Commands } from "./commands.js";
import Initialisers from "./initialiser/initialisers.js";
import { Buttons } from "./interactions/buttons.js";
import { Menus } from "./interactions/menus.js";
import { Modals } from "./interactions/modals.js";
import { MembersAdd } from "./members/memberAdd.js";
import { MembersRemove } from "./members/memberRemove.js";
import { MembersUpdate } from "./members/memberUpdate.js";
import { MessagesCreate } from "./messages/create.js";
import { MessagesDelete } from "./messages/delete.js";
import { MessagesUpdate } from "./messages/update.js";
import { PresencesUpdate } from "./presenceUpdate.js";
import { ReactionsAdd } from "./reactions/add.js";
import { ReactionsRemove } from "./reactions/remove.js";
import { Tasks } from "./tasks.js";
import VoicesStateUpdate from "./voicesStateUpdate.js";

export class System {
  /**
   * @type {Initialisers}
   */
  initialisers;

  /**
   * @type {Commands}
   */
  commands;

  /**
   * @type {MessagesCreate}
   */
  messageCreate;

  /**
   * @type {MessagesDelete}
   */
  messageDelete;

  /**
   * @type {MessagesUpdate}
   */
  messageUpdate;

  /**
   * @type {Buttons}
   */
  buttons;

  /**
   * @type {Modals}
   */
  modals;

  /**
   * @type {Menus}
   */
  menus;

  /**
   * @type {ReactionsAdd}
   */
  reactions_add;

  /**
   * @type {ReactionsRemove}
   */
  reactions_remove;

  /**
   * @type {MembersUpdate}
   */
  members_update;

  /**
   * @type {MembersAdd}
   */
  members_add;

  /**
   * @type {MembersRemove}
   */
  members_remove;

  /**
   * @type {Tasks}
   */
  tasks;

  /**
   * @type {PresencesUpdate}
   */
  presencesUpdate;

  /**
   * @type {ChannelsCreate}
   */
  channelsCreate;

  /**
   * @type {ChannelsUpdate}
   */
  channelsUpdate;

  /**
   * @type {ChannelsDelete}
   */
  channelsDelete;

  /**
   * @type {VoicesStateUpdate}
   */
  voicesStateUpdate;

  constructor() {
    this.initialisers = new Initialisers();
    this.commands = new Commands();
    this.messageCreate = new MessagesCreate();
    this.messageDelete = new MessagesDelete();
    this.messageUpdate = new MessagesUpdate();
    this.buttons = new Buttons();
    this.modals = new Modals();
    this.menus = new Menus();
    this.reactions_add = new ReactionsAdd();
    this.reactions_remove = new ReactionsRemove();
    this.members_update = new MembersUpdate();
    this.members_add = new MembersAdd();
    this.members_remove = new MembersRemove();
    this.tasks = new Tasks();
    this.presencesUpdate = new PresencesUpdate();
    this.channelsCreate = new ChannelsCreate();
    this.channelsDelete = new ChannelsDelete();
    this.channelsUpdate = new ChannelsUpdate();
    this.voicesStateUpdate = new VoicesStateUpdate();
  }

  async init() {
    try {
      if (!fs.existsSync("./sources/modules")) {
        console.warn(
          "Directory './sources/modules' does not exist, skipping system initialisation",
        );
        return;
      }

      await this.initialisers.load();
      await this.commands.load();
      await this.messageCreate.load();
      await this.messageDelete.load();
      await this.messageUpdate.load();
      await this.buttons.load();
      await this.modals.load();
      await this.menus.load();
      await this.reactions_add.load();
      await this.reactions_remove.load();
      await this.members_update.load();
      await this.members_add.load();
      await this.members_remove.load();
      await this.tasks.load();
      await this.presencesUpdate.load();
      await this.channelsCreate.load();
      await this.channelsDelete.load();
      await this.channelsUpdate.load();
      await this.voicesStateUpdate.load();
    } catch (error) {
      console.error(error);
    }
  }

  async reload() {
    await this.initialisers.reload();
    await this.commands.reload();
    await this.messageCreate.reload();
    await this.messageDelete.reload();
    await this.messageUpdate.reload();
    await this.buttons.reload();
    await this.modals.reload();
    await this.menus.reload();
    await this.reactions_add.reload();
    await this.reactions_remove.reload();
    await this.members_update.reload();
    await this.members_add.reload();
    await this.members_remove.reload();
    await this.tasks.reload();
    await this.presencesUpdate.reload();
    await this.channelsCreate.reload();
    await this.channelsDelete.reload();
    await this.channelsUpdate.reload();
    await this.voicesStateUpdate.reload();
  }
}

export const system = new System();
