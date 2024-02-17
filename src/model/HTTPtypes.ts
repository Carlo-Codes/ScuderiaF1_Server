import { apiSportsDriverRankRes, apiSportsRacesRes } from "./apiSportsResponseTypes";
import { Driver, League, Team, User, Usernames, draftTeam } from "./dbTypes";
import { IdriverTiers } from "./dbTypes";


export interface newUserRequest extends Omit <User,'id'>{
    username:string
    password:string
}

export interface DBResponse{
    code?:number,
    message?: string,
    row?:User|Driver|Team|League
}

export interface newTeamRequest extends Omit <Team,'id'| 'user_id'>{

}

export interface newLeagueRequest extends Omit <League,'id'|'inviteCode'|'owner_user_id'|'user_ids'>{
    token:string
}

export interface joinLeagueRequest extends tokenAuthRequest{
    inviteCode:string
}

export interface DeleteLeagueRequest extends tokenAuthRequest{
    leagueId:number
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
    id:number
}

export interface getTeamsinLeageReq extends tokenAuthRequest{
    id:number 
}

export interface getUsersinLeageReq extends tokenAuthRequest{
    id:number 
}


export interface getUsersinLeageRes{
    users:Usernames[]
}

export interface LeagueAndTeams{
    leauge: League,
    teamsInLeage : Team[]
}

export interface dataResponse {
    driverData:apiSportsDriverRankRes[],
    raceData:apiSportsRacesRes[],
    userTeams:Team[]
    userLeagues:League[]
    participatingLeague:Pick<League, "id" | "league_name">[]
    driverTiers:IdriverTiers
}

export interface addUserToLeagueReq extends tokenAuthRequest{
    inviteCode:string
}






