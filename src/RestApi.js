const http = require('http');
const AuthToken = require('./AuthToken');

const _realm = Symbol('realm');
const _clientId = Symbol('clientId');
const _clientSecret = Symbol('clientSecret');

module.exports = class RestApi
{
    /** @type {import('./OpenId')} */
    openId;

    /** @type {AuthToken} */
    authToken;

    constructor(openId, realm, clientId, clientSecret) {
        this.openId = openId;
        this[_realm] = realm;
        this[_clientId] = clientId;
        this[_clientSecret] = clientSecret;
    }

    /**
     * @link https://www.keycloak.org/docs-api/12.0/rest-api/index.html#_users_resource
     * 
     * @param {any} query 
     * @returns {Promise<any>} List of users 
     */
    getUsers(query)
    {
        const url = new URL(`/auth/admin/realms/${this[_realm]}/users`, this.openId.getUrl());
        if (query) {
            url.search = (new URLSearchParams(query)).toString();
        }

        let options = {
            method: 'GET',
            path: `${url.pathname}${url.search}`,
        };

        return adminRequest.call(this, options).then(JSON.parse);
    }

    /**
     * @link https://www.keycloak.org/docs-api/12.0/rest-api/index.html#_users_resource
     * 
     * @param {any} userRepresentation 
     * @returns {Promise<any>}
     */
    createUser(userRepresentation)
    {
        const json = JSON.stringify(userRepresentation);

        let options = {
            method: 'POST',
            path: `/auth/admin/realms/${this[_realm]}/users`,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            },
            write: {
                data: json
            }
        };

        return adminRequest.call(this, options).then(JSON.parse);
    }

    /**
     * @link https://www.keycloak.org/docs-api/12.0/rest-api/index.html#_users_resource
     * 
     * @param {string} id 
     * @param {any} userRepresentation 
     * @returns {Promise<any>}
     */
    updateUser(id, userRepresentation)
    {
        const json = JSON.stringify(userRepresentation);

        let options = {
            method: 'PUT',
            path: `/auth/admin/realms/${this[_realm]}/users/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            },
            write: {
                data: json
            }
        };

        return adminRequest.call(this, options).then(JSON.parse);
    }
}


/**
 * @this RestApi
 * @param {import('http').RequestOptions} options 
 * @returns {Promise<string>} The response body
 */
async function adminRequest(options)
{
    token = this.authToken;
    if (!token || token.hasAccessExpired()) {
        this.authToken = await this.openId.clientCredentials(this[_realm], this[_clientId], this[_clientSecret]);
    }

    options.headers = options.headers ?? {};
    options.headers['Authorization'] = `Bearer ${this.authToken.getAccessToken()}`;

    return request(this.openId.getUrl(), options);
}

/**
 * @param {URL} url 
 * @param {import('http').RequestOptions} options
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
                    error = new Error(`${res.statusCode} ${res.statusMessage}`);
                } else if (res.headers['content-type'] && res.headers['content-type'] !== 'application/json') {
                    error = new Error("Expected json got " + res.headers['content-type'] + " instead");
                }

                if (error) {
                    error.name = "Admin REST error";
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