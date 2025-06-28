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

const { HistoryPage } = require("clappybot/dist/models/HistoryPage");
const { Member } = require("clappybot/dist/models/Member");

class History

{
	/**
	 * 
	 * @type {Member} member 
	 */
	member;

    constructor(user, guild_id)
    {
        this.user = user;
		this.guild_id = guild_id;
		Member.firstBy({user_id: this.user.id}).then((member) => this.member = member);
		console.log(this.member)
    }

    async get()
    {
		if (!this.member)
			return ([])
		await this.member.fetchStuff();
		if (!this.member.history)
			return ([])
        return (this.member.history);
    }

    async add(sanction, reason, author)
    {
		if (!this.member)
			this.member = await Member.create({guild_id: this.guild_id, user_id: this.user.id})
        const history = new HistoryPage({
            sanction: sanction,
            author: author.username,
            reason: reason
		});

        this.member.addToHistory(history);
        return (history);
    }
}

module.exports = { History }