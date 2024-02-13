import {RequestHandler, Request}  from "express"
import { Team, User, Driver, League, RacesApiStore, DriverApiStore, draftTeam, UserLeagueRelation } from "../model/dbTypes";
import {newTeamRequest, editTeamRequest, tokenAuthRequest, addUserToLeagueReq} from '../model/HTTPtypes'
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
                fastest_lap_driver_id:teamRequest.fastest_lap_driver_id,
                dnf_driver_id:teamRequest.dnf_driver_id,
            }).returning('*')
            res.send(dbres).status(200)
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
            .where('competition_id', '=', editTeamReq.competition_id).andWhere('user_id' , '=', cogEamil?.sub as string).returning('*')
            .update({ 
                tier1_driver_id:editTeamReq.tier1_driver_id,
                tier2_driver_id:editTeamReq.tier2_driver_id,
                tier3_driver_id:editTeamReq.tier3_driver_id,
                dnf_driver_id:editTeamReq.dnf_driver_id,
                fastest_lap_driver_id:editTeamReq.fastest_lap_driver_id, 
            }).returning('*')
        res.send(dbres).status(200)
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

export const joinUserToLeague : RequestHandler = async (req:Request, res, next) => {
    try {

        const joinTeamReq : addUserToLeagueReq = req.body
        const cogEamil = req.user

        if(cogEamil){
            const UserLeague = await db<UserLeagueRelation>('UserLeagueRelation')
            .where('user_id', '=', cogEamil.sub).returning('*')
            if(!UserLeague[0]){

                    const LeagueId = await db<League>('leagues')
                    .where('inviteCode', '=', joinTeamReq.inviteCode).returning('*')

                    if(LeagueId[0]){
                        const dbres = await db<UserLeagueRelation>('leagueTeamRelation')
                        .insert({
                            user_id:cogEamil.username,
                            league_id:LeagueId[0].id,
                            
                        })
                        res.send(`Team Added to ${LeagueId[0]}`)
    
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
