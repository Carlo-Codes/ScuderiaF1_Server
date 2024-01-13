import express from 'express'
import * as Controller from '../controller/team'

let router = express.Router()
router.post("/newTeam", Controller.newTeam) 
router.post("/updateTeam", Controller.updateTeam)
router.post("/addTeamToLeague",Controller.joinTeamToLeague)