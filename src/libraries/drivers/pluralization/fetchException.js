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

import exceptions from "./exceptions.json" with { type: "json" };

/**
 *
 * @param {string} target
 * @param {"plural" | "singular"} type
 * @returns {string | null}
 */
export default function fetchException(target, type) {
  let target_index = 0;
  let reply_index = 1;
  if (type == "singular") {
    target_index = 1;
    reply_index = 0;
  }

  for (let i = 0; i < exceptions.length; i++) {
    if (exceptions[i][target_index] == target)
      return exceptions[i][reply_index];
  }
  return null;
}
