import { Request, RequestHandler } from "express";
import { cogVerifyToken, } from "../../services/aws-sdk/cognitoJWTVerifier";
import { cogAuthToken } from "../../services/aws-sdk/cognito";


export const authenticateToken : RequestHandler = async (req:Request, res, next) => {
    try {
        const token = req.headers['authorization']?.split('Bearer')[1]
        if(token){
            const user = await cogVerifyToken(token)
            req.user = user
            next()
        } else throw new Error('No Token Recieved')
        
    } catch (err:unknown) {
        if(err instanceof Error){
            res.send(err.message)
        }
    }
}


export const authenticateRefreshToken : RequestHandler = async (req:Request, res, next) => {
    try {
        const token = req.headers['authorization']?.split('Bearer')[1]
        if(token){
            const auth = await cogAuthToken(token)
            req.authenticationResult = auth.AuthenticationResult
            next()
        } else {
            next()
        }
        
    } catch (err:unknown) {
        if(err instanceof Error){
            res.send(err.message)
        }
    }
}
