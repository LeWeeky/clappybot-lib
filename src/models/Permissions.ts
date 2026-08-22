import AModel from "../libraries/drivers/AModel.js";
import PermissionsBits from "../libraries/permissions/bits.js";
import type { DRIVER_FIELDS } from "../types/database.types.js";

export default class APermissions extends AModel {
  declare user_id: string | null;
  declare bits: number | null;

  static fields = {
    user_id: "string",
    bits: "integer",
  } satisfies Record<string, DRIVER_FIELDS>;

  add(permission_bit: number): void {
    this.bits = (this.bits ?? 0) | permission_bit;
  }

  remove(permission_bit: number): void {
    this.bits = (this.bits ?? 0) & ~permission_bit;
  }

  reset(): void {
    this.bits = 0;
  }

  has(permission_bit: number): boolean {
    const bits = this.bits ?? 0;

    return Boolean(bits & PermissionsBits.Owner || bits & permission_bit);
  }

  isAdmin(): boolean {
    return Boolean((this.bits ?? 0) & PermissionsBits.Admin);
  }
}

export class GuildPermissions extends APermissions {
  static table = "guild_permissions";
}

export class GlobalPermissions extends APermissions {
  static table = "global_permissions";
}
