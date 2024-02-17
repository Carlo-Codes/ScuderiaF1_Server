import { RequestHandler, Request } from "express"
import { Team, User, Driver, League, RacesApiStore, DriverApiStore, draftTeam, UserLeagueRelation } from "../model/dbTypes";
import {newLeagueRequest, getLeagueDataReq, getTeamsinLeageReq, DeleteLeagueRequest} from '../model/HTTPtypes'
import { cogSignup, cogDelUser, cogResendConfirmationCode, cogConfirmUser, cogAuthPassword} from "../services/aws-sdk/cognito";
import {checkdbRes} from '../libraries/db/checkDbResponse'
import { db } from "../services/db/knexfile";

export const newLeague : RequestHandler = async (req:Request,res,next) => {
    try {
        const leagueRequest : newLeagueRequest = req.body
        const inviteCode = crypto.randomUUID() 
        const cogEmail = req.user
       
        if(cogEmail){
            const alreadyOwenedLeagues = await db<League>('leagues').where('owner_user_id' , '=' , cogEmail.sub)
            if(alreadyOwenedLeagues.length >= 3) throw new Error('3 League maximum')
            const dbres = await db<League>('leagues').insert({ 
                owner_user_id:cogEmail.sub, 
                league_name:leagueRequest.league_name,
                inviteCode:inviteCode,
            }).returning('*')

            const addUserToLeague = await db<UserLeagueRelation>('UserLeagueRelation').insert({
                user_id:cogEmail.sub,
                league_id:dbres[0].id
            })
    
            const okMess = `${leagueRequest.league_name} succesfully added to database`
            const errMss = `${leagueRequest.league_name} couldnt be added to database`
    
            const leagueResponse = checkdbRes(dbres[0], okMess, errMss)
    
            if(leagueResponse.code) res.send(leagueResponse).status(leagueResponse.code)
        } else {
            res.status(401).send('cannot authorise')
    
        }

        



    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err.message)
            res.status(400).send(err.message)
        }
    }
}

export const deleteLeague : RequestHandler = async (req:Request,res,next) => {
    try {
        const leagueRequest : DeleteLeagueRequest = req.body
        const cogEmail = req.user
        let ownershipCheck = false;
       
        if(cogEmail){
            const alreadyOwenedLeagues = await db<League>('leagues').where('owner_user_id' , '=' , cogEmail.sub)
            for(let i = 0; i < alreadyOwenedLeagues.length; i++){
                if(alreadyOwenedLeagues[i].id === leagueRequest.leagueId ){
                    ownershipCheck = true
                }
            }
            if(ownershipCheck){
                const dbres = await db<UserLeagueRelation>('UserLeagueRelation')
                .where('league_id', '=', leagueRequest.leagueId).delete()

                const leagueDbres = await db<League>('leagues')
                .where('id', '=', leagueRequest.leagueId).delete()
                
                res.status(200).send('league deleted')
            } else {
                throw new Error('you do not own this league')
            }

        } else {
            throw new Error('unaurthorised')
    
        }


    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err.message)
            res.status(400).send(err.message)
        }
    }
}

export const getLeagueData : RequestHandler = async (req:Request,res,next) => {
    try {
        const leagueReq : getLeagueDataReq = req.body
        const cogUser = req.user
        if(cogUser){
            const payload = await db<League>('leagues')
            .where('id', '=', leagueReq.inviteCode).returning('*')
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

export const getTeamsinLeague : RequestHandler = async (req:Request,res,next) => {
    try {
        const teamsinLequeReg : getTeamsinLeageReq = req.body
        const cogUser = req.user

        if(cogUser){

            const userLeagues = await db<UserLeagueRelation>('UserLeagueRelation')
            .where('league_id', '=', teamsinLequeReg.inviteCode).returning('user_id')

            if(userLeagues.length === 0){
                throw new Error("no leagues with that invite code.")
            }

        
            let teams:Team[] = []
            for (let i = 0; i < userLeagues.length; i++){
                const team = await db<Team>('teams')
                .where('user_id', '=', userLeagues[i].user_id)
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
