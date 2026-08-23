import { Command } from "commander";
import chalk from "chalk";
import Migrations from "../../systems/migrations.js";
import Models from "../../systems/models.js";
import dotenv from "dotenv";
import { getMainDatabaseDriver } from "../../libraries/drivers/getDatabaseDriver.js";
import type ADriver from "../../libraries/drivers/ADriver.js";

const getDriver = () => {
  dotenv.config({ path: ".env", override: true });
  return getMainDatabaseDriver();
};

const getModels = async (database: ADriver) => {
  dotenv.config({ path: ".env", override: true });
  const models = new Models(database);
  await models.load();
  return models;
};

const getMigrations = async (database: ADriver) => {
  dotenv.config({ path: ".env", override: true });
  const migrations = new Migrations(database);
  await migrations.load();
  return migrations;
};

export const migrateCommand = new Command()
  .name("migrate")
  .description("Run database migrations")
  .option(
    "-b, --rollback <target>",
    "Rollback the last migration(s) for the specified target",
  )
  .option(
    "-s, --steps <number>",
    "Set the number of steps to rollback (default: 1)",
    "1",
  )
  /**
   * Runs database migrations
   * @param {import("commander").OptionValues} options
   */
  .action(async (options) => {
    if (options.rollback) {
      options.steps = parseInt(options.steps, 10);
      if (isNaN(options.steps) || options.steps < 0) {
        console.error(
          chalk.red(
            "Invalid rollback steps number. It must be a non-negative integer.",
          ),
        );
        process.exit(1);
      }
      console.log(chalk.blue("Cancelling database migrations..."));
      const database = getDriver();
      const migrations = await getMigrations(database);
      const rollbackCount = await migrations.down(options.rollback, options.steps);
      if (rollbackCount > 0) {
        console.log(
          chalk.green(
            `Rolled back ${rollbackCount} migration(s) for target: ${options.rollback}`,
          ),
        );
      } else {
        console.log(
          chalk.yellow(
            `No migrations to rollback for target: ${options.rollback}`,
          ),
        );
      }
      database.destroy();
      return;
    }
    console.log(chalk.blue("Initializing database driver..."));
    const database = getDriver();
    console.log("Initializing database models...");
    const models = await getModels(database);
    await models.init();
    console.log(chalk.blue("Running database migrations..."));
    const migrations = await getMigrations(database);
    if (await migrations.up())
      console.log(chalk.green("Database migrations completed successfully."));
    else
      console.log(chalk.yellow("No new migrations to run."));
    database.destroy();
  });
