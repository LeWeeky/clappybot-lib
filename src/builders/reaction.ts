import type { MessageReaction, User } from 'discord.js';
import { MissingMethod } from './missing_props.js';

interface ReactionWithNameProps {
    name: string,
    id?: string,
    dm?: boolean,
    any_guild?: boolean,
    parse: (reaction: MessageReaction, user: User) => Promise<void>
}

interface ReactionWithConditionsProps {
    conditions: Function[],
    id?: string,
    dm?: boolean,
    any_guild?: boolean,
    parse: (reaction: MessageReaction, user: User) => Promise<void>
}

type ReactionProps = ReactionWithNameProps | ReactionWithConditionsProps;

export function buildReaction(reaction: ReactionProps) {
    if (!(reaction as ReactionWithNameProps).name && !(reaction as ReactionWithConditionsProps).conditions) {
        throw new Error(`Reaction requires either a name or conditions`);
    }
    if (!reaction.parse)
        MissingMethod("Reaction", "parse");
    return (reaction)
}
