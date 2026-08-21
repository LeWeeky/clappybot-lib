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

import type {
  DATABASE_FIELDS,
  DRIVER_FIELDS,
} from "../../types/database.types.ts";
import type ADriver from "./ADriver.ts";
import toSingularize from "./pluralization/singularize.js";

export default class AModel {
  /**
   * Defines the elements to which this model belongs. This will create
   * new columns to link this model to its owners.
   *
   * For example, if you make this model belong to the ‘authors’ model,
   * an ‘author_id’ column will be created.
   */
  static belongs_to: string[] = [];

  /**
   * Current model may have one of each of these models.
   */
  static has_one: (typeof AModel)[] = [];
  /**
   * Current model may have few of each of these models.
   */
  static has_many: (typeof AModel)[] = [];
  /**
   * Unique id of element
   */
  id: number = 0;
  /**
   * List of columns
   */
  static fields: { [key: string]: DRIVER_FIELDS } = {};
  /**
   * Name of the table inside database
   */
  static table: string = "default";
  /**
   * Name when it's single
   */
  static single: string = "default";

  /**
   * @type {import("./ADriver.js").default | null}
   * Database driver to use
   */
  static db: ADriver | null = null;

  /**
   * Save old values
   */
  #old_values: { [key: string]: DATABASE_FIELDS } = {};

  /**
   * Create new instance of this model
   * but without saving it in the database
   *
   * You can save it using the save method
   */
  constructor(data: { id?: number } & { [key: string]: DATABASE_FIELDS } = {}) {
    if (data.id) this.id = data.id;
    for (let field in (this.constructor as typeof AModel).fields)
      this.#old_values[field] = this[field] = data[field] ?? null;
  }

  /**
   * Defines database to be used
   */
  static use(db: ADriver) {
    this.db = db;
  }

  /**
   * Save current instance in database
   * @returns
   */
  async save() {
    if (!(this.constructor as typeof AModel).db) {
      console.error(
        "db is not set for:",
        (this.constructor as typeof AModel).table,
      );
      return false;
    }
    if (this.id == 0) {
      const fields = Object.keys((this.constructor as typeof AModel).fields);
      const fields_to_insert: string[] = [];
      const values: DATABASE_FIELDS[] = [];
      fields.forEach((field) => {
        if (this[field] !== null) {
          fields_to_insert.push(field);
          values.push(this[field]);
        }
      });
      const placeholders = fields_to_insert.join(", ");
      this.id = await (this.constructor as typeof AModel).db!.insert(
        (this.constructor as typeof AModel).table,
        placeholders,
        values,
      );
    } else {
      const fields = Object.keys((this.constructor as typeof AModel).fields);

      const fields_to_update = fields.filter((field) => {
        if (this[field] != this.#old_values[field]) return field;
      });

      if (fields_to_update.length == 0) return false;
      const values: DATABASE_FIELDS[] = fields_to_update.map(
        (field) => this[field],
      );
      let placeholders: string | null = null;

      fields_to_update.forEach((field) => {
        if (!placeholders) placeholders = `${field} = ?`;
        else placeholders = ` ${placeholders}, ${field} = ?`;
      });

      if (!placeholders) {
        console.warn(
          "No valid fields provided for update call in table:",
          (this.constructor as typeof AModel).table,
        );
        return false;
      }
      values.push(this.id);
      await (this.constructor as typeof AModel).db!.update(
        (this.constructor as typeof AModel).table,
        placeholders,
        "id = ?",
        values,
      );
    }
    for (let field in (this.constructor as typeof AModel).fields)
      this.#old_values[field] = this[field];
    return true;
  }

  /**
   * Recovers all the models it owns
   */
  async fetchStuff() {
    if (this.id) {
      const target = {};
      target[`${(this.constructor as typeof AModel).single}_id`] = this.id;
      // TODO do it with a single request
      for (
        let i = 0;
        i < (this.constructor as typeof AModel).has_one.length;
        i++
      ) {
        this[(this.constructor as typeof AModel).has_one[i].single] = await (
          this.constructor as typeof AModel
        ).has_one[i].firstBy(target);
      }
      for (
        let i = 0;
        i < (this.constructor as typeof AModel).has_many.length;
        i++
      ) {
        this[(this.constructor as typeof AModel).has_many[i].table] = await (
          this.constructor as typeof AModel
        ).has_many[i].findBy(target);
      }
    }
  }

  /**
   * Delete current instance from database
   */
  async delete(): Promise<boolean> {
    if (!(this.constructor as typeof AModel).db) {
      console.error(
        "db is not set for:",
        (this.constructor as typeof AModel).table,
      );
      return false;
    }
    if (this.id) {
      await (this.constructor as typeof AModel).db!.delete(
        (this.constructor as typeof AModel).table,
        "id = ?",
        [this.id],
      );
    }
    return true;
  }

  /**
   * Deletes all elements that corresponding
   * to the requested fields
   */
  static async deleteBy(fields: {
    [key: string]: DATABASE_FIELDS;
  }): Promise<boolean> {
    if (!this.db) {
      console.error("db is not set for:", this.table);
      return false;
    }
    let placeholders: string | null = null;
    const values: DATABASE_FIELDS[] = [];
    for (let field in fields) {
      if (!this.fields[field] && field != "id") {
        console.warn(
          `Field '${field}' doesn't exist in the '${this.table}' table`,
        );
        continue;
      }
      if (!placeholders) placeholders = `${field} = ?`;
      else placeholders = ` ${placeholders} AND ${field} = ?`;
      values.push(fields[field]);
    }

    if (!placeholders) {
      console.warn(
        "No valid fields provided for delete call in table:",
        this.table,
      );
      return false;
    }
    await this.db.delete(this.table, placeholders, values);
    return true;
  }

  /**
   * Create new instance of this model
   * and save it in the database
   */
  static async create<T extends AModel>(
    this: typeof AModel & (new (data?: any) => T),
    data: { [key: string]: DATABASE_FIELDS } = {},
  ): Promise<T> {
    const model = new this(data);
    await model.save();
    return model;
  }

  /**
   * Initialise the model's table,
   * you should
   */
  static async init() {
    if (!this.db) {
      console.error(
        "db is not set for:",
        (this.constructor as typeof AModel).table,
      );
      return false;
    }
    if (!this.table) {
      console.error("table name is not set for:", this);
      return false;
    }
    this.single = toSingularize(this.table);
    for (let i = 0; i < this.belongs_to.length; i++) {
      const id = `${toSingularize(this.belongs_to[i])}_id`;
      this.fields[id] = "integer";
    }
    let query = `${this.db.getAutoIncrementQuery()},\n`;
    let count = 0;
    for (let field in this.fields) {
      if (count != 0) query = query + ", \n";
      query =
        query +
        "  " +
        (this.db.constructor as typeof ADriver).toQueryType(field, this.fields);
      count++;
    }
    await this.db.create(this.table, query);
    return true;
  }

  /**
   * Returns all elements of this table
   * as new instances
   */
  static async all<T extends AModel>(
    this: typeof AModel & (new (data?: any) => T)
  ): Promise<T[]> {
    if (!this.db) {
      console.error("db is not set for:", this.table);
      return [];
    }

    const row = await this.db.select(this.table, "*");
    if (row.length == 0) return [];
    const models: T[] = [];
    for (let i = 0; i < row.length; i++) models.push(new this(row[i]));
    return models;
  }

  /**
   * Returns all elements that corresponding
   * to the requested fields as new instances
   */
  static async findBy<T extends AModel>(
    this: typeof AModel & (new (data?: any) => T),
    fields: { [key: string]: DATABASE_FIELDS },
    limit: number = 0,
  ): Promise<T[]> {
    if (!this.db) {
      console.error("db is not set for:", this.table);
      return [];
    }
    let placeholders: string | null = null;
    const values: DATABASE_FIELDS[] = [];
    for (let field in fields) {
      if (!this.fields[field] && field != "id") {
        console.warn(
          `Field '${field}' doesn't exist in the '${this.table}' table`,
        );
        continue;
      }
      if (!placeholders) placeholders = `${field} = ?`;
      else placeholders = ` ${placeholders} AND ${field} = ?`;
      values.push(fields[field]);
    }
    const row = await this.db.select(
      this.table,
      "*",
      placeholders,
      values,
      limit,
    );
    if (row.length == 0) return [];
    const models: T[] = [];
    for (let i = 0; i < row.length; i++) models.push(new this(row[i]));
    return models;
  }

  /**
   * Returns first element that corresponding
   * to the requested fields as new instance
   */
  static async firstBy<T extends AModel>(
    this: typeof AModel & (new (data?: any) => T),
    fields: {
      [key: string]: DATABASE_FIELDS;
    }
  ): Promise<T | null> {
    const result = await this.findBy(fields, 1);

    if (result.length == 0) return null;
    return result[0];
  }

  /**
   * Returns first element that corresponding
   * to the requested fields as new instance
   * or create a new one if not found
   */
  static async firstByOrCreate<T extends AModel>(
    this: typeof AModel & (new (data?: any) => T),
    fields: {
      [key: string]: DATABASE_FIELDS;
    }
  ): Promise<T> {
    const user = await this.firstBy(fields);

    if (user) return user;
    return await this.create(fields);
  }

  /**
   * Returns first element as new instance
   */
  static async first<T extends AModel>(
    this: typeof AModel & (new (data?: any) => T),
  ): Promise<T | null> {
    if (!this.db) {
      console.error("db is not set for:", this.table);
      return null;
    }
    const row = await this.db.select(this.table, "*", null, null, 1);

    if (row.length == 0) return null;
    return new this(row[0]);
  }

  /**
   * Returns true if an element
   * corresponds to this fields
   */
  static async exists(fields: {
    [key: string]: DATABASE_FIELDS;
  }): Promise<boolean> {
    if (!this.db) {
      console.error("db is not set for:", this.table);
      return false;
    }
    let placeholders: string | null = null;
    const values: DATABASE_FIELDS[] = [];
    for (let field in fields) {
      if (!this.fields[field] && field != "id") {
        console.warn(
          `Field '${field}' doesn't exist in the '${this.table}' table`,
        );
        continue;
      }
      if (!placeholders) placeholders = `${field} = ?`;
      else placeholders = ` ${placeholders} AND ${field} = ?`;
      values.push(fields[field]);
    }
    if (!placeholders) {
      console.warn(
        "No valid fields provided for exists check in table:",
        this.table,
      );
      return false;
    }
    return await this.db.exists(this.table, placeholders, values);
  }

  /**
   * Returns the model fields and values
   * as an object
   */
  toObject(): { [key: string]: DATABASE_FIELDS } {
    const obj = { id: this.id };
    for (const field in AModel.fields) {
      obj[field] = this[field];
    }
    return obj;
  }
}
