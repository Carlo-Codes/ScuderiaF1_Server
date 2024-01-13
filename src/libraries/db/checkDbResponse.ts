import { Team, User, Driver, League} from "../../model/dbTypes";
import {DBResponse} from "../../model/HTTPtypes";

//hate that i made this, will replace if i get time 

export function checkdbRes(dbres:User|Driver|Team|League, okMess:string, errMess:string):DBResponse{
    const res : DBResponse = {}
    if(dbres.id){
        res.message = okMess
        res.code = 200
        res.row = dbres

    }else{
        res.message = errMess
        res.code = 400
    }
    return res

}