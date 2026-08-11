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

class Colors
{
 	static none = 3092790;
    static white = 16777215;
    static blue = 676480;
    static light_blue = 12513018;
    static light_red = 15981017;
    static mauve = 10578664;
    static yellow = 16773120;
    static black = 0;
    static red = 16719952;
    static green = 514972;
    static purple = 11353056;
	static pink = 16756412;
    static lilac = 13874661;
	static orange = 16750134;

	/**
	 * @param {string} color 
	 * @returns {boolean}
	 */
	static isHexColor(color)
	{
		const regex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
		return (regex.test(color));
	}

	/**
	 * @param {number} color int color
	 * @returns {string} #HEXCODE
	 */
	static toHexColor(color)
	{
		return (`#${color.toString(16)}`);
	}

	/**
	 * @param {string} color #HEXCODE
	 * @returns {number} int color
	 */
	static toIntColor(color)
	{
		if (color.startsWith("#"))
			color = color.substring(1)
		return (parseInt(color, 16));
	}
}

module.exports = { Colors} 