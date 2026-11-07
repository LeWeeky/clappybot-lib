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

import type { ChatInputCommandInteraction, Message, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import { MissingField, MissingMethod } from './missing_props.js';

interface CommandGuildOnly {
    name: string,
    alias?: string[],
    builder?: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder,
    permissions?: Function[],
    dm?: false,
    any_guild?: boolean,
    parse: (interaction: ChatInputCommandInteraction<"cached"> | Message<true>, command_name: string, args: string[]) => Promise<void>,
}

interface CommandGuildOptional {
    name: string,
    alias?: string[],
    builder?: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder,
    permissions?: Function[],
    dm: true,
    any_guild?: boolean,
    parse: (interaction: ChatInputCommandInteraction | Message, command_name: string, args: string[]) => Promise<void>,
}

type CommandProps = CommandGuildOptional | CommandGuildOnly;

export function buildCommand(command: CommandProps) {
    if (!command.name)
        MissingField("Command", "name");
    if (!command.parse)
        MissingMethod("Command", "parse");
    return (command)
}
