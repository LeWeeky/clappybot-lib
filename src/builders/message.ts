import type { Message } from "discord.js";
import { MissingMethod } from "./missing_props.js";

interface MessageProps {
    conditions?: Function[],
    dm?: boolean,
    any_guild?: boolean,
    allow_bots?: true,
    parse: (message: Message) => Promise<void>
}

export function buildMessage(message: MessageProps) {
    if (!message.parse)
        MissingMethod("Message", "parse");
    return (message);
}
