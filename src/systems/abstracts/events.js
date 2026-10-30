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
 * @template {Object} P
 * @template {AEvent} T
 * @typedef {new (fields: P, file_path: string) => T} AConstructor
 */

/**
 * @template {Object} P
 * @template {AEvent} T
 * @template {AConstructor<P, T>} C
 * @extends {AFunctionalities<T, C>}
 */
export class AEvents extends AFunctionalities {
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
   * @param  {...unknown} _args
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
   * @type {(...args: any[]) => Promise<void>}
   */
  parse;

  /**
   *
   * @param {{
   *	any_guild: boolean | undefined , parse: (...args: any[]) => Promise<void>
   * }} fields Action methods and parameters
   * @param {string} file_path
   */
  constructor(fields, file_path) {
    super(file_path);
    this.parse = fields.parse;
    this.any_guild = fields.any_guild;
  }
}
