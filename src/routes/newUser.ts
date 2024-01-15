import express from 'express'
import * as Controller from '../controller/user'
import {authenticateRefreshToken} from '../controller/middleware/auth'


export let newUserRouter = express.Router()

//insecure methods
newUserRouter.use(authenticateRefreshToken)
newUserRouter.post("/newUser", Controller.newUser)
newUserRouter.post("/confirmUser", Controller.confirmUser)
newUserRouter.post("/resendCode",Controller.resendConfirmationCode)
newUserRouter.post("/authPassword", Controller.authenticateUser)
newUserRouter.get("/refreshToken", Controller.refreshToken)

