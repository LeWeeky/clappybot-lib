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

const { isSpace } = require("../fetching/is_space");

/**
 * Useful if you want to extract the text of a command after its arguments
 * @param {*} content 
 * @param {*} length 
 * @returns 
 */
function subString(content, length)
{
    let i = 0;
    let y = 0;
    let new_string = "";

    while (content[i] && length > 0)
    {
        if (!isSpace(content[i]))
            length--;
        i++;
    }
    while (content[i])
    {
        new_string = new_string+content[i]
        i++;
        y++;
    }
    return (new_string);
}

module.exports = { subString }