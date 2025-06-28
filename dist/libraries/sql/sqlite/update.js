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

/**
 * 
 * @param {*} connection 
 * @param {string} table 
 * @param {string} target 
 * @param {string} where 
 * @param {any[] | null} data 
 * @returns 
 */
async function sqlite_update(connection, table, target, where, data = null)
{
    try {
        const statement = connection.prepare(`UPDATE ${table} SET ${target} WHERE ${where}`);

		if (data)
			statement.run(...data)
		else
			statement.run()
		if (process.env.DEBUG_INFO == "true")
	    	console.log('\x1b[32m%s\x1b[0m', `✅ Table ${table} mise à jour`);
        return (null);
    }
    catch (error) {
		if (process.env.DEBUG_ERROR != "false")
        {
			console.error('\x1b[31m%s\x1b[0m', `❌ Erreur : mise à jour de la Table ${table}`);
       	 	console.error(error);
		}
        return (error);
    }
}

module.exports = {
    sqlite_update
}