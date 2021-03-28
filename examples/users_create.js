const { makeRestApiClient } = require('./_bootstrap');

const restApi = makeRestApiClient(
    new URL(process.env.KEYCLOAK_URL),
    process.env.KEYCLOAK_REALM,
    process.env.ADMIN_CLIENT_ID,
    process.env.ADMIN_CLIENT_SECRET
);

restApi.createUser({
    enabled: true,
    username: 'foo',
    email: 'bar@foomail.com',
    emailVerified: false,
    credentials: [
        {
            type: 'password',
            value: 'bar',
            temporary: false
        }
    ]
}).then(console.log).catch(console.error);
