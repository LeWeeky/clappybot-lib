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
 * @param {*} connection 
 * @param {*} table 
 * @param {*} where 
 * @param {any[] | null} data 
 * @returns {Promise<number>}
 */
async function postgresql_count(connection, table, where = null, data = null) {
    try {
        let rows;

        if (!where) {
            const [resRows, fields] = await connection.promise().query(`SELECT COUNT(*) AS occurrences FROM ${table}`);
            rows = resRows;
        } else if (data) {
            const [resRows, fields] = await connection.promise().execute(`SELECT COUNT(*) AS occurrences FROM ${table} WHERE ${where}`, data);
            rows = resRows;
        } else {
            const [resRows, fields] = await connection.promise().query(`SELECT COUNT(*) AS occurrences FROM ${table} WHERE ${where}`);
            rows = resRows;
        }

        if (process.env.DEBUG_INFO == "true")
            console.info('\x1b[32m%s\x1b[0m', `✅ Comptage dans ${table} réussi`);
        if (!rows) return -1;
        if (!rows[0]) return 0;
        return rows[0].occurrences;
    } catch (error) {
        if (process.env.DEBUG_ERROR != "false") {
            console.error('\x1b[31m%s\x1b[0m', `❌ Erreur : Comptage raté dans ${table}`);
            console.error(error);
        }
        return -1;
    }
}

module.exports = {
    postgresql_count
};