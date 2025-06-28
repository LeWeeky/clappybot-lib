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

const { clappybot } = require("clappybot/dist/main");
const { History } = require("clappybot/dist/libraries/sanctions/history");
const { Member } = require("clappybot/dist/models/Member");

async function is_mute(guild, user_id)
{
	if (guild && guild.members.cache.has(user_id))
	{
		return (guild.members.cache.get(user_id)
			.roles.cache.has(await clappybot.roles.get("mute")));
	}
	const member = await Member.firstBy({user_id: user_id, guild_id: guild.id});
	return (member && member.mute);
}

async function mute_role_exists(guild)
{
	const mute_role_id = await clappybot.roles.get("mute");
	if (mute_role_id)
		return (guild.roles.cache.has(mute_role_id));
	return (false);
}

async function mute(user, reason, guild, author)
{
	const member = await Member.firstByOrCreate({user_id: user.id, guild_id: guild.id});
	member.mute = true;
	await member.save()

	new History(user, guild.id).add("mute", reason, author);

	if (guild.members.cache.has(user.id))
	{
		const mute_role_id = await clappybot.roles.get("mute")
		const member = guild.members.cache.get(user.id);
		const res = await member.roles.add(mute_role_id)
		.then(res => {
				return (true);
		})
		.catch(error => {
			console.log(error)
			console.log("Impossible de mettre le rôle mute /mute")
			return (false);
		})
		return (res)
	}
	return (true);
}

module.exports = { mute, is_mute, mute_role_exists }