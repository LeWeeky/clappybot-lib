#!/usr/bin/env node

import package_json from "../../package.json" with { type: "json" };
import { Command } from "commander";
import { migrateCommand } from "./commands/migrate.js";
import { migrationCommand } from "./commands/migration.js";

const program = new Command();

program
  .name("clappybot")
  .description("ClappyBot CLI tool")
  .version(package_json.version);

program
  .addCommand(migrateCommand)
  .addCommand(migrationCommand);

await program.parseAsync();