import type { GuildMember } from "discord.js"

export interface MemberProps {
    conditions?: Function[],
    dm?: boolean,
    any_guild?: boolean,
    allow_bots?: boolean,
    parse: (member: GuildMember) => Promise<void>
}

export interface MemberUpdateProps {
    conditions?: Function[],
    dm?: boolean,
    any_guild?: boolean,
    allow_bots?: boolean,
    parse: (old_member: GuildMember, new_member: GuildMember) => Promise<void>
}
