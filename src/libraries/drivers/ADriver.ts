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

import type { DRIVER_FIELDS } from "../../types/database.types.js";

type DRIVER_METHODS =
  | "connect"
  | "break"
  | "destroy"
  | "getAutoIncrementQuery"
  | "request"
  | "create"
  | "addColumn"
  | "renameColumn"
  | "dropColumn"
  | "insert"
  | "update"
  | "select"
  | "delete"
  | "exists"
  | "count";

export default class ADriver {
  static _create: Function = () => {};

  _locks: number = 0;

  _connection: any | null = null;

  parameters: Object = {};

  constructor(parameters: Object) {
    this.parameters = parameters;
  }

  #throw(method: DRIVER_METHODS): never {
    throw new Error(
      `You must implement the '${method}' method in your subclass.`,
    );
  }

  connect() {
    this._locks++;
    if (!this._connection)
      this._connection = (this.constructor as typeof ADriver)._create(
        this.parameters,
      );
    return this._connection;
  }

  break() {
    if (this._locks) this._locks--;
  }

  /**
   * Destroys the connection to the database
   * and releases any resources associated with it.
   * This method should be called when the database connection is no longer needed.
   */
  destroy() {
    this.#throw("destroy");
  }

  getAutoIncrementQuery() {
    this.#throw("getAutoIncrementQuery");
  }

  /**
   * Replaces the "friendly type" with
   * the type in the SQL server
   */
  static getQueryType(friendlyType: DRIVER_FIELDS): string {
    switch (friendlyType) {
      case "integer":
        return "INT DEFAULT 0";
      case "size": // [ ! ] Not supported by PostgreSQL / SQLite
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

  /**
   * Create the SQL query by replacing the "friendly type"
   * with the type in the SQL server
   */
  static toQuery(field: string, fields: { [key: string]: DRIVER_FIELDS }): string {
    return `${field} ${this.getQueryType(fields[field])}`;
  }

  async request(_request: string, _data: any[] | null = null): Promise<any> {
    this.#throw("request");
  }

  async create(_table: string, _element: string, _more: string | null = null): Promise<void> {
    this.#throw("create");
  }

  async addColumn(
    _table: string,
    _column: string,
    _type: string,
  ): Promise<void> {
    this.#throw("addColumn");
  }

  async renameColumn(
    _table: string,
    _old_name: string,
    _new_name: string,
  ): Promise<void> {
    this.#throw("renameColumn");
  }

  async dropColumn(_table: string, _column: string): Promise<void> {
    this.#throw("dropColumn");
  }

  async insert(
    _table: string,
    _element: string,
    _data: any[],
    _get_last_id = true,
  ): Promise<number> {
    this.#throw("insert");
  }

  async update(
    _table: string,
    _element: string,
    _where: string,
    _data: any[] | null = null,
  ): Promise<void> {
    this.#throw("update");
  }

  async select(
    _table: string,
    _element: string,
    _where: string | null = null,
    _data: any[] | null = null,
    _limit: number = 0,
  ): Promise<any[]> {
    this.#throw("select");
  }

  async delete(
    _table: string,
    _where: string,
    _data: any[] | null = null,
  ): Promise<void> {
    this.#throw("delete");
  }

  async exists(
    _table: string,
    _where: string,
    _data: any[] | null = null,
  ): Promise<boolean> {
    this.#throw("exists");
  }

  async count(
    _table: string,
    _where: string | null = null,
    _data: any[] | null = null,
  ): Promise<number> {
    this.#throw("count");
  }
}
