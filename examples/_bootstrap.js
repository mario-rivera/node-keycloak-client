const dotenv = require('dotenv-flow');
const path = require('path');

const OpenId = require('../src/OpenId');
const RestApi = require('../src/RestApi');

// load dotenv
dotenv.config({
    default_node_env: 'local',
    path: path.resolve(__dirname, '../')
});

function makeOpenIdClient (keycloakUrl)
{
    return new OpenId(keycloakUrl);
}

function makeRestApiClient (keycloakUrl, realm, clientId, clientSecret)
{
    openId = makeOpenIdClient(keycloakUrl);
    return new RestApi(openId, realm, clientId, clientSecret);
}


exports.makeOpenIdClient = makeOpenIdClient;
exports.makeRestApiClient = makeRestApiClient;
