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

import fetchException from "./fetchException.js";

/**
 *  Pluralize a singular model name
 * (include basic English rules and few exceptions)
 * @param {string} name
 * @returns {string}
 */
export default function toPluralize(name) {
  const execption = fetchException(name, "plural");

  if (execption) return execption;
  if (name.endsWith("y") && !/[aeiou]y$/i.test(name))
    return name.slice(0, -1) + "ies"; // "Category" -> "Categories"
  if (
    name.endsWith("s") ||
    name.endsWith("x") ||
    name.endsWith("z") ||
    name.endsWith("ch") ||
    name.endsWith("sh")
  ) {
    return name + "es"; // "Box" -> "Boxes"
  }
  return name + "s";
}
