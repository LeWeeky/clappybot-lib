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

import pg from "pg";
import ADriver from "./ADriver.js";
import postgresql_request from "../sql/postgresql/request.js";
import postgresql_create_table from "../sql/postgresql/create.js";
import postgresql_create_column from "../sql/postgresql/create_column.js";
import postgresql_rename_column from "../sql/postgresql/rename_column.js";
import postgresql_delete_column from "../sql/postgresql/delete_column.js";
import postgresql_insert from "../sql/postgresql/insert.js";
import postgresql_update from "../sql/postgresql/update.js";
import postgresql_select from "../sql/postgresql/select.js";
import postgresql_delete from "../sql/postgresql/delete.js";
import postgresql_exists from "../sql/postgresql/exists.js";
import postgresql_count from "../sql/postgresql/count.js";
import type { DRIVER_FIELDS } from "../../types/database.types.js";

export default class PostgreSQLDriver extends ADriver {
  static _create = (parameters: {
    host: string;
    user: string;
    password: string;
    database: string;
  }) => new pg.Pool({ ...parameters, max: 10 });

  constructor(parameters: {
    host: string;
    user: string;
    password: string;
    database: string;
  }) {
    super(parameters);
  }

  connect() {
    super.connect();
    if (
      this._connection &&
      !this._connection._connecting &&
      !this._connection._connected
    )
      void this._connection.connect().catch((error) => {
        if (process.env.DEBUG_ERROR != "false") {
          console.error(
            "\x1b[31m%s\x1b[0m",
            `❌ Erreur : connexion PostgreSQL`,
          );
          console.error(error);
        }
      });
    return this._connection;
  }

  break() {
    super.break();
    if (!this._locks && this._connection) {
      this._connection.end();
      this._connection = null;
    }
  }

  destroy() {
    if (this._connection) this._connection.end();
  }

  /**
   * Returns query for auto increment primary key
   */
  getAutoIncrementQuery(): string {
    return "id SERIAL PRIMARY KEY";
  }

  /**
   * Replaces the "friendly type" with the type in PostgreSQL
   */
  static toQueryType(field: string, fields: { [key: string]: DRIVER_FIELDS }) {
    let type: string;

    switch (fields[field]) {
      case "integer":
        type = "INTEGER DEFAULT 0";
        break;
      case "size":
        type = "UNSIGNED INT";
        break;
      case "bigint":
        type = "BIGINT";
        break;
      case "datetime":
        type = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
        break;
      case "string":
        type = "VARCHAR(255)";
        break;
      case "text":
        type = "TEXT";
        break;
      case "boolean":
        type = "BOOLEAN";
        break;
      case "timestamp":
        type = "VARCHAR(20)";
        break;
      default:
        type = fields[field];
        break;
    }
    return `${field} ${type}`;
  }

  async request(request: string, data: any[] | null = null) {
    const row = await postgresql_request(this.connect(), request, data);
    this.break();
    return row;
  }

  async create(table: string, element: string, more: string | null = null) {
    await postgresql_create_table(this.connect(), table, element, more);
    this.break();
  }

  async createColumn(table: string, column: string, type: string) {
    await postgresql_create_column(this.connect(), table, column, type);
    this.break();
  }

  async renameColumn(table: string, old_name: string, new_name: string) {
    await postgresql_rename_column(this.connect(), table, old_name, new_name);
    this.break();
  }

  async deleteColumn(table: string, column: string) {
    await postgresql_delete_column(this.connect(), table, column);
    this.break();
  }

  /**
   * _get_last_id is just declared to be compatible with MySQL driver
   */
  async insert(table: string, element: string, data: any[], _get_last_id: boolean = true): Promise<number> {
    const connect = this.connect();
    const last_id = await postgresql_insert(connect, table, element, data);
    this.break();
    return last_id || 0;
  }

  async update(table: string, element: string, where: string, data: any[] | null = null) {
    await postgresql_update(this.connect(), table, element, where, data);
    this.break();
  }

  async select(table: string, element: string, where: string | null = null, data: any[] | null = null, limit: number = 0) {
    const row = await postgresql_select(
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
    await postgresql_delete(this.connect(), table, where, data);
    this.break();
  }

  async exists(table: string, where: string, data: any[] | null = null) {
    const result = await postgresql_exists(this.connect(), table, where, data);
    this.break();
    return result;
  }

  async count(table: string, where: string | null = null, data: any[] | null = null) {
    const result = await postgresql_count(this.connect(), table, where, data);
    this.break();
    return result;
  }
}
