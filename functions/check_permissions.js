const Discord = require('discord.js');
const client = require('../bot').client;

/**
 * @param {object} command 
 * @param {Discord.Guild} guild
 * @param {Discord.Message} message
 */
module.exports.check = function(command, guild, message) {
    // Old, re-used code, not fancy but it does the job
    // To-do: Take channel permission overwrites into consideration

    let reqPerms = new Discord.Permissions(0);
		let reqPermsStr = '';
		if (command.perms == undefined) {reqPerms.add('ADMINISTRATOR'); command.perms = ['ADMINISTRATOR']}
        else if (command.perms.length == 0) {reqPerms.add('ADMINISTRATOR'); command.perms = ['ADMINISTRATOR']}
        
        let bot_member = guild.members.get(client.user.id);

		command.perms.forEach(p => {
			function check() {if (bot_member.permissions.hasPermission(p)) return '✅ '; else return '❌ '}
			reqPerms.add(p);
			reqPermsStr = reqPermsStr + check() + '`' + p + '`\n';
		});
    
		if (bot_member.permissions.hasPermissions(reqPerms) || bot_member.permissions.hasPermission('ADMINISTRATOR')) {
            // Bot has the required permission
            return true;
		} else {
			if (bot_member.permissions.hasPermission('SEND_MESSAGES') && bot_member.permissions.hasPermission('EMBED_LINKS')) {
                // Bot does not have the required permissions, but can send embeds
				let embed = new Discord.RichEmbed()
				.setTitle('Missing permissions')
				.setDescription(`I require the following permissions to execute this command:\n${reqPermsStr}${!command.guildOnly ? '\n**You can try to run this command in DMs instead.**' : ''}`)
				.setColor('ff0000')
				.setFooter('You need to give these permissions to Prysm if you want to use this command.');
                message.channel.send(embed);
                return false;
			} else if (bot_member.permissions.hasPermission('SEND_MESSAGES')) {
                // Bot does not have the required permissions and can't send embeds
                message.channel.send('I am mising the \'Embed links\' permission to function porperly.');
                return false;
			} else {
                // Bot is not allowed to send messages
                message.author.send(`I don\'t have permission to reply to your command. Please contact ${guild.name}'s administrators.`);
                return false;
			}
		}
}