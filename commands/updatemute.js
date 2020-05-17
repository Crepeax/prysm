const Discord = require('discord.js');
const client = require('../index').client;
const fs = require('fs');
const config = require('../config.json');

module.exports = {
    name: 'updatemute',
    description: '',
    syntax: '',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES', 'MANAGE_CHANNELS'],
    cooldown: 1500,
    dev_only: false,
    disabled: false,
    execute(message, args) {

        if (!message.member.permissions.has('MANAGE_ROLES')) return message.channel.send('You need to have "Manage Roles" permission for this.');

        if (!fs.existsSync('guilddata.json')) fs.writeFileSync('guilddata.json', '{}');
        let file = JSON.parse(fs.readFileSync('guilddata.json'));

        let gid = message.guild.id;

        // Fix data if format is incorrect
        if (typeof file[gid] != 'object') file[gid] = {}
            if (typeof file[gid].mutedRole != 'string') {
            if (typeof file[gid].mutedRole == 'number' || typeof file[gid] == 'bigint')
            file[gid].mutedRole = toString(file[gid].mutedRole);
            else file[gid].mutedRole = undefined;
        }
        if (message.guild.roles.get(file[gid].mutedRole) == undefined) file[gid].mutedRole = undefined;

        fs.writeFileSync('guilddata.json', JSON.stringify(file));
        // ------------------------------


        // Create the muted role, if none is specified
        if (file[gid].mutedRole) {
            message.channel.send('Updating permission overrides...');
            
            let r = message.guild.roles.get(file[gid].mutedRole);
            // Set permission override for every channel
            let failed = [];
            message.guild.channels.forEach(c => {
                if (!c.manageable) failed.push(c);
                else {
                    c.overwritePermissions(r, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        CONNECT: false
                    }, 'Set permissions for muted role').catch(e => {
                        failed.push(c);
                        console.error(e);
                    });
                }
            });

            file = JSON.parse(fs.readFileSync('guilddata.json'));
            file[gid].mutedRole = r.id;
            fs.writeFileSync('guilddata.json', JSON.stringify(file));

            if (failed.length > 0) {
                let str = '';
                let a = 0;
                let b = false;
                failed.forEach(item => {
                    if (str.length > 200) {
                        if (!b) str += `And ${failed.length - a} more`;
                        b = true;
                        return;
                    }
                    a += 1;
                    str += `\`${item.name}\`\n`
                });
                message.channel.send(`Failed to set permissions for ${failed.length} channels: \n${str}\n**Consider temporarily giving administrator permissions to Prysm and running this command again.**`);
            } else {
                message.channel.send(`:white_check_mark: ${r} updated successfully`);
            }
        } else {
            message.channel.send(`No muted role created yet. Run ${config.prefix}mute to create one.`);
        }
    }
}