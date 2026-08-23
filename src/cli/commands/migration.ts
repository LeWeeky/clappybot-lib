import { Command } from "commander";
import chalk from "chalk";
import fs from "node:fs";
import path from "node:path";

const validateTargetName = (name) => {
  const trimmed = name.trim().toLowerCase();
  const regex = /^[a-z]+$/;

  if (!trimmed) {
    console.error(chalk.red("Target name cannot be empty."));
    process.exit(1);
  }

  if (trimmed.length > 100) {
    console.error(chalk.red("Target name is too long."));
    process.exit(1);
  }

  if (!regex.test(trimmed)) {
    console.error(chalk.red("Target name can only contain letters."));
    process.exit(1);
  }

  return trimmed;
};

/**
 * Validates a migration name
 * @param {string} name 
 * @returns {string} 
 */
const validateMigrationName = (name) => {
  const trimmed = name.trim();

  if (!trimmed) {
    console.error(chalk.red("Migration name cannot be empty."));
    process.exit(1);
  }

  if (trimmed.length > 100) {
    console.error(chalk.red("Migration name is too long."));
    process.exit(1);
  }

  if (trimmed.includes("/") || trimmed.includes("\\")) {
    console.error(chalk.red("Migration name cannot contain path separators."));
    process.exit(1);
  }

  if (trimmed.includes("..")) {
    console.error(chalk.red("Migration name cannot contain '..'."));
    process.exit(1);
  }

  if (!/^[a-zA-Z0-9 _-]+$/.test(trimmed)) {
    console.error(chalk.red("Migration name can only contain letters, numbers, spaces, underscores, and hyphens."));
    process.exit(1);
  }

  return trimmed;
};

/**
 * Converts a string to PascalCase
 * @param {string} value 
 * @returns {string} 
 */
const toPascalCase = (value) => {
  return value
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[a-z]/, (char) => char.toUpperCase());
};

const toSnakeCase = (value: string): string => {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
};

export const migrationCommand = new Command()
  .name("migration")
  .description("Create a new database migration")
  .argument("<target>", "Module of functionnality name")
  .argument("<name>", "Name of the migration")
  .action((target, name) => {
    const validatedTarget = validateTargetName(target);
    const validatedName = validateMigrationName(name);
    const className = toPascalCase(validatedName);
    const timestamp = Date.now();

    const content = `import { AMigration } from "clappybot/database";

export default class ${className} extends AMigration {
  static target = "${validatedTarget}";

  static async up() {
    // Write your migration here
  }

  static async down() {
    // Write your rollback here (optional but recommended)
  }
}
`;

    const directory = path.resolve("migrations");
    const filename = `${timestamp}_${toSnakeCase(className)}.js`;
    const filepath = path.join(directory, filename);

    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(filepath, content, "utf8");

    console.log(chalk.green(`Created migration: ${filename}`));
  });
