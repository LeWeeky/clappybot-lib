import type { VoiceState } from "discord.js";

export interface VoiceStateProps {
    conditions?: Function[];
    dm?: boolean;
    any_guild?: boolean;
    parse: (old_state: VoiceState, new_state: VoiceState) => Promise<void>
}