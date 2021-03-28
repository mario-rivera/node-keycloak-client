const { makeRestApiClient } = require('./_bootstrap');

const restApi = makeRestApiClient(
    new URL(process.env.KEYCLOAK_URL),
    process.env.KEYCLOAK_REALM,
    process.env.ADMIN_CLIENT_ID,
    process.env.ADMIN_CLIENT_SECRET
);

userId = "3cdced26-c924-4c72-bc59-6d1f21eca858";

restApi.updateUser(userId, {
    firstName: "Mr",
    lastName: "Foo"
}).then(console.log).catch(console.error);