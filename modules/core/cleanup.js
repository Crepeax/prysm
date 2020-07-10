const Discord = require('discord.js');
const data = require('../../bot');
const client = data.client;

const fs = require('fs');
const fsextra = require('fs-extra');
const bot = require('../../bot');

function createDir(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        console.log(`[Info] Created directory: ${path}`);
    }
}

function createFile(path, content) {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, content);
        console.log(`[Info] Created file: ${path} ${content ? `with content: ${content}` : ''}`);
    }
}

module.exports.run = () => {
    // Create missing files and folders
    createDir('./data-storage');
    createDir('./error-logs');
    createDir('./data-storage/conversions');
    createDir('./data-storage/export-files');
    createFile('./data-storage/defaultroles.json', '{}');

    // Delete junk files
    fsextra.emptyDirSync('./data-storage/conversions');

    if (typeof data.db.stats.get('total_commands') != 'number') data.db.stats.set('total_commands', 0);    
}

module.exports.meta = {
    name: 'cleanup',
    priority: 0
}