/**
 * ClappyBot - A powerful framework for bot developers
 * Copyright (C) 2026 LeWeeky
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
import type ADriver from "../libraries/drivers/ADriver.js";
import type AModel from "../libraries/drivers/AModel.js";
import BuiltInModels from "../models/index.js";
import { importFile } from "../libraries/import_file.js";

export default class Models {
  _database: ADriver;
  _list: typeof AModel[];

  constructor(database: ADriver) {
    this._list = [];
    this._database = database;
  }

  async #load_dir(path: string) {
    for (const file of readdirSync(path)) {
      if (file.endsWith(".js") || file.endsWith(".ts")) {
        const file_path = `${path}/${file}`;
        const model = await importFile(file_path);
        this._list.push(model);
      }
    }
  }

  loadBuiltIn() {
    this._list.push(...BuiltInModels);
  }

  /**
   * Load all model files from every module's models directory
   */
  async load() {
    this.loadBuiltIn();
    for (const module of readdirSync("./sources/modules")) {
      if (
        !module.startsWith(".") &&
        statSync(`./sources/modules/${module}`).isDirectory()
      ) {
        for (const file of readdirSync(`./sources/modules/${module}`)) {
          if (file == "models") {
            this.#load_dir(`${process.cwd()}/sources/modules/${module}/models`);
          }
        }
      }
    }
    this.loadBuiltIn();
    console.log(
      `${this._list.length} "Model" ${this._list.length === 1 ? "has" : "have"} been loaded.`,
    );
  }

  async init() {
    await Promise.all(
      this._list.map((model) => {
        model.use(this._database);
        return model.init();
      }),
    );
  }
}
