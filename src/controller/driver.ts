import { RequestHandler, Request } from "express"
import { DriverApiStore} from "../model/dbTypes";
import { db } from "../services/db/knexfile";

export const getDriverData : RequestHandler = async (req:Request,res,next) => {
    try {
        const cogUser = req.user
        if((cogUser)){
            const payload = await db<DriverApiStore>('DriverApiStore')
            .where('id', '=','1').returning('*')
            res.send(payload[0].response.response)            
        } else {
            res.status(401).send('cannot authorise')
        }
    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err)
            res.status(400).send(err.message)
        }
    }
}
