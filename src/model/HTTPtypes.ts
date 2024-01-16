import { apiSportsDriverRankRes, apiSportsRacesRes } from "./apiSportsResponseTypes";
import { Driver, League, Team, User, draftTeam } from "./dbTypes";


export interface newUserRequest extends Omit <User,'id'>{
    password:string
}

export interface DBResponse{
    code?:number,
    message?: string,
    row?:User|Driver|Team|League
}

export interface newTeamRequest extends Omit <Team,'id'| 'user_id'>{
    token:string
}

export interface newLeagueRequest extends Omit <League,'id'|'inviteCode'>{
    token:string
}

export interface authenticationRequest {
    email:string,
    password:string
}

export interface tokenAuthRequest{
    token:string
}

export interface confirmUserRequest extends Omit<User, 'id'|'cogSub'> {
    code:string
}

export interface confirmUserRequest extends Omit<User, 'id'|'cogSub'> {
    code:string
}

export interface resendConfirmationCodeRequest extends Omit<User, 'id'|'cogSub'> {
    
}

export interface editTeamRequest extends newTeamRequest {
    teamId:string
}

export interface getLeagueDataReq extends tokenAuthRequest{
    inviteCode:string
}

export interface getTeamsinLeageReq extends tokenAuthRequest{
    inviteCode:string
}

export interface LeagueAndTeams{
    leauge: League,
    teamsInLeage : Team[]
}

export interface dataResponse {
    driverData:apiSportsDriverRankRes[],
    raceData:apiSportsRacesRes[],
    userTeams:Team[]
    userDraftTeams:draftTeam[]
    userLeagues:League[]
    participatingLeague:League[]


}

export interface addTeamToLeagueReq extends tokenAuthRequest{
    inviteCode:string
    teamId:number
}






