import { AdminDeleteUserCommand, AdminInitiateAuthCommand, AuthFlowType, ConfirmSignUpCommand, GetUserCommand, InitiateAuthCommand, ResendConfirmationCodeCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, cognitoPoolData } from "../../main";
import { env } from 'process';
import {CognitoJwtVerifier} from "aws-jwt-verify"




export function cogSignup (clientId:string|undefined, username:string, password:string, email:string ){
    const command = new SignUpCommand({
        ClientId:clientId,
        Username:username,
        Password:password,
        UserAttributes:[{Name:"email", Value:email}]
    })

    return cognitoClient.send(command)
} 

export function cogDelUser(username:string, userPoolId:string|undefined){
    const command = new AdminDeleteUserCommand({
        UserPoolId:userPoolId,
        Username:username
    })

    return cognitoClient.send(command)
}

export function cogConfirmUser(username:string, code:string, clientId:string|undefined){
    const command = new ConfirmSignUpCommand({
        ClientId:clientId,
        Username:username,
        ConfirmationCode:code
    })
    
    return cognitoClient.send(command)
}

export function cogResendConfirmationCode(username:string,  clientId:string|undefined){
    const command = new ResendConfirmationCodeCommand({
        ClientId:clientId,
        Username:username
    })

    return cognitoClient.send(command)
}

export function cogAuthPassword(username:string, password:string, clientId:string, userPoolId:string,){
    const command = new InitiateAuthCommand({
        ClientId:clientId,
        AuthFlow:AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters:{
            USERNAME:username,
            PASSWORD:password,
            //SECRET_HASH:env.SECRET_HASH!
        }
    })


    return cognitoClient.send(command)
}

export function cogAuthToken(token:string, clientId:string, userPoolId:string,){
    const command = new InitiateAuthCommand({
        ClientId:clientId,
        AuthFlow:AuthFlowType.REFRESH_TOKEN,
        AuthParameters:{
            REFRESH_TOKEN:token,
            //SECRET_HASH:env.SECRET_HASH!
        }
    })

    return cognitoClient.send(command)
}


export function cogGetUser(token:string){
    const command = new GetUserCommand({
        AccessToken:token
    })

    return cognitoClient.send(command)
}


