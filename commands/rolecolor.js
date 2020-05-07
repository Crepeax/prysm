const Discord = require('discord.js');

module.exports = {
    name: 'rolecolor',
    description: 'Change your highest Role\'s color.',
    aliases: ['rc'],
    guildOnly: true,
    perms: ['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_ROLES', 'EMBED_LINKS'],
    execute(message, args) {
        if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.hasPermission('MANAGE_ROLES')) {
            let invPermsEmbed = new Discord.RichEmbed()
            .setTitle('Invalid Permissions')
            .setDescription('You are not permitted to change your Role Color.')
            .setFooter('You need MANAGE_ROLES or ADMINISTRATOR permissions for this.')
            .setColor('ff0000');
            message.channel.send(invPermsEmbed);
            return;
        }
    let userRole;
        if (args[1] != undefined) {
                if (message.mentions.users.first()) {
                    userRole = message.mentions.members.first().highestRole;
                } else {
                let search = args.slice(1).join(' ');
                message.guild.roles.forEach(r => {
                    if (r.name.toLowerCase() == search.toLowerCase() && !userRole) {
                        userRole = r;
                    }
                })
                if (!userRole) {
                    let eEmbed = new Discord.RichEmbed()
                    .setTitle('I couldn\'t find anything.')
                    .setDescription('I couldn\'t find a role named `' + search + '` in this guild.')
                    .setFooter('Try searching for something different or mention an user.')
                    .setColor('ff0000');
                    return message.channel.send(eEmbed);
                }
            }
        } else userRole = message.member.highestRole;
        if (args[0] == undefined) {
            args[0] = ' ';
        } else if (userRole.comparePositionTo(message.guild.me.highestRole) > 0 || userRole == message.guild.me.highestRole) {
            let botInvPermsEmbed = new Discord.RichEmbed()
            .setTitle('Sorry, I am not able to do that.')
            .setDescription(`I am not able to change ${userRole}'s color because my highest Role is lower.`)
            .setFooter('Please contact the Server Owner.')
            .setColor('ff0000');
            message.channel.send(botInvPermsEmbed);
            return;
        } else if (userRole.id == message.guild.defaultRole.id) {
            let noEmbed = new Discord.RichEmbed()
            .setTitle('Sorry, I am unable to do that.')
            .setDescription('I can\'t change your color because you don\'t have a role.')
            .setColor('ff0000');
            message.channel.send(noEmbed);
            return;
        }
        var colors = {
            'turquoise': 		'1abc9c',
            'darkturquoise':	'11806a',
            'green': 			'2ecc71',
            'darkgreen': 		'1f8b4c',
            'blue':		 		'3498db',
            'darkblue':			'206694',
            'purple': 			'9b59b6',
            'darkpurple': 		'71368a',
            'pink': 			'e91e63',
            'darkpink': 		'ad1457',
            'yellow': 			'f1c40f',
            'darkyellow': 		'c27c0e',
            'gold': 			'e67e22',
            'darkgold': 		'a84300',
            'orange': 			'e74c3c',
            'darkorange': 		'992d22',
            'lightgray': 		'95a5a6',
            'gray': 			'979c9f',
            'darkgray': 		'607d8b',
            'darkergray': 		'546e7a',
            'default': 			'99aab5',
            'invis': 			'36393f',
            'black':			'000000',
            'white':			'ffffff',
            'red':              'ff0000',
            'aids':             '696969'
        };
        let invSyntaxEmbed = new Discord.RichEmbed()
        .setTitle('Invalid Syntax')
        .addField(`Use rolecolor <Color>.You can enter a Hex color (for \nexample #36393F) or use one of the following.`, 'Pro Tip: Use [this](https://color.adobe.com/create/) color wheel for the Hex Values!')
        .setFooter(`Color List: 
        Turquoise,			Gold,
        Dark_Turquoise,		Dark_Gold,
        Green,				Orange,
        Dark_Green,			Dark_Orange,
        Blue,				Light_Gray,
        Dark_Blue,			Gray,
        Purple,				Dark_Gray,
        Dark_Purple,		Darker_Gray,
        Pink,				Black,
        Dark_Pink,			White,
        Yellow,				Invis,
        Dark_Yellow,		Red,
        Default
        `)
        .setColor('FF0000');
        testForArray = (args[0].replace(/[_-]/g, "").toLowerCase());			// Remove _ and - from Input
        if (colors[testForArray] == undefined) {
            if (/^#[0-9A-F]{6}$/i.test(args[0]) == !false) {	// Check if Value is a valid HEX Color code
                let successEmbed = new Discord.RichEmbed()
                .setTitle('Role Color changed!')
                .setDescription(`I changed ${userRole}'s color to ${args[0].toUpperCase()}!`)
                .setColor('00FF00');
                userRole.setColor(args[0]);
                message.channel.send(successEmbed);
            } else {
                message.channel.send(invSyntaxEmbed)
                .then(msg => {
                    msg.delete(60000);
                    message.delete(60000);
                    });
            }
        } else {
            let successEmbed = new Discord.RichEmbed()
            .setTitle('Role Color changed!')
            .setDescription(`I changed ${userRole}'s color to ${colors[testForArray].toUpperCase()}!`)
            .setColor('00FF00');
            message.channel.send(successEmbed);
            userRole.setColor(colors[testForArray]);
        }
    }
}