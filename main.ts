import { env } from 'process';
import app from './server'
import 'dotenv/config'
import { createUserTable, createTeamsTable, createDriverTable, createLeagesTable } from './db/dbSetup';
import knex, { Knex } from 'knex';

import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';


let config = require('./db/knexfile')


/* AWS.config.update({
    region: env.REGION
}) */

export const cognitoClient = new CognitoIdentityProviderClient({region:env.REGION})

export const cognitoPoolData = {
    UserPoolId: env.POOL_ID,
    ClientId: env.CLIENT_ID,
 }

const port = env.PORT
export const db = knex(config.development)




console.log("hello from the server")


app.listen(port,()=>{
    console.log("server running on port :")
    console.log(port)
})

/* createUserTable();
createDriverTable();
createLeagesTable();
createTeamsTable();
 */