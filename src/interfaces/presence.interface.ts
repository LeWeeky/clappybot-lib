import type { Presence } from "discord.js";

export interface PresenceProps {
   conditions?: Function[],
   dm?: boolean,
   any_guild?: boolean,
   allow_bots?: boolean,
   parse: (old_presence: Presence, new_presence: Presence) => Promise<void>
}
