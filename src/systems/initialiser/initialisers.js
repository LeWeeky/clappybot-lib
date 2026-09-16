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

import { readdirSync, statSync } from "fs";
import { clappybot } from "../../main.js";
import { importFile } from "../../libraries/import_file.js";

/**
 * @deprecated
 * Will be removed in future versions
 */
export default class Initialisers {
  constructor() {}

  destroy() {}

  async load() {
    const connection = clappybot.database?.connect();
    const list = [];

    for (const module of readdirSync("./sources/modules")) {
      if (
        !module.startsWith(".") &&
        statSync(`./sources/modules/${module}`).isDirectory()
      ) {
        for (const file of readdirSync(`./sources/modules/${module}`)) {
          if (file == "init.js") {
            const file_path = `${process.cwd()}/sources/modules/${module}/${file}`;
            const initialiser = await importFile(
              file_path,
            );
            if (initialiser.init_module)
              list.push(initialiser.init_module(connection));
            else console.warn(file_path, "method init_module is missing");
          }
        }
      }
    }

    for (let i = 0; i < list.length; i++) await list[i];
    clappybot.database?.break();
    console.log(`${list.length} initialisers have been loaded.`);
    if (list.length > 0) {
      console.info(
        "Please note that the initialisers system is deprecated and will be removed in future versions.",
        "Models are now automatically initialised when the bot starts, so you don't need to use this system anymore."
      );
    }
  }

  async reload() {
    await this.load();
  }
}
