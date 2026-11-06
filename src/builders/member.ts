import type { GuildMember } from "discord.js";
import { MissingMethod } from "./missing_props.js";

interface MemberProps {
    conditions?: Function[],
    dm?: boolean,
    any_guild?: boolean,
    allow_bots?: true,
    parse: (member: GuildMember) => Promise<void>
}

export function buildMember(member: MemberProps) {
    if (!member.parse)
        MissingMethod("Member", "parse");
    return (member);
}
