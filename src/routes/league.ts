import express from "express"
import * as Controller from "../controller/league"
export let router = express.Router()

router.post("/newLeague", Controller.newLeague)
router.get('/getTeamsInLeague', Controller.getTeamsinLeague)
