const { AModel } = require("clappybot/dist/libraries/models/AModel");

class RebootMessage extends AModel
{
	static table = 'reboot_messages';
	static fields = {
		guild_id: 'string',
		channel_id: 'string',
		message: 'string'
	};
}

module.exports = {
	RebootMessage
}