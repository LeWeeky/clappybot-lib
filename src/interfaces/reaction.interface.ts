import type { MessageReaction, User } from "discord.js";

export interface ReactionWithNameProps {
    name: string,
    id?: string,
    dm?: boolean,
    any_guild?: boolean,
    allow_bots?: boolean,
    parse: (reaction: MessageReaction, user: User) => Promise<void>
}

export interface ReactionWithConditionsProps {
    conditions: Function[],
    id?: string,
    dm?: boolean,
    any_guild?: boolean,
    allow_bots?: boolean,
    parse: (reaction: MessageReaction, user: User) => Promise<void>
}

export type ReactionProps = ReactionWithNameProps | ReactionWithConditionsProps;
