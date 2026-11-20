import type { ChatInputCommandInteraction, Message, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export interface CommandGuildOnlyProps {
    name: string,
    alias?: string[],
    builder?: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder,
    permissions?: Function[],
    dm?: false,
    any_guild?: boolean,
    parse: (interaction: ChatInputCommandInteraction<"cached"> | Message<true>, command_name: string, args: string[]) => Promise<void>,
}

export interface CommandGuildOptionalProps {
    name: string,
    alias?: string[],
    builder?: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder,
    permissions?: Function[],
    dm: true,
    any_guild?: boolean,
    parse: (interaction: ChatInputCommandInteraction | Message, command_name: string, args: string[]) => Promise<void>,
}

export type CommandProps = CommandGuildOptionalProps | CommandGuildOnlyProps;
