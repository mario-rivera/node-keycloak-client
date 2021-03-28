const tokenMap = new WeakMap();

module.exports = class AuthToken
{
    /** @type {Date|null} */
    accessTokenExpires;

    /** @type {Date|null} */
    refreshTokenExpires;

    constructor(token)
    {
        tokenMap.set(this, token);
        
        this.accessTokenExpires = new Date(Date.now() + (token.expires_in * 1000));
        if (token.refresh_expires_in) {
            this.refreshTokenExpires = new Date(Date.now() + (token.refresh_expires_in * 1000));
        }
    }

    /** @returns {boolean} */
    hasAccessExpired()
    {
        return Date.now() > this.accessTokenExpires.getTime();
    }
    
    /** @returns {string} */
    getAccessToken()
    {
        return tokenMap.get(this).access_token;
    }

    /** @returns {string|null} */
    getRefreshToken()
    {
        return tokenMap.get(this).refresh_token ?? null;
    }

    /** @returns {string} */
    getTokenType()
    {
        return tokenMap.get(this).token_type;
    }

    /** @returns {string} */
    getScope()
    {
        return tokenMap.get(this).scope;
    }
}
