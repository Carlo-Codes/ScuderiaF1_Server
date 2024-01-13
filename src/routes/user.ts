import express from 'express'
import * as Controller from '../controller/user'
let router = express.Router()
router.post("/newUser", Controller.newUser)
router.post("/confirmUser", Controller.confirmUser)
router.post("/resendCode",Controller.resendConfirmationCode)
router.get("/getData", Controller.getData)

router.post("/authPassword", Controller.authenticateUser)
router.post("/refreshToken", Controller.refreshToken)

//router.get("/getUser",)