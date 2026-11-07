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