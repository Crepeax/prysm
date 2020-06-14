const fs = require('fs');

if (!fs.existsSync('webinterface/sessionData.json')) fs.writeFileSync('webinterface/sessionData.json', '{}');

let sessionData = JSON.parse(fs.readFileSync('webinterface/sessionData.json'));

// Store changed data
setInterval(function() {
    fs.writeFileSync('webinterface/sessionData.json', JSON.stringify(sessionData));
}, 10000);

/* TO DO: Save data per user ID instead of session ID */

module.exports = {
    store(sesID, name, data) {
        // Throw error when no data was provided
        if (!sesID)                  throw('[Web] [StoreSession] No session provided.');
        if (!data)                   throw('[Web] [StoreSession] No data provided.');
        if (typeof name != 'string') throw('[Web] [StoreSession] Data name must be of type string.');

        // Creae new empty object
        if (!sessionData[sesID]) sessionData[sesID] = {};

        // Store it.
        sessionData[sesID][name] = data;

        return 0;
    },
    get(sesID, name) {
        if (!sessionData[sesID]) {
            sessionData[sesID] = {};
            console.log('[Web] [StoreSession] Created entry for unknown session');
        }
        return sessionData[sesID];
    }
}
