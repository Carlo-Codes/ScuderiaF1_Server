import { env } from 'process';
import app from './server'
import 'dotenv/config'
import { createUserTable, createTeamsTable, createDriverTable, createLeagesTable, createRacesApiStore, createDriverApiStore } from './db/dbSetup';
import knex, { Knex } from 'knex';

import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import {CognitoJwtVerifier} from "aws-jwt-verify"

import {updateRacesApiStore} from './data/dataPosting'

let config = require('./db/knexfile')


export const cognitoClient = new CognitoIdentityProviderClient({region:env.REGION})

export const cognitoPoolData = {
    UserPoolId: env.POOL_ID,
    ClientId: env.CLIENT_ID,
 }

export const verifier = CognitoJwtVerifier.create({
    userPoolId:env.POOL_ID!,
    clientId:env.CLIENT_ID!,
    tokenUse:"access"
})

const port = env.PORT
export const db = knex(config.development)

console.log("hello from the server")

app.listen(port,()=>{
    console.log("server running on port :")
    console.log(port)
})

//updateRacesApiStore()
/* 
createUserTable();
createDriverTable();
createLeagesTable();
createTeamsTable(); 
createRacesApiStore();
 */
createDriverApiStore();