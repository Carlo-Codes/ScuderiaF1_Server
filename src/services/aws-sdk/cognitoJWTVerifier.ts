import {CognitoJwtVerifier} from "aws-jwt-verify"
import { Jwt, CognitoAccessTokenPayload } from "aws-jwt-verify/jwt-model";
import { env } from 'process';

export const verifier = CognitoJwtVerifier.create({
    userPoolId:env.POOL_ID!,
    clientId:env.CLIENT_ID!,
    tokenUse:"access"
})


export async function cogVerifyToken(token:string):Promise<CognitoAccessTokenPayload>{
    const payload = await verifier.verify(token)
    return(payload)
}

