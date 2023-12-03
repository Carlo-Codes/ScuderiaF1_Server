import {RequestHandler} from "express"
import { cognitoPoolData, db } from "../main";
import { Team, User, Driver, League } from "../model/dbTypes";
import { newTeamRequest, newUserRequest, DBResponse, newLeagueRequest, authenticationRequest,confirmUserRequest } from "../model/HTTPtypes";
import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cogAuthPassword, cogConfirmUser, cogDelUser, cogSignup } from "./aws-sdk/cognito";


export const ping : RequestHandler = async  (req, res, next) => {
    res.send("pong");
    console.log("pong")
}

function checkdbRes(dbres:User|Driver|Team|League, okMess:string, errMess:string):DBResponse{
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

export const newUser : RequestHandler = async (req, res, next) => {
    try {
        const userRequest:newUserRequest = req.body
        const userEmail = userRequest.email
        const okMess = `${userEmail} succesfully added to database`
        const errMss = `${userEmail} couldnt be added to database`

        const cogRes = await cogSignup(cognitoPoolData.ClientId,userEmail,userRequest.password,userEmail);

        if(cogRes.UserSub){
            const dbres = await db<User>('users').insert({email:userEmail}).returning('*')
            const newUserRes = checkdbRes(dbres[0],okMess, errMss)
            if(newUserRes.code = 200){
                res.send(newUserRes.message).status(newUserRes.code)
            }else{
                const cogDelRes = await cogDelUser(userEmail,cognitoPoolData.UserPoolId)
            }
        }

    } catch (err:unknown) {
        if(err instanceof Error){

            console.log(err.message)
            res.send(err.message).status(400)
        }
    }
    next(); 
}

export const confirmUser : RequestHandler = async (req, res, next) => {
    try {
        const confirmReq:confirmUserRequest = req.body
        const cogRes = await cogConfirmUser(confirmReq.email, confirmReq.code, cognitoPoolData.ClientId)
        res.send(cogRes).status(200)
    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err)
            res.send(err.message).status(400)
        }
    }
}

export const authenticateUser : RequestHandler = async (req, res,next) => {
    try {
        const authDetails:authenticationRequest = req.body
        if(cognitoPoolData.ClientId && cognitoPoolData.UserPoolId){
            const cogRes = await cogAuthPassword(authDetails.username, authDetails.username,cognitoPoolData.ClientId, cognitoPoolData.UserPoolId)
        }

    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err.message)
            res.send(err.message).status(400)
        }
    }
    
}

export const newTeam : RequestHandler = async (req, res, next) => {
    try {
        const teamRequest:newTeamRequest = req.body
        //test webtoken here infor now ill just make up a userid
        const dbres = await db<Team>('teams').insert({
            team_name:teamRequest.team_name,
            user_id:1,
            tier1_driver_id:teamRequest.tier1_driver_id,
            tier2_driver_id:teamRequest.tier2_driver_id,
            tier3_driver_id:teamRequest.tier3_driver_id,
            dnf_driver_id:teamRequest.dnf_driver_id,
        }).returning('*')


        const okMess = `${teamRequest.team_name} succesfully added to database`
        const errMss = `${teamRequest.team_name} couldnt be added to database`
        const teamResponse = checkdbRes(dbres[0], okMess, errMss)

        if(teamResponse.code) res.send(teamResponse).status(teamResponse.code)
        

    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err.message)
            res.send(err.message).status(400)
        }
    }

    next()
    
}

export const newLeague : RequestHandler = async (req,res,next) => {
    try {
        const leagueRequest : newLeagueRequest = req.body
        //test webtoken here infor now ill just make up a userid
        const dbres = await db<League>('leagues').insert({
            user_id:1,
            league_name:leagueRequest.league_name
        }).returning('*')

        const okMess = `${leagueRequest.league_name} succesfully added to database`
        const errMss = `${leagueRequest.league_name} couldnt be added to database`

        const leagueResponse = checkdbRes(dbres[0], okMess, errMss)

        if(leagueResponse.code) res.send(leagueResponse).status(leagueResponse.code)


    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err.message)
            res.send(err.message).status(400)
        }
    }
}

