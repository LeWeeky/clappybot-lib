/**
 * ClappyBot - A powerful framework for bot developers
 * Copyright (C) 2025-2026 LeWeeky
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

import MySQLDriver from "./MySQLDriver.js";
import PostgreSQLDriver from "./PostgreSQLDriver.js";
import SqliteDriver from "./SqliteDriver.js";

function showMissingParameters() {
  /**
   *
   * @param {string} parameter
   */
  function warn(parameter) {
    console.warn(`${parameter} is missing`);
  }

  if (!process.env.DB_HOST) warn("DB_HOST");
  if (!process.env.DB_USER) warn("DB_USER");
  if (!process.env.DB_PASSWORD) warn("DB_PASSWORD");
  if (!process.env.DB_NAME) warn("DB_NAME");
}

function preventMissingPath() {
  if (!process.env.DB_FOLDER_PATH || process.env.DB_FOLDER_PATH.length == 0)
    process.env.DB_FOLDER_PATH = "./";
  if (!process.env.DB_FOLDER_PATH.endsWith("/"))
    process.env.DB_FOLDER_PATH = process.env.DB_FOLDER_PATH + "/";
}

/**
 * @returns {import("./ADriver.js").default}
 */
export function getMainDatabaseDriver() {
  preventMissingPath();
  switch (process.env.DB_DRIVER) {
    case "mysql":
      if (
        process.env.DB_HOST &&
        process.env.DB_USER &&
        process.env.DB_PASSWORD &&
        process.env.DB_NAME
      ) {
        /**
         * @type {MySQLDriver}
         */
        return new MySQLDriver({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          supportBigNumbers: true,
          bigNumberStrings: true,
        });
      } else {
        console.error("Database: some database parameters are missing");
        showMissingParameters();
        process.exit(78);
      }
      break;

    case "postgres":
      if (
        process.env.DB_HOST &&
        process.env.DB_USER &&
        process.env.DB_PASSWORD &&
        process.env.DB_NAME
      ) {
        return new PostgreSQLDriver({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        });
      } else {
        console.error("Database: some database parameters are missing");
        showMissingParameters();
        process.exit(78);
      }
      break;

    case "sqlite":
      if (process.env.DB_NAME) {
        return new SqliteDriver({
          path: process.env.DB_FOLDER_PATH + process.env.DB_NAME,
        });
      } else {
        console.error("Database: DB_NAME is missing");
        process.exit(78);
      }
      break;

    default:
      if (process.env.DB_DRIVER)
        console.error(
          `${process.env.DB_DRIVER} is not a valid driver for the database!`,
        );
      else console.error("Database: DB_DRIVER not set!");
      process.exit(78);
  }
}

export function getCacheDatabaseDriver() {
  preventMissingPath();
  return new SqliteDriver({
    path: process.env.DB_FOLDER_PATH + "cache.sqlite",
  });
}
