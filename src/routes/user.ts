import express from 'express'
import * as Controller from '../controller/user'
import {authenticateToken} from '../controller/middleware/auth'


export let userRouter = express.Router()

//insecure methods
userRouter.post("/newUser", Controller.newUser)
userRouter.post("/confirmUser", Controller.confirmUser)
userRouter.post("/resendCode",Controller.resendConfirmationCode)


//secure methods
userRouter.use(authenticateToken)
userRouter.get("/getData", Controller.getData)
userRouter.post("/authPassword", Controller.authenticateUser)
userRouter.post("/refreshToken", Controller.refreshToken)

//router.get("/getUser",)