const data = require('../../bot');
const fs = require('fs');

module.exports = {
    name: 'exportpermissions',
    aliases: ["exportperms"],
    flag: 1000,
    execute(message, args) {
        message.channel.send('Export started, finished file will be sent to your DMs');
        let exported_json = {}
        data.db.permissionFlags.forEach((value, key) => {
            exported_json[key] = value;
        });
        fs.writeFile(`./data-storage/export-files/permission-export-${message.id}.json`, JSON.stringify(exported_json, null, 4), function(err) {
            message.author.send({file: `./data-storage/export-files/permission-export-${message.id}.json`});
        });
    }
}

module.exports.devCommand = true;