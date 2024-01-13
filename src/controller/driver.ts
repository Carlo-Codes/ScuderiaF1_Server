import { RequestHandler } from "express"
import { DriverApiStore} from "../model/dbTypes";
import { db } from "../services/db/knexfile";

export const getDriverData : RequestHandler = async (req,res,next) => {
    try {
        const cogUser = 
        if((cogUser.Username)){
            const payload = await db<DriverApiStore>('DriverApiStore')
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
