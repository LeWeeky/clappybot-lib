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

import { readdirSync, existsSync, statSync } from "fs";
import { ChannelType, ChatInputCommandInteraction, Message, type Channel } from "discord.js";
import SlashCommands from "./interactions/slashCmd.js";
import { AAction, AActions } from "./abstracts/actions.js";
import { importFile } from "../libraries/import_file.js";
import { clappybot } from "../main.js";
import type { CommandProps } from "../interfaces/command.interface.js";

const config = {
  title: "commands",
  descriptior: undefined,
  direct_names: ["command", "cmd"],
  shared_folder: false,
  extension: "cmd.js",
  folder: "commands",
  addons: "commands",
};

export class Commands extends AActions<CommandProps, Command, typeof Command> {
  commands_builder: SlashCommands;

  constructor() {
    super(Command, config);
    this.commands_builder = new SlashCommands();
  }

  add(command: Command, file_path: string) {
    // Maybe not needed anymore as know props are checked by buildCommand
    if (command.name) super.add(command, file_path);
  }

  async has_permissions(interaction: Message | ChatInputCommandInteraction, permissions: Function[] | undefined) {
    let i = 0;

    if (!permissions || permissions.length == 0) return true;
    while (permissions[i]) {
      if (await permissions[i](interaction.member)) return true;
      i++;
    }
    return false;
  }

  async #load_dir(path: string) {
    for (const file_name of readdirSync(path)) {
      if (file_name.endsWith(".js")) {
        const file_path = `${path}/${file_name}`;
        const file = await importFile(file_path);
        const command = file.default ? file.default : file;

        if (command.parse) {
          this.add(command, file_path);
          this.commands_builder.add(command);
        } else console.warn(file_path, "method parse is missing");
      }
    }
  }

  /**
   * Historically useful in the legacy version
   * @deprecated
   * 
   */
  async load_addon() {
    if (existsSync(`./add-on/${config.addons}`)) {
      for (const module of readdirSync(`./add-on/${config.addons}`)) {
        if (module.endsWith(config.extension)) {
          const file_path = `${process.cwd()}/add-on/${config.addons}/${module}`;
          const command = await importFile(file_path);
          if (command.parse) {
            this.add(command, file_path);
            this.commands_builder.add(command);
          } else console.warn(file_path, "method parse is missing");
        } else if (
          statSync(`./add-on/${config.addons}/${module}`).isDirectory()
        ) {
          for (const file of readdirSync(
            `./add-on/${config.addons}/${module}`,
          )) {
            if (file.endsWith(config.extension)) {
              const file_path = `${process.cwd()}/add-on/${config.addons}/${module}/${file}`;
              const command = await importFile(file_path);
              if (command.parse) {
                this.add(command, file_path);
                this.commands_builder.add(command);
              } else console.warn(file_path, "method parse is missing");
            }
          }
        }
      }
    }
  }

  async load() {
    for (const module of readdirSync("./sources/modules")) {
      if (
        !module.startsWith(".") &&
        statSync(`./sources/modules/${module}`).isDirectory()
      ) {
        for (const file_name of readdirSync(`./sources/modules/${module}`)) {
          if (file_name == config.folder) {
            await this.#load_dir(
              `${process.cwd()}/sources/modules/${module}/${config.folder}`,
            );
          } else if (
            file_name.endsWith(config.extension) ||
            this.isDirectFile(file_name)
          ) {
            const file_path = `${process.cwd()}/sources/modules/${module}/${file_name}`;
            const file = await importFile(file_path);
            const command = file.default ? file.default : file;

            if (command.parse) {
              this.add(command, file_path);
              this.commands_builder.add(command);
            } else console.warn(file_path, "method parse is missing");
          }
        }
      }
    }
    await this.load_addon();
    console.log(`${this._list.length} commands have been loaded.`);
  }

  async reload() {
    this.commands_builder.destroy();
    this.destroy();
    await this.load();
  }

  #isDM(channel: Channel | null) {
    if (!channel) return false;
    return (
      channel.type == ChannelType.DM || channel.type == ChannelType.GroupDM
    );
  }

  #isValidExecutor(interaction: Message | ChatInputCommandInteraction) {
    return (
      "user" in interaction ?
        !interaction.user.bot :
        !interaction.author.bot
    )
  }

  #isChatInputInteraction(interaction: Message | ChatInputCommandInteraction) {
    return "commandType" in interaction;
  }

  /**
   * Reply safely for both Message and ChatInputCommandInteraction.
   */
  #reply(interaction: Message | ChatInputCommandInteraction, content: string, ephemeral: boolean = false) {
    if (this.#isChatInputInteraction(interaction)) {
      const interaction_reply = /** @type {any} */ (
        interaction.reply.bind(interaction)
      );
      return interaction_reply(
        ephemeral ? { content, ephemeral: true } : { content },
      );
    }

    return interaction.reply(content);
  }

  validCommandChannel(interaction: Message | ChatInputCommandInteraction, cmd: Command, replyied: {res: boolean}) {
    if (this.#isDM(interaction.channel)) {
      if (cmd.dm) return true;
      replyied.res = true;

      this.#reply(
        interaction,
        `Sorry but, this command is not available in private messages.`,
        true,
      );
      return false;
    }
    if (
      (interaction.guild && interaction.guild.id == clappybot.guild_id) ||
      cmd.any_guild
    )
      return true;
    return false;
  }

  async scan(interaction: Message | ChatInputCommandInteraction, command_name: string, args: string[]) {
    const replyied = { res: false };

    for (let i in this._list) {
      if (
        (this._list[i].name == command_name || this._list[i].alias.includes(command_name)) &&
        this.#isValidExecutor(interaction) &&
        this.validCommandChannel(interaction, this._list[i], replyied)
      ) {
        if (replyied.res) break;
        if (await this.has_permissions(interaction, this._list[i].permissions))
          this._list[i].parse(interaction, command_name, args);
        else
          this.#reply(
            interaction,
            `Sorry but, you don't have the required permissions to perform this command.`,
          );
        return true;
      }
    }
    return replyied.res;
  }
}

export class Command extends AAction {
  name: string;
  alias: string[] = [];
  permissions?: Function[];

  constructor(command: CommandProps, file_path: string) {
    super(command, file_path);
    this.name = command.name;
    if (command.alias) this.alias = command.alias;
    this.permissions = command.permissions;
    this.dm = command.dm;
    this.any_guild = command.any_guild;
  }
}
