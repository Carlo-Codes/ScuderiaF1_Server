import { RequestHandler } from "express";
import { cogVerifyToken } from "../../services/aws-sdk/cognitoJWTVerifier";

export const authenticateToken : RequestHandler = async (req, res, next) => {
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