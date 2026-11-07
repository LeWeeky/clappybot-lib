/**
 * ClappyBot - A powerful framework for bot developers
 * Copyright (C) 2026 LeWeeky
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { GuildChannel } from 'discord.js';
import { MissingMethod } from './missing_props.js';

interface ChannelProps {
   conditions?: Function[],
   dm?: boolean,
   any_guild?: boolean,
   parse: (channel: GuildChannel) => Promise<void>
}

interface ChannelUpdateProps {
   conditions?: Function[],
   dm?: boolean,
   any_guild?: boolean,
   parse: (old_channel: GuildChannel, new_channel: GuildChannel) => Promise<void>
}

export function buildChannel(channel: ChannelProps | ChannelUpdateProps) {
    if (!channel.parse)
        MissingMethod("Channel", "parse");
    return (channel)
}
