const { AModel } = require("clappybot/dist/libraries/models/AModel");

class HistoryPage extends AModel
{
	static table = 'histories';
	static fields = {
		sanction: 'string',
		author: 'string',
		reason: 'text',
		created_at: 'datetime'
	};
}

module.exports = {
	HistoryPage
}