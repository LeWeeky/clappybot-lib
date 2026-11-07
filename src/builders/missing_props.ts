/**
 * ClappyBot - A powerful framework for bot developers
 * Copyright (C) 2026 LeWeeky
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

function MissingProp(object: string, prop: string, name: string) {
    throw new Error(`${object} is missing ${prop}: ${name}`);
}

export function MissingField(object: string, name: string) {
    MissingProp(object, "field", name);
}

export function MissingMethod(object: string, name: string) {
    MissingProp(object, "method", name);
}
