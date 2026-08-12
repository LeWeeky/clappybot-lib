const { clappybot } = require("./main")
const { DiscordClient } = require("./libraries/client")
const { Colors } = require("./libraries/colors")
const { AModel } = require("./libraries/models/AModel")
const { DataBaseWrapper } = require("./libraries/models/DataBaseWrapper")
const { MySQLDriver } = require("./libraries/models/MySQLDriver")
const { SqliteDriver } = require("./libraries/models/SqliteDriver")
const { ban } = require("./libraries/sanctions/ban")
const { History } = require("./libraries/sanctions/history")
const { kick } = require("./libraries/sanctions/kick")
const { mute } = require("./libraries/sanctions/mute")
const { binarySearch } = require("./libraries/fetching/binary_search")
const { apiCall } = require("./libraries/api/call_api")
const { getDomain } = require("./libraries/fetching/get_domain")
const { getTargetUser } = require("./libraries/fetching/target_user")
const { replaceByVariables } = require("./libraries/formating/replace")
const { split } = require("./libraries/formating/split")
const { subString } = require("./libraries/formating/substring")
const { charIsNumber, stringIsNumber } = require("./libraries/informations/is_number")
const { isImage, isDomainName } = require("./libraries/informations/check_link")
const { isSendable } = require("./libraries/informations/is_sendable")
const { isOwner } = require("./libraries/permissions/bot_owner")
const { system } = require("./systems/system")
const { User } = require("./libraries/fetching/users")
const { Messages, getMessageData, newMessage } = require("./libraries/fetching/message")
const { getLoadingButton } = require("./libraries/templates/loading_button")
const { Random } = require("./libraries/random_numbers")
const { mysql_count } = require("./libraries/sql/mysql/count")
const { mysql_create_table } = require("./libraries/sql/mysql/create")
const { mysql_delete } = require("./libraries/sql/mysql/delete")
const { mysql_exists } = require("./libraries/sql/mysql/exists")
const { mysql_insert } = require("./libraries/sql/mysql/insert")
const { mysql_request } = require("./libraries/sql/mysql/request")
const { mysql_select } = require("./libraries/sql/mysql/select")
const { mysql_update } = require("./libraries/sql/mysql/update")
const { postgresql_count } = require("./libraries/sql/postgresql/count")
const { postgresql_create_table } = require("./libraries/sql/postgresql/create")
const { postgresql_delete } = require("./libraries/sql/postgresql/delete")
const { postgresql_exists } = require("./libraries/sql/postgresql/exists")
const { postgresql_insert } = require("./libraries/sql/postgresql/insert")
const { postgresql_request } = require("./libraries/sql/postgresql/request")
const { postgresql_select } = require("./libraries/sql/postgresql/select")
const { postgresql_update } = require("./libraries/sql/postgresql/update")
const { sqlite_count } = require("./libraries/sql/sqlite/count")
const { sqlite_create_table } = require("./libraries/sql/sqlite/create")
const { sqlite_delete } = require("./libraries/sql/sqlite/delete")
const { sqlite_exists } = require("./libraries/sql/sqlite/exists")
const { sqlite_insert } = require("./libraries/sql/sqlite/insert")
const { sqlite_request } = require("./libraries/sql/sqlite/request")
const { sqlite_select } = require("./libraries/sql/sqlite/select")
const { sqlite_update } = require("./libraries/sql/sqlite/update")
const { UserPermissions } = require("./libraries/permissions/permissions")
const { PermissionsBits } = require("./libraries/permissions/bits")
const { GlobalPermissions, GuildPermissions } = require("./models/Permissions")

exports.clappybot = clappybot;
exports.Colors = Colors;
exports.AModel = AModel;
exports.MySQLDriver = MySQLDriver;
exports.SqliteDriver = SqliteDriver;
exports.DataBaseWrapper = DataBaseWrapper;

exports.ban = ban;
exports.kick = kick;
exports.mute = mute;
exports.History = History;

exports.DiscordClient = DiscordClient;

exports.binarySearch = binarySearch;
exports.apiCall = apiCall;
exports.getDomain = getDomain;
exports.getTargetUser = getTargetUser;

exports.replaceByVariables = replaceByVariables;
exports.split = split;
exports.subString = subString;

exports.charIsNumber = charIsNumber;
exports.stringIsNumber = stringIsNumber;
exports.isImage = isImage;
exports.isDomainName = isDomainName;
exports.isSendable = isSendable;
exports.isOwner = isOwner;

exports.system = system;

exports.User = User;
exports.Messages = Messages;
exports.getMessageData = getMessageData;
exports.newMessage = newMessage;

exports.getLoadingButton = getLoadingButton;
exports.Random = Random;

exports.mysql_count = mysql_count;
exports.mysql_create_table = mysql_create_table;
exports.mysql_delete = mysql_delete;
exports.mysql_exists = mysql_exists;
exports.mysql_insert = mysql_insert;
exports.mysql_request = mysql_request;
exports.mysql_select = mysql_select;
exports.mysql_update = mysql_update;

exports.postgresql_count = postgresql_count;
exports.postgresql_create_table = postgresql_create_table;
exports.postgresql_delete = postgresql_delete;
exports.postgresql_exists = postgresql_exists;
exports.postgresql_insert = postgresql_insert;
exports.postgresql_request = postgresql_request;
exports.postgresql_select = postgresql_select;
exports.postgresql_update = postgresql_update;

exports.sqlite_count = sqlite_count;
exports.sqlite_create_table = sqlite_create_table;
exports.sqlite_delete = sqlite_delete;
exports.sqlite_exists = sqlite_exists;
exports.sqlite_insert = sqlite_insert;
exports.sqlite_request = sqlite_request;
exports.sqlite_select = sqlite_select;
exports.sqlite_update = sqlite_update;

exports.PermissionsBits = PermissionsBits;
exports.GlobalPermissions = GlobalPermissions;
exports.GuildPermissions = GuildPermissions;
exports.UserPermissions = UserPermissions;