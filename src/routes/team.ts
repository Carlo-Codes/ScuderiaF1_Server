import express from 'express'
import * as Controller from '../controller/team'
import {authenticateToken} from '../controller/middleware/auth'

export let teamRouter = express.Router()
teamRouter.use(authenticateToken)
teamRouter.post("/newTeam", Controller.newTeam) 
teamRouter.post("/updateTeam", Controller.updateTeam)
