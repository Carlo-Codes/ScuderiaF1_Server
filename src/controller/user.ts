import { RequestHandler } from "express"
import {apiSportsRacesRes, apiSportsDriverRankRes, } from '../model/apiSportsResponseTypes'
import { Team, User, Driver, League, RacesApiStore, DriverApiStore, draftTeam, LeagueTeamRelation } from "../model/dbTypes";
import {newUserRequest, resendConfirmationCodeRequest, confirmUserRequest, authenticationRequest, dataResponse, tokenAuthRequest} from '../model/HTTPtypes'
import { cogSignup, cogDelUser, cogResendConfirmationCode, cogConfirmUser, cogAuthPassword, cogAuthToken} from "../services/aws-sdk/cognito";
import {checkdbRes} from '../libraries/db/checkDbResponse'
import { db } from "../services/db/knexfile";


export const newUser : RequestHandler = async (req, res, next) => {
    try {
        const userRequest:newUserRequest = req.body
        const userEmail = userRequest.email
        const okMess = `${userEmail} succesfully added to database`
        const errMss = `${userEmail} couldnt be added to database`

        const cogRes = await cogSignup(userEmail,userRequest.password,userEmail);

        if(cogRes.UserSub){
            const dbres = await db<User>('users').insert({email:userEmail}).returning('*')
            const newUserRes = checkdbRes(dbres[0],okMess, errMss)
            if(newUserRes.code = 200){
                res.send(cogRes).status(newUserRes.code)
            }else{
                const cogDelRes = await cogDelUser(userEmail)
            }
        } 

    } catch (err:unknown) { 
        if(err instanceof Error){

            console.log(err.message)
            res.status(400).send(err.message)
        }
    }

}

export const resendConfirmationCode : RequestHandler = async(req, res, next) => { 
    try {
        const resendReq:resendConfirmationCodeRequest = req.body
        const cogres = await cogResendConfirmationCode(resendReq.email)
        res.send(cogres).status(200)  
    
    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err)
            res.send(err.message).status(400)
        }    
    }

}

export const confirmUser : RequestHandler = async (req, res, next) => {
    try {
        const confirmReq:confirmUserRequest = req.body
        const cogRes = await cogConfirmUser(confirmReq.email, confirmReq.code)
        res.send(cogRes).status(200)
    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err)
            res.status(400).send(err.message)
        }
    }
}

export const authenticateUser : RequestHandler = async (req, res,next) => {
    try {
        const authDetails:authenticationRequest = req.body
        const cogRes = await cogAuthPassword(authDetails.email, authDetails.password)
        res.send(cogRes)

 
    } catch (err:unknown) { 
        if(err instanceof Error){
            res.status(400).send(err.message)
        }
    }
    
}

export const getData : RequestHandler = async (req,res,next) => {
    try {
        const token = req.headers['authorization']?.split('Bearer')[1]
        console.log(token)
        const cogEamil = req.user
        if(cogEamil){
            const user = await db<User>('users').where('email',cogEamil.username)
            console.log(user)
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
                userLeagues:[],
                participatingLeague:[],
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

export const refreshToken : RequestHandler = async (req,res,next) => {
    try {
        const token:tokenAuthRequest = req.body
        const result = await cogAuthToken(token.token)
        res.send(result).status(200)
            
    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err)
            res.send(err.message).status(400)
        }
    }
}
