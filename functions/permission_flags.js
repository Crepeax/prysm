const db = require('../bot').db;
const { User } = require('discord.js');

/**
 * Get all flags from [user]
 * @param {User | string} user
 */
module.exports.getFlags = function(user) {
    if (!user) return db.permissionFlags;
    else return db.permissionFlags.get(user.id || user);
}

/**
 * Set the flag [flag] for user [user] to value [value]
 * @param {User | string} user 
 * @param {string} flag 
 * @param {string | boolean | number} value 
 */
module.exports.setFlag = function(user, flag, value) {
    db.permissionFlags.set(user.id || user, value, flag.toUpperCase());
    if (db.permissionFlags.get(user.id) == {}) db.permissionFlags.delete(user.id);
    return true;
}

/**
 * Delete all permission flags for [user]
 * @param {User | string} user 
 */
module.exports.clearFlags = function(user) {
    db.permissionFlags.delete(user.id || user);
    return true;
}