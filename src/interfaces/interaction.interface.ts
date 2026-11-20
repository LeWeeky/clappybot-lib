import type { Interaction } from "discord.js";

export interface InteractionWithCustomIdProps<T extends Interaction> {
    customId: string,
    permissions?: Function[],
    dm?: boolean
    any_guild?: boolean,
    parse: (interaction: T) => Promise<void>
}

export interface InteractionWithConditionsProps<T extends Interaction> {
    conditions: Function[],
    permissions?: Function[],
    dm?: boolean
    any_guild?: boolean,
    parse: (interaction: T) => Promise<void>
}

export type InteractionProps<T extends Interaction> = InteractionWithCustomIdProps<T> | InteractionWithConditionsProps<T>;
