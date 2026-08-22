import AModel from "../libraries/drivers/AModel.js";
import type { DRIVER_FIELDS } from "../types/database.types.js";

export default class Migrations extends AModel {
  declare target: string;
  declare version: string;

  static table = "migrations";
  static fields = {
    target: "string",
    version: "timestamp",
  } satisfies Record<string, DRIVER_FIELDS>;
}
