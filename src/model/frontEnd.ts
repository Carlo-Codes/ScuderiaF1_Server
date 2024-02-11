import { IdriverTiers, Team } from "./dbTypes"

export interface TeamFrontEnd extends Omit<Team,'id'|'user_id'|'points_calculated'|'editable'>{
}


export interface selectionParam {
    name:keyof SelectionParameters,
    IdriverTierName: keyof IdriverTiers | null
    dbSelection:keyof TeamFrontEnd | keyof Team,
    dbPoints:keyof TeamFrontEnd | keyof Team,
    clientName:string
}

export interface SelectionParameters {
    tier1:selectionParam,
    tier2:selectionParam,
    tier3:selectionParam,
    dnf:selectionParam,
    fastestLap:selectionParam
}


export const SelectionParamsMap:SelectionParameters = {  //maps selection parameters accross different serivices and data storage
       
    tier1:{
        name:"tier1",
        IdriverTierName:'tier1',
        dbSelection:"tier1_driver_id",
        dbPoints:"tier1_points",
        clientName: "Tier 1",
    }
,

    tier2:{
        name:"tier2",
        IdriverTierName:'tier2',
        dbSelection:"tier2_driver_id",
        dbPoints:"tier2_points",
        clientName: "Tier 2"
   }
,

    tier3:{
        name:"tier3",
        IdriverTierName:'tier3',
        dbSelection:"tier3_driver_id",
        dbPoints:"tier3_points",
        clientName: "Tier 3"
   }
,

    dnf:{
        name:"dnf",
        IdriverTierName:null,
        dbSelection:"dnf_driver_id",
        dbPoints:"dnf_points",
        clientName: "DNF"
   }
,

    fastestLap:{
        name:'fastestLap',
        IdriverTierName:null,
        dbSelection:"fastest_lap_driver_id",
        dbPoints: "fastest_lap_points",
        clientName: "Fastest Lap"
   }

}