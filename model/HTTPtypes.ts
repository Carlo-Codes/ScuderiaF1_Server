import { Driver, League, Team, User } from "./dbTypes";


export interface newUserRequest extends Omit <User,'id'>{
    password:string
}

export interface DBResponse{
    code?:number,
    message?: string,
    row?:User|Driver|Team|League
}

export interface newTeamRequest extends Omit <Team,'id'| 'user_id'>{
    webToken:string
}

export interface newLeagueRequest extends Omit <League,'id'|'user_id'>{
    webToken:string
}

export interface authenticationRequest {
    username:string,
    password:string
}

export interface confirmUserRequest extends Omit<User, 'id'|'cogSub'> {
    code:string
}