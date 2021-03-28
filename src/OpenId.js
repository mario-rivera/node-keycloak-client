const http = require('http');
const querystring = require('querystring');
const AuthToken = require('./AuthToken');

const urlMap = new WeakMap();

module.exports = class OpenId
{
    /**
     * @param {URL} url
     */
    constructor(url) 
    {
        urlMap.set(this, url);
    }

    /**
     * @returns {URL}
     */
    getUrl()
    {
        return urlMap.get(this);
    }

    /**
     * 
     * @param {string} realm 
     * @param {string} clientId 
     * @param {string} clientSecret 
     * 
     * @return {Promise<AuthToken>}
     */
    clientCredentials(realm, clientId, clientSecret)
    {
        const postData = querystring.stringify({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret
        });

        let options = {
            method: 'POST',
            path: `/auth/realms/${realm}/protocol/openid-connect/token`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            },
            write: {
                data: postData
            }
        };

        return request(this.getUrl(), options).then(JSON.parse).then((token) => Object.freeze(new AuthToken(token)));
    }
}


/**
 * @param {URL} url 
 * @param {import('http').RequestOptions} options
 * 
 * @returns {Promise<string>} The response body
 */
 function request(url, options) {
    return new Promise((resolve, reject) => {

        const req = http.request(url, options, (res) => {

            res.on('error', reject);

            let body = [];
            res.on('data', (chunk) => body.push(chunk));

            res.on('end', () => {
                let error = null;

                body = body.toString();
                if (!res.headers['content-length'] || parseInt(res.headers['content-length']) < 1) {
                    body = null;
                }
    
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    error = new Error(`Response exception: ${res.statusCode} ${res.statusMessage}`);
                } else if (res.headers['content-type'] && res.headers['content-type'] !== 'application/json') {
                    error = new Error("Expected json got " + res.headers['content-type'] + " instead");
                }

                if (error) {
                    error.name = "OpenID error";
                    error.statusCode = res.statusCode;
                    error.headers = res.headers;
                    error.body = body;

                    reject(error);
                }

                resolve(body);
            });
        });

        if (options.write) {
            req.write(options.write.data);
        }

        req.end();
    });
};