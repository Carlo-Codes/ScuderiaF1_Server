import { RequestHandler } from "express"
import { Team, User, Driver, League, RacesApiStore, DriverApiStore, draftTeam, LeagueTeamRelation } from "../model/dbTypes";
import {newUserRequest, resendConfirmationCodeRequest, confirmUserRequest, authenticationRequest} from '../model/HTTPtypes'
import { cogSignup, cogDelUser, cogResendConfirmationCode, cogConfirmUser, cogAuthPassword} from "../services/aws-sdk/cognito";
import {checkdbRes} from '../libraries/db/checkDbResponse'
import { db } from "../services/db/knexfile";

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
