import express from 'express'
import * as Controller from '../controller/user'
import {authenticateToken} from '../controller/middleware/auth'


export let newUserRouter = express.Router()

//insecure methods
newUserRouter.post("/newUser", Controller.newUser)
newUserRouter.post("/confirmUser", Controller.confirmUser)
newUserRouter.post("/resendCode",Controller.resendConfirmationCode)
newUserRouter.post("/authPassword", Controller.authenticateUser)

