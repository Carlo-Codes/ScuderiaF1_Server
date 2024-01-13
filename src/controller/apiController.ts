import {RequestHandler} from "express"
import { Team, User, Driver, League, RacesApiStore, DriverApiStore, draftTeam, LeagueTeamRelation } from "../model/dbTypes";
import { editTeamRequest, newTeamRequest, newUserRequest, DBResponse, newLeagueRequest, authenticationRequest,confirmUserRequest, resendConfirmationCodeRequest, tokenAuthRequest, getLeagueDataReq, getTeamsinLeageReq, dataResponse, addTeamToLeagueReq } from "../model/HTTPtypes";
import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cogAuthPassword, cogAuthToken, cogConfirmUser, cogDelUser, cogGetUser, cogResendConfirmationCode, cogSignup } from "../services/aws-sdk/cognito";
import { Knex } from "knex";
import { apiSportsDriverRankRes, apiSportsRacesRes } from "../model/apiSportsResponseTypes";
import { randomBytes } from "node:crypto";


