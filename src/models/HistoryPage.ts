import AModel from "../libraries/models/AModel.js";
import type { DRIVER_FIELDS } from "../types/database.types.js";

export default class HistoryPage extends AModel {
  declare sanction: string | null;
  declare author: string | null;
  declare reason: string | null;
  declare member_id: number | null;
  declare created_at: Date | null;

  static table = "histories";

  static fields = {
    sanction: "string",
    author: "string",
    reason: "text",
    member_id: "integer",
    created_at: "datetime",
  } satisfies Record<string, DRIVER_FIELDS>;
}
