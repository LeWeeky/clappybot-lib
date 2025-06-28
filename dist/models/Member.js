const { AModel } = require("clappybot/dist/libraries/models/AModel");
const { HistoryPage } = require("clappybot/dist/models/HistoryPage");

class Member extends AModel
{
	static table = 'members';
	static fields = {
		guild_id: 'string',
		user_id: 'string',
		mute: 'boolean'
	};
	static has_many = [
        HistoryPage
    ]

	addToHistory(page)
	{
		page.member_id = this.id;
		page.save();
	}
}

module.exports = {
	Member
}