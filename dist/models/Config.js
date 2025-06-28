const { AModel } = require("clappybot/dist/libraries/models/AModel");

class Config extends AModel
{
	static table = 'configs';
	static fields = {
		guild_id: 'string',
		prefix: 'string',
		activity: 'integer',
		status: 'string',
		twitch: 'string',
		created_at: 'datetime'
	};
}

module.exports = {
	Config
}