const _accessTokenExpires = Symbol('accessTokenExpires');
const _refreshTokenExpires = Symbol('refreshTokenExpires');

module.exports = class AuthToken
{
    /** @type {string|null} */
    access_token = null;

    /** @type {int|null} */
    expires_in = null;

    /** @type {string|null} */
    refresh_token = null;

    /** @type {int|null} */
    refresh_expires_in = null;

    /** @type {string|null} */
    token_type = null;

    /** @type {string|null} */
    scope = null;

    /** @type {int|null} */
    'not-before-policy' = null;

    constructor(token)
    {
        Object.assign(this, token);
        
        this[_accessTokenExpires] = new Date(Date.now() + (token.expires_in * 1000));
        if (token.refresh_expires_in) {
            this[_refreshTokenExpires] = new Date(Date.now() + (token.refresh_expires_in * 1000));
        }
    }

    /** @returns {boolean} */
    hasAccessExpired()
    {
        return Date.now() > this[_accessTokenExpires].getTime();
    }
    
    /** @returns {string} */
    getAccessToken()
    {
        return this.access_token;
    }

    /** @returns {string|null} */
    getRefreshToken()
    {
        return this.refresh_token ?? null;
    }

    /** @returns {string} */
    getTokenType()
    {
        return this.token_type;
    }

    /** @returns {string} */
    getScope()
    {
        return this.scope;
    }
}
