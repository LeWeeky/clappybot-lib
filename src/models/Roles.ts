import AModel from "../libraries/models/AModel.js";
import type { DRIVER_FIELDS } from "../types/database.types.js";

export default class Roles extends AModel {
  declare guild_id: string | null;
  declare name: string | null;
  declare role_id: string | null;



  static table = "roles";
  static fields = {
    guild_id: "string",
    name: "string",
    role_id: "string",
  } satisfies Record<string, DRIVER_FIELDS>;
}
