import { AdminDeleteUserCommand, AdminInitiateAuthCommand, AuthFlowType, ConfirmSignUpCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "../../main";
import { env } from 'process';

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

export function cogAuthPassword(username:string, password:string, clientId:string, userPoolId:string,){
    const command = new AdminInitiateAuthCommand({
        UserPoolId:userPoolId,
        ClientId:clientId,
        AuthFlow:AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters:{
            USERNAME:username,
            PASSWORD:password,
            SECRET_HASH:env.SECRET_HASH!
        }
    })

    return cognitoClient.send(command)
}

export function cogAuthToken(token:string, clientId:string, userPoolId:string,){
    const command = new AdminInitiateAuthCommand({
        UserPoolId:userPoolId,
        ClientId:clientId,
        AuthFlow:"REFRESH_TOKEN_AUTH",
        AuthParameters:{
            REFRESH_TOKEN:token,
            SECRET_HASH:env.SECRET_HASH!
        }
    })

    return cognitoClient.send(command)
}



