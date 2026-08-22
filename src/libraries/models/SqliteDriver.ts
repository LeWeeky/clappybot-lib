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

import Database from "better-sqlite3";
import ADriver from "./ADriver.js";
import sqlite_request from "../sql/sqlite/request.js";
import sqlite_insert from "../sql/sqlite/insert.js";
import sqlite_update from "../sql/sqlite/update.js";
import sqlite_select from "../sql/sqlite/select.js";
import sqlite_delete from "../sql/sqlite/delete.js";
import sqlite_exists from "../sql/sqlite/exists.js";
import sqlite_count from "../sql/sqlite/count.js";
import sqlite_create_table from "../sql/sqlite/create.js";
import sqlite_create_column from "../sql/sqlite/create_column.js";
import sqlite_rename_column from "../sql/sqlite/rename_column.js";
import sqlite_delete_column from "../sql/sqlite/delete_column.js";
import type { DRIVER_FIELDS } from "../../types/database.types.js";

export default class SqliteDriver extends ADriver {
  static _create: typeof Database = Database;

  constructor(parameters: { path: string }) {
    super(parameters);
    this._connection = (this.constructor as typeof ADriver)._create(
      parameters.path,
    );
  }

  connect() {
    return this._connection;
  }

  break() {}

  destroy() {
    if (this._connection) this._connection.close();
  }

  getAutoIncrementQuery() {
    return "id INTEGER PRIMARY KEY AUTOINCREMENT";
  }

  /**
   * Replaces the "friendly type" with
   * the type in the SQL server
   */
  static getQueryType(friendlyType: DRIVER_FIELDS): string {
    switch (friendlyType) {
      case "integer":
        return "INT DEFAULT 0";
      case "size":
        return "INTEGER";
      case "bigint":
        return "BIGINT";
      case "datetime":
        return "DATETIME DEFAULT CURRENT_TIMESTAMP";
      case "string":
        return "VARCHAR(255)";
      case "text":
        return "TEXT";
      case "boolean":
        return "BOOLEAN";
      case "timestamp":
        return "VARCHAR(20)";
      default:
        console.warn(`SqliteDriver: Unhandled field type: ${friendlyType}`);
        return friendlyType;
    }
  }

  async request(request: string, data: any[] | null = null) {
    const row = await sqlite_request(this.connect(), request, data);
    this.break();
    return row;
  }

  async create(table: string, element: string, more: string | null = null) {
    await sqlite_create_table(this.connect(), table, element, more);
    this.break();
  }

  async createColumn(table: string, column: string, type: DRIVER_FIELDS) {
    await sqlite_create_column(this.connect(), table, column, SqliteDriver.getQueryType(type));
    this.break();
  }

  async renameColumn(table: string, old_name: string, new_name: string) {
    await sqlite_rename_column(this.connect(), table, old_name, new_name);
    this.break();
  }

  async deleteColumn(table: string, column: string) {
    await sqlite_delete_column(this.connect(), table, column);
    this.break();
  }

  /**
   * _get_last_id is just declared to be compatible with MySQL driver
   */
  async insert(
    table: string,
    element: string,
    data: any[],
    _get_last_id: boolean = true,
  ) {
    const connect = this.connect();
    const last_id = await sqlite_insert(connect, table, element, data);
    this.break();
    return last_id;
  }

  async update(table: string, element: string, where: string, data: any[] | null = null) {
    await sqlite_update(this.connect(), table, element, where, data);
    this.break();
  }

  async select(table: string, element: string, where: string | null = null, data: any[] | null = null, limit: number = 0) {
    const row = await sqlite_select(
      this.connect(),
      table,
      element,
      where,
      data,
      limit,
    );
    this.break();
    return row;
  }

  async delete(table: string, where: string, data: any[] | null = null) {
    await sqlite_delete(this.connect(), table, where, data);
    this.break();
  }

  async exists(table: string, where: string, data: any[] | null = null) {
    return await sqlite_exists(this.connect(), table, where, data);
  }

  async count(table: string, where: string | null = null, data: any[] | null = null) {
    return await sqlite_count(this.connect(), table, where, data);
  }
}
