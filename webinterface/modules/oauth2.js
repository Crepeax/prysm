const axios = require('axios').default;
const request = require('request');
const fetch = require('node-fetch');
const config = require('../../config.json');
const base64 = require('base-64');

let handledTokens = [];

module.exports = {
    async exec(req, response, code, callback) {
        console.log('[Web] [OAuth2] OAuth2 code received: \x1b[33m' + code + '\x1b[0m');
        if (handledTokens.indexOf(code) > -1) return console.log('[Web] [OAuth2] Token was already used');
        handledTokens.push(code);

        let data = {};
            data.client_id      = config.oauth_id;
            data.client_secret  = config.oauth_secret;
            data.grant_type     = 'authorization_code';
            data.redirect_uri   = config.oauth_uri;
            data.scope          = config.oauth_scope;
            data.code           = code;

        let headers = {};
            headers['Content-Type'] = 'application/x-www-form-urlencoded';

        request.post('https://discordapp.com/api/v6/oauth2/token', {
            headers: headers,
            form: data
        }, function(err, resp, body) {
            if (err) {
                response.setStatus('500').send('An error has occurred');
                callback(new Error('An error has occurred'));
            }
            let dres = JSON.parse(body);
            if (!dres.access_token) {
                response.setStatus('500').send('Invalid response');
                callback(new Error('Inavlid Response'));
            }
            console.log(dres);
            
            callback(dres);
        });
    }
}