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
