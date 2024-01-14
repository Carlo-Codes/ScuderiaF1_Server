import { RequestHandler, Request } from "express"
import {RacesApiStore} from "../model/dbTypes";
import { db } from "../services/db/knexfile";

export const getRaceData : RequestHandler = async (req:Request,res,next) => {
    try {
        
        const cogUser = req.user
        if(cogUser){
            const payload = await db<RacesApiStore>('RacesApiStore')
            .where('id', '=','1').returning('*')
            res.send(payload[0].response.response)        
        } else {
            res.send('cannot authorise').status(401)
        }
    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err)
            res.send(err.message).status(400)
        }
    }
}