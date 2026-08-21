/**
 * ClappyBot - A powerful framework for bot developers
 * Copyright (C) 2025 LeWeeky
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

// Translate ? placeholders to $1, $2, etc. for PostgreSQL

/**
 *
 * @param {string | null | undefined} sql
 * @returns
 */
export default function prepareQuery(sql) {
  if (!sql) return null;
  let result = "";
  let paramIndex = 0;

  /**
   * @type {string | null}
   */
  let quote = null;
  let lineComment = false;
  let blockComment = false;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const next = sql[i + 1];

    // Inside -- comment
    if (lineComment) {
      result += char;

      if (char === "\n") {
        lineComment = false;
      }

      continue;
    }

    // Inside /* ... */ comment
    if (blockComment) {
      result += char;

      if (char === "*" && next === "/") {
        result += "/";
        i++;
        blockComment = false;
      }

      continue;
    }

    // Inside quoted string / identifier
    if (quote) {
      result += char;

      // Backslash escape
      if (char === "\\" && next !== undefined) {
        result += next;
        i++;
        continue;
      }

      // SQL escaped quote: ''
      if (char === quote && next === quote) {
        result += next;
        i++;
        continue;
      }

      if (char === quote) {
        quote = null;
      }

      continue;
    }

    // Start quote
    if (char === "'" || char === '"' || char === "`") {
      quote = char;
      result += char;
      continue;
    }

    // Start -- comment
    if (char === "-" && next === "-") {
      lineComment = true;
      result += "--";
      i++;
      continue;
    }

    // Start /* comment */
    if (char === "/" && next === "*") {
      blockComment = true;
      result += "/*";
      i++;
      continue;
    }

    // Escaped question mark: \?
    if (char === "\\" && next === "?") {
      result += "?";
      i++;
      continue;
    }

    // Actual parameter
    if (char === "?") {
      result += `$${++paramIndex}`;
      continue;
    }

    result += char;
  }

  return result;
}
