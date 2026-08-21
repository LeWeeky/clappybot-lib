import AModel from "../libraries/models/AModel.js";
import type { DRIVER_FIELDS } from "../types/database.types.js";

export default class RebootMessage extends AModel {
  declare guild_id: string | null;
  declare channel_id: string | null;
  declare message: string | null;

  static table = "reboot_messages";

  static fields = {
    guild_id: "string",
    channel_id: "string",
    message: "string",
  } satisfies Record<string, DRIVER_FIELDS>;
}
