/**
 * ClappyBot - A powerful framework for bot developers
 * Copyright (C) 2025 LeWeeky
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
 * @param {string} table 
 * @param {string | false} target 
 * @param {any[]} data 
 * @returns {Promise<number | null>} 
 */
async function postgresql_insert(connection, table, target, data)
{
    let targets = "$1";

    for (let i = 2; i <= data.length; i++)
    {
        targets = targets + ", $" + i;
    }

    try {
        let rowId;
        if (target)
        {
            const { rows } = await connection.query(
                `INSERT INTO ${table} (${target}) VALUES (${targets}) RETURNING id;`, data
            );
            rowId = rows[0]?.id || 0;
        }
        else
        {
            const { rows } = await connection.query(
                `INSERT INTO ${table} VALUES (${targets}) RETURNING id;`, data
            );
            rowId = rows[0]?.id || 0;
        }
		if (process.env.DEBUG_INFO == "true")
        	console.info('\x1b[32m%s\x1b[0m', `✅ Table ${table} mise à jour (insert)`);
		return (rowId);
    }
    catch (error) {
		if (process.env.DEBUG_ERROR != "false")
		{
			console.error('\x1b[31m%s\x1b[0m', `❌ Erreur : mise à jour de la Table ${table} (insert)`);
       		console.error(error);
		}
        return (0);
    }
}

module.exports = {
    postgresql_insert
}