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
import { ChannelType } from "discord.js";
import SlashCommands from "./interactions/slashCmd.js";
import { AAction, AActions } from "./abstracts/actions.js";

const config = {
  title: "commands",
  descriptior: undefined,
  direct_names: ["command", "cmd"],
  shared_folder: false,
  extension: "cmd.js",
  folder: "commands",
  addons: "commands",
};

export class Commands extends AActions {
  /** Donnée de création des slash commandes
   * @type {SlashCommands}
   */
  commands_builder;

  constructor() {
    super(Command, config);
    this.commands_builder = new SlashCommands();
  }

  /**
   *
   * @param {Command} cmd commande à ajouter
   * @param {String} file_path chemin d'accès vers le fichier
   */
  add(cmd, file_path) {
    if (cmd.name) super.add(cmd, file_path);
  }

  /**
   * @param {import('discord.js').Message | import("discord.js").ChatInputCommandInteraction} interaction
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
   *
   * @param {string} path
   */
  async #load_dir(path) {
    for (const file of readdirSync(path)) {
      if (file.endsWith(".js")) {
        const file_path = `${path}/${file}`;
        const command = await import(file_path);
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
          const command = await import(file_path);
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
              const command = await import(file_path);
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
        for (const file of readdirSync(`./sources/modules/${module}`)) {
          if (file == config.folder) {
            await this.#load_dir(
              `${process.cwd()}/sources/modules/${module}/${config.folder}`,
            );
          } else if (
            file.endsWith(config.extension) ||
            this.isDirectFile(file)
          ) {
            const file_path = `${process.cwd()}/sources/modules/${module}/${file}`;
            const command = await import(file_path);
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

  /**
   *
   * @param {import("discord.js").Channel | null} channel
   * @returns
   */
  #isDM(channel) {
    if (!channel) return false;
    return (
      channel.type == ChannelType.DM || channel.type == ChannelType.GroupDM
    );
  }

  #isValidExecutor(interaction, cmd) {
    return !interaction.bot || cmd.allow_bots;
  }

  /**
   * @param {import('discord.js').Message | import('discord.js').ChatInputCommandInteraction} interaction
   * @returns {interaction is import('discord.js').ChatInputCommandInteraction}
   */
  #isChatInputInteraction(interaction) {
    return "commandType" in interaction;
  }

  /**
   * Reply safely for both Message and ChatInputCommandInteraction.
   *
   * @param {import('discord.js').Message | import('discord.js').ChatInputCommandInteraction} interaction
   * @param {string} content
   * @param {boolean} [ephemeral=false]
   */
  #reply(interaction, content, ephemeral = false) {
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

  /**
   *
   * @param {import('discord.js').Message | import('discord.js').ChatInputCommandInteraction} interaction
   * @param {Command} cmd
   * @param {{res: boolean}} replyied
   * @returns {boolean}
   */
  validCommandChannel(interaction, cmd, replyied) {
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
      (interaction.guild && interaction.guild.id == globalThis.guild_id) ||
      cmd.any_guild
    )
      return true;
    return false;
  }
  /**
   *
   * @param {import('discord.js').Message | import('discord.js').ChatInputCommandInteraction} interaction interaction ou message
   * @param {string} cmd interaction ou format parsé du message
   * @param {string[]} args arguments du message parsé
   * @return {Promise<boolean>}
   */
  async scan(interaction, cmd, args) {
    const replyied = { res: false };

    for (let i in this._list) {
      if (
        this.#isValidExecutor(interaction, cmd) &&
        (this._list[i].name == cmd || this._list[i].alias.includes(cmd)) &&
        this.validCommandChannel(interaction, this._list[i], replyied)
      ) {
        if (replyied.res) break;
        if (await this.has_permissions(interaction, this._list[i].permissions))
          this._list[i].parse(interaction, cmd, args);
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
  /**
   * @type {string}
   */
  name;

  /**
   * @type {string[]}
   */
  alias = [];

  /**
   * @type {Function[] | false | undefined}
   */
  permissions;

  /**
   *
   * @param {{
   * name: string, alias: string[] | undefined, builder: import('discord.js').SlashCommandBuilder | undefined,
   * permissions: Function[] | undefined, dm: boolean | undefined ,
   * any_guild: boolean | undefined, parse: Function, conditions: undefined
   * }} cmd Informations de la nouvelle commande
   * @param {string} file_path
   */
  constructor(cmd, file_path) {
    super(cmd, file_path);
    this.name = cmd.name;
    if (cmd.alias) this.alias = cmd.alias;
    this.permissions = cmd.permissions;
    this.dm = cmd.dm;
    this.any_guild = cmd.any_guild;
  }
}
