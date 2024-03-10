import { SelectionParamsMap, SelectionParameters, TeamFrontEnd } from "../../model/frontEnd";
import { TierPointsDistributor } from "./TierPointsDistributor";
import {apiSportsDriverRankRes, apiSportsFastestLapResults} from './../../model/apiSportsResponseTypes'
import {IdriverTiers, RaceResultsStore, Team, DriverApiStore, IdriverNameToIdMap, FastestLapsResultsStore} from './../../model/dbTypes'
import { db } from "../../services/db/knexfile";

export class TeamPointsDistributor{
    private Params = Object.keys(SelectionParamsMap)
    private tierSelections:TierPointsDistributor[] = []
    private readonly team:Team;
    private driverTiers:IdriverTiers
    private drivers:apiSportsDriverRankRes[]
    private fastestLapResults:apiSportsFastestLapResults
    private teamWithPoints : TeamFrontEnd;


    constructor(team:Team, driverTiers:IdriverTiers,  raceResults:RaceResultsStore, drivers:apiSportsDriverRankRes[], fastestLapResults:apiSportsFastestLapResults){
        this.team = team
        this.teamWithPoints = team
        this.driverTiers = driverTiers;
        this.fastestLapResults = fastestLapResults;
        this.drivers = drivers;
        this.fastestLapResults = fastestLapResults 

        try {
            for(let i = 0; i < this.Params.length; i++){
                const param = this.Params[i] as keyof SelectionParameters
                const parameterSelection = this.team[SelectionParamsMap[param].dbSelection]
                const driverTierName = SelectionParamsMap[param].IdriverTierName
                const driverRankings = this.drivers
                const driverObject = driverRankings.filter((driver)=>{
                    if (driver.driver.id === parameterSelection){
                        return driver
                    }
                })[0].driver;
                if(param){
                    const tierPoints = new TierPointsDistributor(param,raceResults,driverObject,this.driverTiers,this.fastestLapResults)
                    this.tierSelections.push(tierPoints)
                } 
            }
    
        } catch (error) {
            
        }
    }

    calculatePoints(){
        for(let i = 0; i < this.tierSelections.length; i++){
            this.tierSelections[i].definePositions();
            this.tierSelections[i].calculatePoints()
        }
    }

    assignPointsToTeam(){ 
        try {
            for(let i = 0; i < this.tierSelections.length; i++){
                if(this.tierSelections[i]){
                    const tierName = this.tierSelections[i].Tier!
                    const points = this.tierSelections[i].Points
                    const teamParam = SelectionParamsMap[tierName].dbPoints as keyof TeamFrontEnd
                    this.teamWithPoints[teamParam] = points
                }
        }

        } catch (error) {
            
        }
    }
    
    async updateTeamWithPoints(){
        try {
            const dbres = await db<Team>('teams')
            .where('id', '=', this.team.id)
            .update({ 
                tier1_points:this.teamWithPoints.tier1_points,
                tier2_points:this.teamWithPoints.tier2_points,
                tier3_points:this.teamWithPoints.tier3_points,
                fastest_lap_points:this.teamWithPoints.fastest_lap_points,
                dnf_points:this.teamWithPoints.dnf_points,
                points_calculated:true,
                
            }).returning('*')

        } catch (error) {
            
        }
    }


}