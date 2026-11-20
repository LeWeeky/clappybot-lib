/**
 * ClappyBot - A powerful framework for bot developers
 * Copyright (C) 2019–2025 LeWeeky
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

import type { MessageReaction, User } from "discord.js";
import type { ReactionProps } from "../../interfaces/reaction.interface.js";
import { clappybot } from "../../main.js";
import { AAction, AActions } from "./actions.js";
import type { ConfigFields } from "../../interfaces/abstracts/config.interface.js";

type AConstructor<T extends AReaction> = new (
	fields: ReactionProps,
	file_path: string
) => T;

export class AReactions extends AActions<ReactionProps, AReaction, AConstructor<AReaction>> {
	constructor(config: ConfigFields) {
		super(AReaction, config)
	}

	async has_conditions([reaction, user]: [MessageReaction, User], conditions: Function[] | undefined) {
		let i = 0;

		if (!conditions)
			return (false);
		while (conditions[i]) {
			if (await conditions[i](reaction, user)) return (true);
			i++;
		}
		return (false);
	}

	validChannel(reaction: MessageReaction, action: AAction) {
		if (this.isDM(reaction.message.channel) && action.dm)
			return (true);
		if (reaction.message.guild &&
			(reaction.message.guild.id == clappybot.guild_id
				|| action.any_guild))
			return (true);
		return (false);
	}

	async scan(reaction: MessageReaction, user: User) {
		for (let i in this._list) {
			if (this.validChannel(reaction, this._list[i])) {
				if (!this._list[i].conditions || await this.has_conditions([reaction, user], this._list[i].conditions)) {
					try {
						this._list[i].parse(reaction, user);
					}
					catch (error) {
						console.error(this._list[i], error);
					}
				}
			}
		}
	}
}

export class AReaction extends AAction {
	constructor(interaction: ReactionProps, file_path: string) {
		super(interaction, file_path)
	}
}
