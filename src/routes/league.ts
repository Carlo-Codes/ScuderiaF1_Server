import express from "express"
import * as Controller from "../controller/league"
import {authenticateToken} from '../controller/middleware/auth'

export let leagueRouter = express.Router()
leagueRouter.use(authenticateToken)
leagueRouter.post("/newLeague", Controller.newLeague)
leagueRouter.post("/deleteLeague", Controller.deleteLeague)
//leagueRouter.post("/getLeague", Controller.getLeagueData)
leagueRouter.post('/getTeamsInLeague', Controller.getTeamsinLeague)
leagueRouter.post('/getUsersinLeague', Controller.getUsersinLeague)

