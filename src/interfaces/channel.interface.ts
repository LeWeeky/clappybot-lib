import type { GuildChannel } from "discord.js"

export interface ChannelProps {
   conditions?: Function[],
   dm?: boolean,
   any_guild?: boolean,
   parse: (channel: GuildChannel) => Promise<void>
}

export interface ChannelUpdateProps {
   conditions?: Function[],
   dm?: boolean,
   any_guild?: boolean,
   parse: (old_channel: GuildChannel, new_channel: GuildChannel) => Promise<void>
}
