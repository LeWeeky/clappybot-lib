const { AModel } = require("clappybot/dist/libraries/models/AModel");
const { PermissionsBits } = require("clappybot/dist/libraries/permissions/bits");

class APermissions extends AModel
{
	static fields = {
		user_id: 'string',
		bits: 'integer'
	};

	/**
	 * 
	 * @param {number} permission_bit 
	 */
	add(permission_bit)
	{
		this.bits |= permission_bit;
	}

	/**
	 * 
	 * @param {number} permission_bit 
	 */
	remove(permission_bit)
	{
		this.bits &= ~permission_bit;
	}
	reset()
	{
		this.bits = 0;
	}
	has(permission_bit)
	{
		return (
			this.bits & PermissionsBits.Owner
			|| this.bits & permission_bit
		);
	}
	isAdmin()
	{
		return (this.bits & PermissionsBits.Admin);
	}
}

class GuildPermissions extends APermissions
{
	static table = 'guild_permissions';
}

class GlobalPermissions extends APermissions
{
	static table = 'global_permissions';
}

module.exports = {
	GuildPermissions,
	GlobalPermissions
}