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

import { AFunctionalities, AFunctionality } from "./functionality.js";

/**
 * @template {AEvent} T
 * @template {new (...args: any[]) => T} C
 * @extends {AFunctionalities<T, C>}
 */
export class AEvents extends AFunctionalities {
  /**
   * @typedef {new (...args: any[]) => AFunctionality} AFunctionalityConstructor
   */

  /** Constructor
   *  @param {C} type
   *  @param {{"title": string, "descriptior": string | undefined,
   * 	direct_names?: string[] | undefined, shared_folder?: boolean | undefined,
   * 	"extension": string, "folder": string, "addons": string }} config
   */
  constructor(type, config) {
    super(type, config);
  }

  /**
   *
   * @param  {...any} _args
   * @returns {Promise<boolean | void>}
   */
  async scan(..._args) {
    console.error("abstract call to scan method");
  }
}

export class AEvent extends AFunctionality {
  /**
   * @type {boolean | undefined}
   */
  any_guild;

  /**
   * @type {Function}
   */
  parse;

  /**
   *
   * @param {{
   *	any_guild: boolean | undefined , parse: Function
   * }} origin Données / paramètres de l'action
   * @param {string} file_path
   */
  constructor(origin, file_path) {
    super(file_path);
    this.parse = origin.parse;
    this.any_guild = origin.any_guild;
  }
}
