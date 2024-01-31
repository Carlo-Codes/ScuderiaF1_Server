import {RequestHandler, Request}  from "express"
import { Team, User, Driver, League, RacesApiStore, DriverApiStore, draftTeam, LeagueTeamRelation } from "../model/dbTypes";
import {newTeamRequest, editTeamRequest, tokenAuthRequest, addTeamToLeagueReq} from '../model/HTTPtypes'
import { cogSignup, cogDelUser, cogResendConfirmationCode, cogConfirmUser, cogAuthPassword} from "../services/aws-sdk/cognito";
import {checkdbRes} from '../libraries/db/checkDbResponse'
import { db } from "../services/db/knexfile";


export const newTeam : RequestHandler = async (req:Request, res, next) => {
    try {
        const teamRequest:newTeamRequest = req.body
        const cogEamil = req.user
        if(cogEamil){
            const dbres = await db<Team>('teams').insert({

                user_id:cogEamil?.sub,
                tier1_driver_id:teamRequest.tier1_driver_id,
                tier2_driver_id:teamRequest.tier2_driver_id,
                tier3_driver_id:teamRequest.tier3_driver_id,
                competition_id:teamRequest.competition_id,
                dnf_driver_id:teamRequest.dnf_driver_id,
            }).returning('*')

            
            const okMess = `succesfully added to database`
            const errMss = `couldnt be added to database`
            const teamResponse = checkdbRes(dbres[0], okMess, errMss)

            if(teamResponse.code) res.send(teamResponse).status(teamResponse.code)
        
    
        }



    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err.message)
            res.send(err.message).status(400)
        }
    }

    next()
    
}

export const updateTeam: RequestHandler = async (req:Request,res,next) => {
    try {
        const editTeamReq : newTeamRequest = req.body
        const cogEamil = req.user
        const dbres = await db<Team>('teams')
            .where('competition_id', '=', editTeamReq.competition_id).returning('*')
            .update({ 
                tier1_driver_id:editTeamReq.tier1_driver_id,
                tier2_driver_id:editTeamReq.tier2_driver_id,
                tier3_driver_id:editTeamReq.tier3_driver_id,
                dnf_driver_id:editTeamReq.dnf_driver_id, 
                league_id:editTeamReq.league_id,
            }).returning('*')
        res.send(`${editTeamReq.competition_id} was succesfully updated`).status(200)
    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err)
            res.send(err.message).status(400)
        }
    }
}

export const getUserDraftTeams : RequestHandler = async (req:Request, res, next) => {
    try {
        const draftTeamReq : tokenAuthRequest = req.body
        const cogEamil = req.user
        if(cogEamil){
            const user = await db<User>('users').where('email',cogEamil.sub)
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

export const getUserTeams : RequestHandler = async (req:Request, res, next) => {
    try {
        const draftTeamReq : tokenAuthRequest = req.body
        const cogEamil = req.user
        if(cogEamil){
            const user = await db<User>('users').where('email',cogEamil.sub)
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

export const joinTeamToLeague : RequestHandler = async (req:Request, res, next) => {
    try {

        const joinTeamReq : addTeamToLeagueReq = req.body
        const cogEamil = req.user
        const teamLeague = await db<LeagueTeamRelation>('leagueTeamRelation')
        .where('team_id', '=', joinTeamReq.teamId).returning('*')
        if(cogEamil){
            if(!teamLeague[0]){


                const team = await db<Team>('teams')
                .where('id', '=', joinTeamReq.teamId)
                
                if (team[0].user_id != cogEamil.username){
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
                        league_id:joinTeamReq.inviteCode,
                        
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
