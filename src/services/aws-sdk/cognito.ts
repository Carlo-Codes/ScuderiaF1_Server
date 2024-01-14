import { AdminDeleteUserCommand, AdminInitiateAuthCommand, AuthFlowType, ConfirmSignUpCommand, GetUserCommand, InitiateAuthCommand, ResendConfirmationCodeCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { env } from 'process';

export const cognitoClient = new CognitoIdentityProviderClient({region:env.REGION})
export const cognitoPoolData = { 
    UserPoolId: env.POOL_ID,
    ClientId: env.CLIENT_ID,
 }


export function cogSignup (username:string, password:string, email:string ){
    const command = new SignUpCommand({
        ClientId:cognitoPoolData.ClientId,
        Username:username,
        Password:password,
        UserAttributes:[{Name:"email", Value:email}]
    })

    return cognitoClient.send(command)
} 

export function cogDelUser(username:string){
    const command = new AdminDeleteUserCommand({
        UserPoolId:cognitoPoolData.UserPoolId,
        Username:username
    })

    return cognitoClient.send(command)
}

export function cogConfirmUser(username:string, code:string){
    const command = new ConfirmSignUpCommand({
        ClientId:cognitoPoolData.ClientId,
        Username:username,
        ConfirmationCode:code
    })
    
    return cognitoClient.send(command)
}

export function cogResendConfirmationCode(username:string){
    const command = new ResendConfirmationCodeCommand({
        ClientId:cognitoPoolData.ClientId,
        Username:username
    })

    return cognitoClient.send(command)
}

export function cogAuthPassword(username:string, password:string){
    const command = new InitiateAuthCommand({
        ClientId:cognitoPoolData.ClientId,
        AuthFlow:AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters:{
            USERNAME:username,
            PASSWORD:password,
            //SECRET_HASH:env.SECRET_HASH!
        }
    })


    return cognitoClient.send(command)
}

export function cogAuthToken(token:string){
    const command = new InitiateAuthCommand({
        ClientId:cognitoPoolData.ClientId,
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


