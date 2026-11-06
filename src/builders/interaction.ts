import type { AnySelectMenuInteraction, ButtonInteraction, ChatInputCommandInteraction, Interaction, ModalSubmitInteraction } from 'discord.js';
import { MissingMethod } from './missing_props.js';

interface InteractionWithCustomIdProps<T extends Interaction> {
    customId: string,
	permissions?: Function[],
    dm?: boolean
	any_guild?: boolean,
    parse: (interaction: T) => Promise<void>
}

interface InteractionWithConditionsProps<T extends Interaction> {
    conditions: Function[],
	permissions?: Function[],
    dm?: boolean
	any_guild?: boolean,
    parse: (interaction: T) => Promise<void>
}

export type InteractionProps<T extends Interaction> = InteractionWithCustomIdProps<T> | InteractionWithConditionsProps<T>;

export function buildInteraction<T extends Interaction>(interaction: InteractionProps<T>) {
    if (!(interaction as InteractionWithCustomIdProps<T>).customId
        && !(interaction as InteractionWithConditionsProps<T>).conditions) {
        throw new Error(`Interaction requires either a customId or conditions`);
    }
    if (!interaction.parse)
        MissingMethod("Interaction", "parse");
    return (interaction)
}

export function buildCommandInteraction(interaction: InteractionProps<ChatInputCommandInteraction>) {
    return buildInteraction<ChatInputCommandInteraction>(interaction);
}

export function buildButtonInteraction(interaction: InteractionProps<ButtonInteraction>) {
    return buildInteraction<ButtonInteraction>(interaction);
}

export function buildMenuInteraction(interaction: InteractionProps<AnySelectMenuInteraction>) {
    return buildInteraction<AnySelectMenuInteraction>(interaction);
}

export function buildModalInteraction(interaction: InteractionProps<ModalSubmitInteraction>) {
    return buildInteraction<ModalSubmitInteraction>(interaction);
}