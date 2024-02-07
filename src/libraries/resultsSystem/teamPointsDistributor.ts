import { SelectionParamsMap, SelectionParameters } from "../../model/frontEnd";
import { TierPointsDistributor } from "./TierPointsDistributor";
import {apiSportsDriverRankRes} from './../../model/apiSportsResponseTypes'
import {IdriverTiers, RaceResultsStore, Team, DriverApiStore, IdriverNameToIdMap, FastestLapsResultsStore} from './../../model/dbTypes'

export class TeamPointsDistributor{
    Params = Object.keys(SelectionParamsMap)
    tierSelections:TierPointsDistributor[] = []
    team:Team|undefined
    driverTiers:IdriverTiers|undefined
    drivers:DriverApiStore|undefined
    fastestLapResults:FastestLapsResultsStore|undefined


    init(team:Team, driverTiers:IdriverTiers,  raceResults:RaceResultsStore, drivers:DriverApiStore, fastestLapResults:FastestLapsResultsStore){
        this.team = team
        this.driverTiers = driverTiers;
        this.fastestLapResults = fastestLapResults
        for(let i = 0; i < this.Params.length; i++){
            const param = this.Params[i] as keyof SelectionParameters
            const parameterSelection = this.team[SelectionParamsMap[param].dbSelection]
            const driverTierName = SelectionParamsMap[param].IdriverTierName
            const driverRankings = drivers.response.response as apiSportsDriverRankRes[]
            const driverObject = driverRankings.filter((driver)=>{
                if (driver.driver.id === parameterSelection){
                    return driver
                }
            })[0].driver;
            
            const tierPoints = new TierPointsDistributor()
            
            tierPoints.init(driverTierName!,raceResults,driverObject,this.driverTiers,fastestLapResults)
        }
    }

    //post() post team or return team 
}