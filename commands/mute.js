const Discord = require('discord.js');
const client = require('../index').client;
const fs = require('fs');
const config = require('../config.json');

module.exports = {
    name: 'mute',
    description: '',
    syntax: '',
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES', 'MANAGE_CHANNELS'],
    cooldown: 1500,
    dev_only: true,
    disabled: false,
    execute(message, args) {
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


        if (!message.mentions.members.first()) return message.channel.send('You need to mention the user you want to mute.');
        let target = message.mentions.members.first();
        if (target.id == client.user.id) return message.channel.send('No.');
        let timeout = 0;


        // Create the muted role, if none is specified
        if (!file[gid].mutedRole) {
            timeout = 3000;

            message.channel.send('No muted role found. Creating role...').then(msg => {
                message.guild.createRole({
                    'name': 'Muted',
                    'permissions': 0
                }).then(r => {

                    msg.edit('Updating permission overwrites for muted role...');
                    // Set permission override for every channel
                    let failed = [];
                    message.guild.channels.forEach(c => {
                        if (!c.manageable) failed.push(c);
                        else {
                            c.overwritePermissions(r, {
                                SEND_MESSAGES: false,
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
                        msg.edit(`:white_check_mark: Muted role created: ${r}\nFailed to set permissions for ${failed.length} channels: \n${str}\n**Run ${config.prefix}updatemute to fix.**`);
                    } else {
                        msg.edit(`:white_check_mark: ${r} role created successfully`).then(m => m.delete(30000));
                    }
                });
            });
        }


        // Check if the target is already muted
        if (target.roles.get(file[gid].mutedRole)) return message.channel.send(new Discord.RichEmbed()
        .setTitle('Failed to mute')
        .setDescription(`${target.user.username} is already muted.\nUse ${config.prefix}unmute to unmute an user.`)
        .setTimestamp()
        .setFooter(`Invoked by ${message.author.username}`, target.user.avatarURL)
        );


        // Give the muted role to the target
        if (target.permissions.has('ADMINISTRATOR')) return message.channel.send(new Discord.RichEmbed()
        .setTitle('Failed to mute')
        .setDescription('You can\'t mute Administrators.')
        .setTimestamp()
        .setFooter(`Invoked by ${message.author.username}`, target.user.avatarURL)
        );

        setTimeout(function() {
            target.addRole(message.guild.roles.get(file[gid].mutedRole).id).catch(e => {throw e});
            message.channel.send(new Discord.RichEmbed()
            .setTitle('User muted')
            .setDescription(`Successfully muted ${target.user.username}#${target.user.discriminator}`)
            .setTimestamp()
            .setFooter(`Invoked by ${message.author.username}`, target.user.avatarURL)
            );
        }, timeout);
    }
}