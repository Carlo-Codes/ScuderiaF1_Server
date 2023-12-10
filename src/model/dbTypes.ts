export interface User{
    id:number;
    email:string;
    cogSub:string; 
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
    team_name:string,
    tier1_driver_id:number,
    tier2_driver_id:number,
    tier3_driver_id:number,
    dnf_driver_id:number,
    user_id:number
    league_id?:number
}
export interface League{
    id:number,
    user_id:number,
    league_name:string,
}

export interface RacesApiStore{
    id:number,
    response:object
}

export interface DriverApiStore{
    response:object
}