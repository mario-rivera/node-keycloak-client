const { makeRestApiClient } = require('./_bootstrap');

const restApi = makeRestApiClient(
    new URL(process.env.KEYCLOAK_URL),
    process.env.KEYCLOAK_REALM,
    process.env.ADMIN_CLIENT_ID,
    process.env.ADMIN_CLIENT_SECRET
);

restApi.getUsers({briefRepresentation: true}).then(console.log).catch(console.error);

