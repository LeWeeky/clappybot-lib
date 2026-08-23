import { existsSync, readdirSync, statSync } from "fs";
import MigrationsTable from "../models/Migrations.js";
import type ADriver from "../libraries/drivers/ADriver.js";
import AMigration from "../libraries/drivers/AMigration.js";
import chalk from "chalk";

export default class Migrations {
  _migrations: {
    [key: string]: { version: string; migration: typeof AMigration }[];
  } = {};
  _database: ADriver;

  constructor(database: ADriver) {
    this._migrations = {};
    this._database = database;
  }

  /**
   * Load all migration files from the migrations directory
   */
  async load(): Promise<number> {
    if (
      !existsSync("./migrations") ||
      !statSync("./migrations").isDirectory()
    ) {
      console.log(
        `${0} "Migration" has been loaded (./migrations folder doesn't exist).`,
      );
      return 0;
    }
    let count = 0;
    for (const migration_file of readdirSync("./migrations").sort()) {
      if (
        !migration_file.startsWith(".") &&
        statSync(`./migrations/${migration_file}`).isFile()
      ) {
        const file_path = `${process.cwd()}/migrations/${migration_file}`;
        const version = migration_file.split("_")[0];
        const migration = (await import(file_path))
          .default as typeof AMigration;

        if (!this._migrations[migration.target])
          this._migrations[migration.target] = [];
        this._migrations[migration.target].push({ version, migration });
        count++;
      }
    }
    console.log(
      `${count} "Migration" ${count === 1 ? "has" : "have"} been loaded.`,
    );
    return count;
  }

  async checkup() {
    let found = false;
    console.log("Checking for pending migrations...");
    MigrationsTable.use(this._database);
    const last_migrations = await MigrationsTable.all();

    for (const [target, migrations] of Object.entries(this._migrations)) {
      const newest_migration = migrations[migrations.length - 1];
      const last_migration = last_migrations.find((m) => m.target === target);

      if (!last_migration) {
        this._warn(target);
        found = true;
        continue;
      }
      if (
        newest_migration.version > last_migration.version
      ) {
        this._warn(target);
        found = true;
        continue;
      }
    }
    return found;
  }

  async up() {
    MigrationsTable.use(this._database);
    AMigration.use(this._database);

    let found: boolean = false;
    for (const [target, migrations] of Object.entries(this._migrations)) {
      console.log(`Processing migrations for target: ${target}`);
      let last_migration = await MigrationsTable.firstBy({ target });
      for (const { version, migration } of migrations) {
        if (!last_migration || version > last_migration.version) {
          console.log(
            `Applying migration ${version} ${migration.name} for target ${target}`,
          );
          await migration.up();
          if (!last_migration)
            last_migration = await MigrationsTable.create({ target, version });
          else {
            last_migration.version = version;
            await last_migration.save();
          }
          console.log(
            `Migration ${version} ${migration.name} for target ${target} has been applied.`,
          );
          found = true;
        }
      }
    }
    return found;
  }

  async down(target: string, steps: number): Promise<number> {
    if (!this._migrations[target]) return 0;
    MigrationsTable.use(this._database);
    AMigration.use(this._database);
    let count = 0;
    const last_migration = await MigrationsTable.firstBy({ target });
    if (!last_migration || last_migration.version === "0") return count;

    for (let i = this._migrations[target].length - 1; i >= 0; i--) {
      const migration = this._migrations[target][i];

      if (migration.version <= last_migration.version) {
        await migration.migration.down();
        console.log(
          `Migration ${migration.version} ${migration.migration.name} for target ${target} has been rolled back.`,
        );
        count++;
        steps--;
        if (steps <= 0) {
          if (i == 0) last_migration.version = "0";
          else last_migration.version = this._migrations[target][i - 1].version;
          await last_migration.save();
          break;
        } else {
          last_migration.version = migration.version;
        }
      }
    }
    return count;
  }

  private _warn(target: string) {
    console.warn(
      chalk.yellow (
      `You have pending migrations for target ${target}`,
    ));
  }
}
