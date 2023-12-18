import {RequestHandler} from "express"
import { cognitoPoolData, db, verifier} from "../main";
import { Team, User, Driver, League, RacesApiStore, DriverApiStore, draftTeam, LeagueTeamRelation } from "../model/dbTypes";
import { editTeamRequest, newTeamRequest, newUserRequest, DBResponse, newLeagueRequest, authenticationRequest,confirmUserRequest, resendConfirmationCodeRequest, tokenAuthRequest, getLeagueDataReq, getTeamsinLeageReq, dataResponse, addTeamToLeagueReq } from "../model/HTTPtypes";
import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cogAuthPassword, cogAuthToken, cogConfirmUser, cogDelUser, cogGetUser, cogResendConfirmationCode, cogSignup } from "./aws-sdk/cognito";
import { Knex } from "knex";
import { apiSportsDriverRankRes, apiSportsRacesRes } from "../model/apiSportsResponseTypes";
import { randomBytes } from "node:crypto";

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

export const resendConfirmationCode : RequestHandler = async(req, res, next) => { 
    try {
        const resendReq:resendConfirmationCodeRequest = req.body
        const cogres = await cogResendConfirmationCode(resendReq.email,cognitoPoolData.ClientId)
        res.send(cogres).status(200)  
    
    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err)
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
            const cogRes = await cogAuthPassword(authDetails.email, authDetails.password,cognitoPoolData.ClientId, cognitoPoolData.UserPoolId)
            res.send(cogRes)
        }

 
    } catch (err:unknown) { 
        if(err instanceof Error){
            console.log(err)
            res.send(err.message).status(400)
        }
    }
    
}

export const newTeam : RequestHandler = async (req, res, next) => {
    try {
        const teamRequest:newTeamRequest = req.body
        const payload = await cogGetUser(teamRequest.token)
        const cogEamil = payload.UserAttributes![2].Value
        const user = await db<User>('users').where('email',cogEamil)
        const dbres = await db<Team>('teams').insert({
            team_name:teamRequest.team_name,
            user_id:user[0].id,
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
        const inviteCode = crypto.randomUUID()
        const payload = await cogGetUser(leagueRequest.token)
        const cogEamil = payload.UserAttributes![2].Value
        const user = await db<User>('users').where('email',cogEamil)
        const dbres = await db<League>('leagues').insert({
            owner_user_id:user[0].id,
            league_name:leagueRequest.league_name,
            inviteCode:inviteCode,
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

export const refreshToken : RequestHandler = async (req,res,next) => {
    try {
        const token:tokenAuthRequest = req.body
            if(cognitoPoolData.ClientId && cognitoPoolData.UserPoolId){
                const result = await cogAuthToken(token.token,cognitoPoolData.ClientId,cognitoPoolData.UserPoolId)
                res.send(result).status(200)
            }
    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err)
            res.send(err.message).status(400)
        }
    }
}

export const updateTeam: RequestHandler = async (req,res,next) => {
    try {
        const editTeamReq : editTeamRequest = req.body
        const payload = await cogGetUser(editTeamReq.token)
        const cogEamil = payload.UserAttributes![2].Value
        const dbres = await db<draftTeam>('draftTeams')
            .where('id', '=', editTeamReq.teamId).returning('*')
            .update({ 
                team_name: editTeamReq.team_name,
                tier1_driver_id:editTeamReq.tier1_driver_id,
                tier2_driver_id:editTeamReq.tier2_driver_id,
                tier3_driver_id:editTeamReq.tier3_driver_id,
                dnf_driver_id:editTeamReq.dnf_driver_id, 
                league_id:editTeamReq.league_id,
                competion_id:editTeamReq.competion_id
            }).returning('*')
        res.send(`${editTeamReq.team_name} was succesfully updated`).status(200)
    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err)
            res.send(err.message).status(400)
        }
    }
}

export const getData : RequestHandler = async (req,res,next) => {
    try {
        const authReq : tokenAuthRequest = req.body
        const reqUser = await cogGetUser(authReq.token)
        const cogEamil = reqUser.UserAttributes![2].Value
        if(reqUser.Username){
            const user = await db<User>('users').where('email',cogEamil)
            const dbRaceData = await db<RacesApiStore>('RacesApiStore')
            .where('id', '=','1').returning('*')
            const dbDriverData = await db<DriverApiStore>('DriverApiStore')
            .where('id', '=','1').returning('*')
            const draftTeams = await db<draftTeam>('draftTeams')
            .where('user_id', '=', user[0].id)
            .returning('*')
            const teams = await db<Team>('teams')
            .where('user_id', '=', user[0].id)
            .returning('*')

            const raceData = dbRaceData[0].response.response as apiSportsRacesRes[]
            const driverData = dbDriverData[0].response.response as apiSportsDriverRankRes[]

            const response:dataResponse ={
                raceData:raceData,
                driverData:driverData,
                userDraftTeams:draftTeams,
                userTeams:teams,
            } 
            res.send(response)

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


//depricated
export const getRaceData : RequestHandler = async (req,res,next) => {
    try {
        const authReq : tokenAuthRequest = req.body
        const cogUser = await cogGetUser(authReq.token)
        if(cogUser.Username){
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

export const getDriverData : RequestHandler = async (req,res,next) => {
    try {
        const authReq : tokenAuthRequest = req.body
        const cogUser = await cogGetUser(authReq.token)
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

export const getUserDraftTeams : RequestHandler = async (req, res, next) => {
    try {
        const draftTeamReq : tokenAuthRequest = req.body
        const reqUser = await cogGetUser(draftTeamReq.token)
        const cogEamil = reqUser.UserAttributes![2].Value
        if(reqUser.Username){
            const user = await db<User>('users').where('email',cogEamil)
            const payload = await db<draftTeam>('draftTeams')
            .where('user_id', '=', user[0].id)
            .returning('*')
            res.send(payload)
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

export const getUserTeams : RequestHandler = async (req, res, next) => {
    try {
        const draftTeamReq : tokenAuthRequest = req.body
        const reqUser = await cogGetUser(draftTeamReq.token)
        const cogEamil = reqUser.UserAttributes![2].Value
        if(reqUser.Username){
            const user = await db<User>('users').where('email',cogEamil)
            const payload = await db<Team>('teams')
            .where('user_id', '=', user[0].id)
            .returning('*')
            res.send(payload)
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
//

export const getLeagueData : RequestHandler = async (req,res,next) => {
    try {
        const leagueReq : getLeagueDataReq = req.body
        const cogUser = await cogGetUser(leagueReq.token)
        if(cogUser.Username){
            const payload = await db<League>('leagues')
            .where('inviteCode', '=', leagueReq.inviteCode).returning('*')
            res.send(payload[0])            
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

export const getTeamsinLeague : RequestHandler = async (req,res,next) => {
    try {
        const teamsinLequeReg : getTeamsinLeageReq = req.body
        const cogUser = await cogGetUser(teamsinLequeReg.token)

        if(cogUser.Username){

            const leagueTeamsIds = await db<LeagueTeamRelation>('leagueTeamRelation')
            .where('league_inviteCode', '=', teamsinLequeReg.inviteCode).returning('team_id')

            if(leagueTeamsIds.length === 0){
                throw new Error("no leagues with that invite code.")
            }

        
            let teams:Team[] = []
            for (let i = 0; i < leagueTeamsIds.length; i++){
                const team = await db<Team>('teams')
                .where('id', '=', leagueTeamsIds[i].team_id)
                .returning('*')
                teams.push(team[0])
            }
            
            res.send(teams)
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

export const joinTeamToLeague : RequestHandler = async (req, res, next) => {
    try {

        const joinTeamReq : addTeamToLeagueReq = req.body
        const reqUser = await cogGetUser(joinTeamReq.token)
        const cogEamil = reqUser.UserAttributes![2].Value
        const teamLeague = await db<LeagueTeamRelation>('leagueTeamRelation')
        .where('team_id', '=', joinTeamReq.teamId).returning('*')
        if(reqUser.Username){
            if(!teamLeague[0]){
                const user = await db<User>('users').where('email',cogEamil)

                const team = await db<Team>('teams')
                .where('id', '=', joinTeamReq.teamId)
                
                if (team[0].user_id != user[0].id){
                    throw new Error('error, this is not your team')
                }

                const league = await db<League>('leagues')
                .where('inviteCode', '=', joinTeamReq.inviteCode).returning('*')

                if(!league[0]){
                    throw new Error("League invite not valid")
                } else{
                    const dbres = await db<LeagueTeamRelation>('leagueTeamRelation')
                    .insert({
                        team_id:joinTeamReq.teamId,
                        league_inviteCode:joinTeamReq.inviteCode,
                        
                    })
                    res.send(`Team Added to ${league[0].league_name}`)
                }

    
            } else{
                throw new Error("Relationship already exists")
            }
            

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


