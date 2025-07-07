const { GlobalPermissions, GuildPermissions } = require("clappybot/dist/models/Permissions");

class UserPermissions
{
	/**
	 * @type {GlobalPermissions}
	 */
	global;

	/**
	 * @type {GuildPermissions | null}
	 */
	guild;

	/**
	 * @type {string}
	 */
	user_id;

	/**
	 * @type {string | null}
	 */
	guild_id;

	/**
	 * 
	 * @param {string} user_id 
	 * @param {string | null} guild_id 
	 */
	constructor(user_id, guild_id = null)
	{
		this.user_id = user_id;
		this.guild_id = guild_id;
	}

	async refresh()
	{
		this.global = await GlobalPermissions.firstByOrCreate({user_id: this.user_id})
		if (this.guild_id)
			this.guild = await GuildPermissions.firstByOrCreate({user_id: this.user_id, guild_id: this.guild_id})
	}

	/**
	 * 
	 * @param {string} guild_id 
	 */
	async setGuild(guild_id)
	{
		this.guild = await GuildPermissions.firstByOrCreate(
			{user_id: this.user_id, guild_id: guild_id}
		);
	}
	/**
	 * 
	 * @param {number} permission_bit 
	 */
	has(permission_bit)
	{
		console.log("global", this.global)
		console.log("guild", this.guild)
		if (this.global.has(permission_bit))
			return (true);
		if (this.guild)
			return (this.guild.has(permission_bit));
		return (false);
	}
}

module.exports = {
	UserPermissions
}