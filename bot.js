/* Prysm - A Discord Bot
 * Copyright (C) 2019-2020 Im_Verum
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * 
 * Contact: prysmbot@gmail.com or via Discord: https://discord.gg/aTRHKUY
 */

const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client({ partials: [ 'MESSAGE', 'CHANNEL', 'REACTION' ]});
const fs = require('fs');
const path = require('path');

// Setup the database
const Enmap = require('enmap');
let db = {
    reactionroles: new Enmap({ name: 'reactionroles', polling: true, fetchAll: true }),
    guild: new Enmap({ name: 'guilddata', polling: true, fetchAll: true }),
    user: new Enmap({ name: 'userdata', polling: true, fetchAll: true }),
    stats: new Enmap({ name: 'botStats', polling: true, fetchAll: true }),
    permissionFlags: new Enmap({ name: 'permission_flags', polling: true, fetchAll: true }),
    clientCache: {
        guildSize: client.guilds.size,
        userSize: client.users.size
    }
}

let modules = new Discord.Collection();

module.exports = {
    db: db,
    client: client,
    modules: modules
}

// Get all files in modules/*
require('./functions/walk.js').walk(`${__dirname}/modules`, function(err, results) {
    if (err) throw err;
    if (typeof results != 'object') {
        console.error('Invalid results');
        process.exit(1);
    }
    
    // Load modules in modules/*
    let loadedModules = 0;
    results.forEach(dir => {
        if (path.extname(dir) != '.js') return console.log(`[Shard ${client.shard.id}] Can't load file: ${dir}`);
        if (path.dirname(dir).endsWith('commands')) return;
        let module = require(dir);
        if (!module.meta)                            return console.log(`Module ${dir} is missing metadata.`);
        if (!module.meta.name)                       return console.log(`Module ${dir} is missing 'name' property.`);
        if (typeof module.meta.priority != 'number') return console.log(`Module '${module.meta.name}' is missing 'priority' property.`);
        if (typeof module.run != 'function')         return console.log(`Module '${module.meta.name}' does not have a 'run()' function.`);
        modules.set(module.meta.name, module);
        loadedModules += 1;
    });
    console.log(`[Shard ${client.shard.id}] Loaded ${loadedModules} modules.`);

    // Sort modules and execute them in order
    modules.sort((a, b) => a.meta.priority - b.meta.priority)
    .forEach(module => module.run());
  });
