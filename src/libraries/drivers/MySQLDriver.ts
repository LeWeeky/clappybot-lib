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

import mysql from "mysql2";
import ADriver from "./ADriver.js";
import mysql_request from "../sql/mysql/request.js";
import mysql_create_table from "../sql/mysql/create.js";
import mysql_create_column from "../sql/mysql/create_column.js";
import mysql_rename_column from "../sql/mysql/rename_column.js";
import mysql_delete_column from "../sql/mysql/delete_column.js";
import { mysql_insert,  mysql_last_insert_id } from "../sql/mysql/insert.js";
import mysql_update from "../sql/mysql/update.js";
import mysql_select from "../sql/mysql/select.js";
import mysql_delete from "../sql/mysql/delete.js";
import mysql_exists from "../sql/mysql/exists.js";
import mysql_count from "../sql/mysql/count.js";
import type { DRIVER_FIELDS } from "../../types/database.types.js";

export default class MySQLDriver extends ADriver {
  static _create: typeof mysql.createConnection = mysql.createConnection;

  constructor(parameters: {
    host: string;
    user: string;
    password: string;
    database: string;
    supportBigNumbers?: boolean;
    bigNumberStrings?: boolean;
  }) {
    super(parameters);
  }

  break() {
    super.break();
    if (!this._locks && this._connection) {
      setTimeout(() => {
        if (!this._locks && this._connection) {
          this._connection.end();
          this._connection = null;
        }
      }, 1000);
    }
  }

  destroy() {
    if (this._connection) this._connection.end();
  }

  /**
   * Returns query for auto increment
   * premary key
   */
  getAutoIncrementQuery(): "id INT AUTO_INCREMENT PRIMARY KEY" {
    return "id INT AUTO_INCREMENT PRIMARY KEY";
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
        return "UNSIGNED INT";
      case "bigint":
        return "UNSIGNED BIGINT";
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
        console.warn(`MySQLDriver: Unhandled field type: ${friendlyType}`);
        return friendlyType;
    }
  }

  async request(request: string, data: any[] | null = null): Promise<any> {
    const row = await mysql_request(this.connect(), request, data);
    this.break();
    return row;
  }

  async create(table: string, element: string, more: string | null = null) {
    await mysql_create_table(this.connect(), table, element, more);
    this.break();
  }

  async createColumn(table: string, column: string, type: DRIVER_FIELDS) {
    await mysql_create_column(this.connect(), table, column, MySQLDriver.getQueryType(type));
    this.break();
  }

  async renameColumn(table: string, old_name: string, new_name: string) {
    await mysql_rename_column(this.connect(), table, old_name, new_name);
    this.break();
  }

  async deleteColumn(table: string, column: string) {
    await mysql_delete_column(this.connect(), table, column);
    this.break();
  }

  async insert(table: string, element: string, data: any[], get_last_id: boolean = true): Promise<number> {
    let last_id = 0;
    const connect = this.connect();
    await mysql_insert(connect, table, element, data);
    if (get_last_id) last_id = await mysql_last_insert_id(connect);
    this.break();
    return last_id;
  }

  async update(table: string, element: string, where: string, data: any[] | null = null) {
    await mysql_update(this.connect(), table, element, where, data);
    this.break();
  }

  async select(table: string, element: string, where: string | null = null, data: any[] | null = null, limit: number = 0) {
    const row = await mysql_select(
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
    await mysql_delete(this.connect(), table, where, data);
    this.break();
  }

  async exists(table: string, where: string, data: any[] | null = null) {
    const result = await mysql_exists(this.connect(), table, where, data);
    this.break();
    return result;
  }

  async count(table: string, where: string | null = null, data: any[] | null = null): Promise<number> {
    const result = await mysql_count(this.connect(), table, where, data);
    this.break();
    return result;
  }
}
