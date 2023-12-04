import express from "express"
import * as Controller from "../controller/apiController"
//import * as AuthController from  //for authing

let router = express.Router()

//MiddleWare//
//router.use(AuthController.verifyAccessToken)//for authing

//Endpoints//
router.get("/ping", Controller.ping) 

router.post("/newUser", Controller.newUser)
router.post("/confirmUser", Controller.confirmUser)
router.post("/resendCode",Controller.resendConfirmationCode)
router.post("/newTeam", Controller.newTeam) 
router.post("/newLeague", Controller.newLeague)
router.post("/updateTeam", Controller.updateTeam)

router.get("/authPassword", Controller.authenticateUser)
router.get("/refreshToken", Controller.refreshToken)


export default router  