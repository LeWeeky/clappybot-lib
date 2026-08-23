import type { DRIVER_FIELDS } from "../../types/database.types.js";
import type ADriver from "./ADriver.js";

export default class AMigration {
  static database: ADriver | null = null;
  /**
   * Set the database driver to be used by the migration class.
   * @param driver
   */
  static use(driver: ADriver) {
    AMigration.database = driver;
  }

  static target = "default";

  static async request(
    request: string,
    data: any[] | null = null,
  ): Promise<any | null> {
    return (AMigration.database as ADriver).request(request, data);
  }

  static async create(table: string, element: string, more: string | null = null) {
    return (AMigration.database as ADriver).create(table, element, more);
  }

  static async addColumn(table: string, column: string, type: DRIVER_FIELDS) {
    (AMigration.database as ADriver).addColumn(table, column, type);
  }

  static async renameColumn(table: string, old_name: string, new_name: string) {
    (AMigration.database as ADriver).renameColumn(table, old_name, new_name);
  }

  static async dropColumn(table: string, column: string) {
    (AMigration.database as ADriver).dropColumn(table, column);
  }

  static async insert(
    table: string,
    element: string,
    data: any[],
    get_last_id: boolean = true,
  ): Promise<number> {
    return (AMigration.database as ADriver).insert(
      table,
      element,
      data,
      get_last_id,
    );
  }

  static async update(
    table: string,
    element: string,
    where: string,
    data: any[] | null = null,
  ) {
    (AMigration.database as ADriver).update(table, element, where, data);
  }

  static async select(
    table: string,
    element: string,
    where: string | null = null,
    data: any[] | null = null,
    limit: number = 0,
  ) {
    return (AMigration.database as ADriver).select(
      table,
      element,
      where,
      data,
      limit,
    );
  }

  static async delete(table: string, where: string, data: any[] | null = null) {
    return (AMigration.database as ADriver).delete(table, where, data);
  }

  async exists(table: string, where: string, data: any[] | null = null) {
    return (AMigration.database as ADriver).exists(table, where, data);
  }

  async count(
    table: string,
    where: string | null = null,
    data: any[] | null = null,
  ): Promise<number> {
    return (AMigration.database as ADriver).count(table, where, data);
  }

  static async up() {
    throw new Error("Migration Error:Method 'up()' must be implemented.");
  }

  static async down() {
    throw new Error("Rollback Error:Method 'down()' must be implemented.");
  }
}
