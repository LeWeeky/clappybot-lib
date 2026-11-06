

import type { GuildChannel } from 'discord.js';
import { MissingMethod } from './missing_props.js';

interface ChannelProps {
   conditions?: Function[],
   dm?: boolean,
   any_guild?: boolean,
   parse: (channel: GuildChannel) => Promise<void>
}

export function buildChannel(channel: ChannelProps) {
    if (!channel.parse)
        MissingMethod("Channel", "parse");
    return (channel)
}
