import AModel from "../libraries/drivers/AModel.js";
import HistoryPage from "../models/HistoryPage.js";
import type { DRIVER_FIELDS } from "../types/database.types.js";

export default class Member extends AModel {
  declare guild_id: string | null;
  declare user_id: string | null;
  declare mute: boolean | null;

  static table = "members";

  static fields = {
    guild_id: "string",
    user_id: "string",
    mute: "boolean",
  } satisfies Record<string, DRIVER_FIELDS>;

  static has_many: Array<typeof AModel> = [HistoryPage];

  async addToHistory(page: HistoryPage): Promise<void> {
    page.member_id = this.id;
    await page.save();
  }
}
