const dotenv = require('dotenv-flow');
const path = require('path');

const OpenId = require('../src/OpenId');
const RestApi = require('../src/RestApi');

// load dotenv
dotenv.config({
    default_node_env: 'local',
    path: path.resolve(__dirname, '..')
});

const realm = process.env.KEYCLOAK_REALM;
const clientId = process.env.ADMIN_CLIENT_ID;
const clientSecret = process.env.ADMIN_CLIENT_SECRET;

const openId = new OpenId(new URL(process.env.KEYCLOAK_URL));
const restApi = new RestApi(openId, realm, clientId, clientSecret);

restApi.getUsers({briefRepresentation: true}).then(console.log);
