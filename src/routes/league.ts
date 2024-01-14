import express from "express"
import * as Controller from "../controller/league"
import {authenticateToken} from '../controller/middleware/auth'

export let leagueRouter = express.Router()
leagueRouter.use(authenticateToken)
leagueRouter.post("/newLeague", Controller.newLeague)
leagueRouter.get('/getTeamsInLeague', Controller.getTeamsinLeague)
