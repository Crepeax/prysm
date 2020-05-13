const fs = require('fs');

module.exports = {
    addStats(user, command, dm, status, error, execType) {
        try {
        
            if (!fs.existsSync('userstats/')) fs.mkdirSync('userstats/');
            
            // Create new file, if there is none
            if (!fs.existsSync('userstats/' + user.id + '.json')) {
                let content = {
                    name: user.username,
                    tag: user.discriminator,
                    firstCommand: Date.now(),
                    commandCount: {
                        totalCommands: 0,
                        dmCommands: 0,
                        notDMCommands: 0,
                    },
                    commandFailures: {
                        error: 0,
                        notInDMError: 0,
                        cooldown: 0,
                        success: 0,
                        devOnlyError: 0,
                        disabledError: 0,
                        dmMsgs: 0,
                        errorsReported: 0
                    },
                    execType: {
                        messageSend: 0,
                        messageEdit: 0
                    },
                    dmMessages: {
                    
                    }, 
                    commandsExecuted: {

                    }, 
                    errorsCaused: {
                    
                    }, 
                    errorsReported: {
                    
                    },
                    dmMsgs: 0
                }
                fs.writeFileSync('userstats/' + user.id + '.json', JSON.stringify(content));
            };

            let file = JSON.parse(fs.readFileSync(`userstats/${user.id}.json`));
        
            // Log amount of failed messages
            if (status == 'success') {
                file.commandFailures.success += 1;
            } else if (status == 'error') {
                file.commandFailures.error += 1;
            } else if (status == 'cooldown') {
                file.commandFailures.cooldown += 1;
            } else if (status == 'notInDMError') {
                file.commandFailures.notInDMError += 1;
            } else if (status == 'devOnlyError') {
                file.commandFailures.cooldown += 1;
            } else if (status == 'disabledError') {
                file.commandFailures.disabledError += 1;
            } else if (status == 'logDMMsg') {
                if (command.author.bot) return;
                file.dmMsgs += 1;
                file.dmMessages[command.createdAt] = command.content;
                fs.writeFileSync('userstats/' + user.id + '.json', JSON.stringify(file));
                return;
            } else if (status == 'logReportedError') {
                file.commandFailures.errorsReported += 1;
                file.errorsReported[command.id] = command.content;
                fs.writeFileSync('userstats/' + user.id + '.json', JSON.stringify(file));
                return;
            } else return console.error('Invalid status');
        
            // Log exec type
                 if (execType == 'send') file.execType.messageSend += 1;
            else if (execType == 'edit') file.execType.messageEdit += 1;
        
            // Log per-command usage
            if (!file.commandsExecuted[command.name]) file.commandsExecuted[command.name] = {
                error: 0,
                cooldown: 0,
                success: 0,
                notInDMError: 0,
                devOnlyError: 0,
                disabledError: 0,
                where: {
                    DM: 0,
                    guild: 0
                }
            }
            file.commandsExecuted[command.name][status] += 1;

            if (dm) file.commandsExecuted[command.name].where.DM += 1;
            else file.commandsExecuted[command.name].where.guild += 1;
        
            // Log total commands executed
            file.commandCount.totalCommands += 1;
            if (dm) file.commandCount.dmCommands += 1; else file.commandCount.notDMCommands += 1;
        
            // If error, log error
            if (status == 'error' && error) {
                errorsCaused[error.id] = error.content;
            }
            fs.writeFileSync('userstats/' + user.id + '.json', JSON.stringify(file));
        } catch (e) {
            console.log('Log error: ' + e);
        }
    }
}