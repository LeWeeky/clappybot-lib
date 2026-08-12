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


const { ADriver } = require('./ADriver');
const { postgresql_request } = require('../sql/postgresql/request');
const { postgresql_create_table } = require('../sql/postgresql/create');
const { postgresql_insert, postgresql_last_insert_id } = require('../sql/postgresql/insert');
const { postgresql_update } = require('../sql/postgresql/update');
const { postgresql_select } = require('../sql/postgresql/select');
const { postgresql_delete } = require('../sql/postgresql/delete');
const { postgresql_exists } = require('../sql/postgresql/exists');
const { postgresql_count } = require('../sql/postgresql/count');

class PostgreSQLDriver extends ADriver
{
   /**
    * @type {typeof import('pg').Client}
    */
   static _create = require('pg').Client;

   /**
    * 
    * @param {{
    * 	host: string,
    * 	user: string,
    * 	password: string,
    * 	database: string,
    * 	supportBigNumbers?: boolean,
    * 	bigNumberStrings?: boolean
    * }} parameters 
    */
   constructor(parameters)
   {
   	super(parameters);
   }

   break()
   {
   	super.break();
   	if (!this._locks && this._connection)
   	{
   		this._connection.end();
   		this._connection = null;
   	}
   }

   destroy()
   {
   	if (this._connection)
   		this._connection.end();
   }

   /**
    * Returns query for auto increment primary key 
    * @returns {string}
    */
   getAutoIncrementQuery()
   {
   	return ("id SERIAL PRIMARY KEY");
   }

   /**
    * Replaces the "friendly type" with the type in PostgreSQL
    * @param {string} field 
    * @param {{}} fields
    * @returns 
    */
   static toQueryType(field, fields)
   {
   	let type;

   	switch (fields[field])
   	{
   		case "integer":
   			type = "INTEGER DEFAULT 0";
   			break;
   		case "size":
   			type = "UNSIGNED INT";
   			break;
   		case "bigint":
   			type = "BIGINT";
   			break;
   		case "datetime":
   			type = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
   			break;
   		case "string":
   			type = "VARCHAR(255)";
   			break;
   		case "text":
   			type = "TEXT";
   			break;
   		case "boolean":
   			type = "BOOLEAN";
   			break;
   		default:
   			type = fields[field];
   			break;
   	}
   	return (`${field} ${type}`);
   }

   /**
    * 
    * @param {string} request 
    * @param {any[] | null} data 
    */
   async request(request, data = null)
   {
   	const row = await postgresql_request(this.connect(), request, data);
   	this.break();
   	return (row);
   }

   /**
    * 
    * @param {string} table 
    * @param {string} element 
    * @param {string | null} more 
    */
   async create(table, element, more = null)
   {
   	await postgresql_create_table(this.connect(), table, element, more);
   	this.break();
   }

   /**
    * 
    * @param {string} table 
    * @param {string} element 
    * @param {any[]} data
    * @param {boolean} get_last_id
    * @returns {Promise<number>}
    */
   async insert(table, element, data, get_last_id = true)
   {
   	let last_id = 0;
   	const connect = this.connect();
   	await postgresql_insert(connect, table, element, data);
   	if (get_last_id)
   		last_id = await postgresql_last_insert_id(connect);
   	this.break();
   	return (last_id);
   }

   /**
    * 
    * @param {string} table 
    * @param {string} element 
    * @param {string} where 
    * @param {any[] | null} data 
    */
   async update(table, element, where, data = null)
   {
   	await postgresql_update(this.connect(), table, element, where, data);
   	this.break();
   }

   /**
    * 
    * @param {string} table 
    * @param {string} element 
    * @param {string | null} where 
    * @param {any[] | null} data 
    * @param {number} limit 
    * @returns {Promise<any[]>}
    */
   async select(table, element, where = null, data = null, limit = 0)
   {
   	const row = await postgresql_select(this.connect(), table, element, where, data, limit);
   	this.break();
   	return (row);
   }

   /**
    * 
    * @param {string} table 
    * @param {string} where 
    * @param {any[] | null} data 
    */
   async delete(table, where, data = null)
   {
   	await postgresql_delete(this.connect(), table, where, data);
   	this.break();
   }

   /**
    * 
    * @param {string} table 
    * @param {string} where 
    * @param {any[] | null} data 
    */
   async exists(table, where, data = null)
   {
   	const result = await postgresql_exists(this.connect(), table, where, data);
   	this.break();
   	return (result);
   }

   /**
    * 
    * @param {string} table 
    * @param {string | null} where 
    * @param {any[] | null} data 
    * @returns {Promise<number>}
    */
   async count(table, where = null, data = null)
   {
   	const result = await postgresql_count(this.connect(), table, where, data);
   	this.break();
   	return (result);
   }
}

module.exports = {
   PostgreSQLDriver
}