import {apiSportsResponseBinding ,apiSportsDriver , apiSportsRaceResult, apiSportsFastestLapResults} from './apiSportsResponseTypes'
import {JSX} from 'react'

export interface User{
    id:number;
    email:string;
    cogSub:string; 
}

export interface IdriverNameToIdMap{
    name:string,
    id:number
}

export interface IdriverTiers {
    tier1:{
        drivers?:IdriverNameToIdMap[]|JSX.Element[]|apiSportsDriver[]
    },
    tier2:{
        drivers?:IdriverNameToIdMap[]|JSX.Element[]|apiSportsDriver[]
    }
    tier3:{
        drivers?:IdriverNameToIdMap[]|JSX.Element[]|apiSportsDriver[]
    }
}

export interface Driver {
    id:number,
    driverId:string,
    number:number, 
    code:string,
    url:URL,
    firstName:string,
    surname:string, 
    DOB:Date,
    nationality:string
    dateAdded:Date
}
export interface Team{
    id:number,
    tier1_driver_id?:number,
    tier2_driver_id?:number,
    tier3_driver_id?:number,
    fastest_lap_driver_id?:number,
    dnf_driver_id?:number,
    user_id:string
    league_id?:number
    competition_id:number
    tier1_points?:number,
    tier2_points?:number,
    tier3_points?:number,
    dnf_points?:number,
    fastest_lap_points?:number,
    points_calculated:boolean,
    editable:boolean
}


export interface TeamResults{
    id:number,
    team_id:number,


    tier1_driver_id:number,
    tier2_driver_id:number,
    tier3_driver_id:number,
    fastest_lap_driver_id:number,
    dnf_driver_id:number

}

export interface draftTeam extends Omit<Team, 'competion_id'>{
    competion_id?:number
}

export interface League{
    id:number,
    owner_user_id:number,
    league_name:string,
    inviteCode:string,
    simulation:boolean
}

export interface LeagueTeamRelation{
    id:number,
    team_id:number,
    league_id:string
}

export interface RacesApiStore{
    id:number,
    response:apiSportsResponseBinding
}

export interface DriverApiStore{
    id:number,
    response:apiSportsResponseBinding
}

export interface DriverTierStore{
    id:number,
    tiers:IdriverTiers
}

export interface RaceResultsStore {
    id:number //raceid
    results:{results:apiSportsRaceResult[]}
}

export interface FastestLapsResultsStore{
    id:number
    results:{results : apiSportsFastestLapResults[]}
}