const { makeOpenIdClient } = require('./_bootstrap');

const openId = makeOpenIdClient(
    new URL(process.env.KEYCLOAK_URL)
);

openId.clientCredentials(
    process.env.KEYCLOAK_REALM, 
    process.env.ADMIN_CLIENT_ID, 
    process.env.ADMIN_CLIENT_SECRET
).then(console.log).catch(console.error);
