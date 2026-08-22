import AModel from "../libraries/drivers/AModel.js";
import type { DRIVER_FIELDS } from "../types/database.types.js";

export default class Config extends AModel {
  declare guild_id: string | null;
  declare prefix: string | null;
  declare activity: number | null;
  declare status: string | null;
  declare twitch: string | null;
  declare created_at: Date | null;

  static table = "configs";
  static fields = {
    guild_id: "string",
    prefix: "string",
    activity: "integer",
    status: "string",
    twitch: "string",
    created_at: "datetime",
  } satisfies Record<string, DRIVER_FIELDS>;
}
