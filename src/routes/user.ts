import express from 'express'
import * as Controller from '../controller/user'
import {authenticateToken} from '../controller/middleware/auth'


export let userRouter = express.Router()


//secure methods
userRouter.use(authenticateToken)
userRouter.get("/getData", Controller.getData)
userRouter.post("/refreshToken", Controller.refreshToken)

//router.get("/getUser",)