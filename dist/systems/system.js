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

const { ChannelsCreate } = require("clappybot/dist/systems/channels/channelCreate");
const { ChannelsDelete } = require("clappybot/dist/systems/channels/channelDelete");
const { ChannelsUpdate } = require("clappybot/dist/systems/channels/channelUpdate");
const { Commands } = require("clappybot/dist/systems/commands");
const { Initialisers } = require("clappybot/dist/systems/initialiser/initialisers");
const { Buttons } = require("clappybot/dist/systems/interactions/buttons");
const { Menus } = require("clappybot/dist/systems/interactions/menus");
const { Modals } = require("clappybot/dist/systems/interactions/modals");
const { MembersAdd } = require("clappybot/dist/systems/members/memberAdd");
const { MembersRemove } = require("clappybot/dist/systems/members/memberRemove");
const { MembersUpdate } = require("clappybot/dist/systems/members/memberUpdate");
const { MessagesCreate } = require("clappybot/dist/systems/messages/create");
const { MessagesDelete } = require("clappybot/dist/systems/messages/delete");
const { MessagesUpdate } = require("clappybot/dist/systems/messages/update");
const { PresencesUpdate } = require("clappybot/dist/systems/presenceUpdate");
const { ReactionsAdd } = require("clappybot/dist/systems/reactions/add");
const { ReactionsRemove } = require("clappybot/dist/systems/reactions/remove");
const { Tasks } = require("clappybot/dist/systems/tasks");
const { VoicesStateUpdate } = require("clappybot/dist/systems/voicesStateUpdate");

class System

{
	/**
	 * @type {Initialisers}
	 */
	initialisers;

	/**
	 * @type {Commands}
	 */
	commands;

	/**
	 * @type {MessagesCreate}
	 */
	messageCreate;

	/**
	 * @type {MessagesDelete}
	 */
	messageDelete;

	/**
	 * @type {MessagesUpdate}
	 */
	messageUpdate;

	/**
	 * @type {Buttons}
	 */
	buttons;

	/**
	 * @type {Modals}
	 */
	modals;

	/**
	 * @type {Menus}
	 */
	menus;

	/**
	 * @type {ReactionsAdd}
	 */
	reactions_add;

	/**
	 * @type {ReactionsRemove}
	 */
	reactions_remove;

	/**
	 * @type {MembersUpdate}
	 */
	members_update;

	/**
	 * @type {MembersAdd}
	 */
	members_add;

	/**
	 * @type {MembersRemove}
	*/
	members_remove;

	/**
	 * @type {Tasks}
	 */
	tasks;

	/**
	 * @type {PresencesUpdate}
	 */
	presencesUpdate;

	/**
	 * @type {ChannelsCreate}
	 */
	channelsCreate;

	/**
	 * @type {ChannelsDelete}
	 */
	channelsDelete;

	/**
	 * @type {VoicesStateUpdate}
	 */
	voicesStateUpdate;

	constructor()
	{
		this.initialisers = new Initialisers();
		this.commands = new Commands();
		this.messageCreate = new MessagesCreate();
		this.messageDelete = new MessagesDelete();
		this.messageUpdate = new MessagesUpdate();
		this.buttons = new Buttons();
		this.modals = new Modals();
		this.menus = new Menus();
		this.reactions_add = new ReactionsAdd();
		this.reactions_remove = new ReactionsRemove();
		this.members_update = new MembersUpdate();
		this.members_add = new MembersAdd();
		this.members_remove = new MembersRemove();
		this.tasks = new Tasks();
		this.presencesUpdate = new PresencesUpdate();
		this.channelsCreate = new ChannelsCreate();
		this.channelsDelete = new ChannelsDelete();
		this.channelsUpdate = new ChannelsUpdate();
		this.voicesStateUpdate = new VoicesStateUpdate();
	}

	async init()
	{
		try {
			await this.initialisers.load();
			await this.commands.load();
			await this.messageCreate.load();
			await this.messageDelete.load();
			await this.messageUpdate.load();
			await this.buttons.load();
			await this.modals.load();
			await this.menus.load();
			await this.reactions_add.load();
			await this.reactions_remove.load();
			await this.members_update.load();
			await this.members_add.load();
			await this.members_remove.load();
			await this.tasks.load();
			await this.presencesUpdate.load();
			await this.channelsCreate.load();
			await this.channelsDelete.load();
			await this.channelsUpdate.load();
			await this.voicesStateUpdate.load();
		} catch (error) {
			console.error(error);
		}
	}

	async reload()
	{
		await this.initialisers.reload();
		await this.commands.reload();
		await this.messageCreate.reload();
		await this.messageDelete.reload();
		await this.messageUpdate.reload();
		await this.buttons.reload();
		await this.modals.reload();
		await this.menus.reload();
		await this.reactions_add.reload();
		await this.reactions_remove.reload();
		await this.members_update.reload();
		await this.members_add.reload();
		await this.members_remove.reload();
		await this.tasks.reload();
		await this.presencesUpdate.reload();
		await this.channelsCreate.reload();
		await this.channelsDelete.reload();
		await this.channelsUpdate.reload();
		await this.voicesStateUpdate.reload();
	}
}

const system = new System();

module.exports = { system }