import type { Message } from "discord.js"
import type { ActionProps } from "./abstracts/action.interface.js"

export interface MessageProps extends ActionProps {
    conditions?: Function[],
    allow_bots?: boolean,
    parse: (message: Message) => Promise<void>
}

export interface MessageUpdateProps extends ActionProps {
    conditions?: Function[],
    allow_bots?: boolean,
    parse: (old_message: Message, new_message: Message) => Promise<void>
}
