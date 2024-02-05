import { error } from "console";
import { apiSportsRaceResult } from "../../model/apiSportsResponseTypes";
import { IdriverTiers, RaceResultsStore } from "../../model/dbTypes";
import { IdriverNameToIdMap } from "../../model/dbTypes";


export class PointsSystemDistributor{
    RaceResults:RaceResultsStore|undefined;
    positionOverall:number|undefined;
    positionTierRelative:number|undefined;
    driverTiers : IdriverTiers|undefined
    tier : keyof IdriverTiers|undefined;
    driverSeleciton : number|undefined


    init(tier:keyof IdriverTiers, raceResults:RaceResultsStore, driverId:number, driverTiers:IdriverTiers){
        try {

            const driversInTier = driverTiers[tier].drivers as IdriverNameToIdMap[]
            let driverTierTest = driversInTier.find((d) => {d.id === driverId})
            if(driverTierTest){
                this.RaceResults = raceResults
                this.tier = tier
                this.driverTiers = driverTiers
                this.driverSeleciton = driverId
            } else {
                throw new Error('Driver Does not belong in tier')
            }
        } catch (error) {
            if(error instanceof Error){
                console.log(error)
            }
        }

    }

    definePositions(){
        try {
            //overallPosition
            const SelectionResult = this.RaceResults?.results.find((result) => {result.driver.id === this.driverSeleciton})
            if(!SelectionResult){
                throw new Error('no overall position result')
            }
            this.positionOverall = SelectionResult?.position
            //
            //relativePosition to tier
            let driversInTiersResults:apiSportsRaceResult[] = []
            const driversInTiers = this.driverTiers![this.tier!].drivers! as IdriverNameToIdMap[]
            for(let i = 0; i < driversInTiers.length; i++){
                const driverPositionResult = this.RaceResults?.results.find((result) => {result.driver.id === driversInTiers[i].id})
                if(driverPositionResult){
                    driversInTiersResults.push(driverPositionResult)
                }
            }
            driversInTiersResults.sort((a,b) => a.position - b.position)
            
            const realtivePositon = driversInTiersResults.indexOf(SelectionResult)
            this.positionTierRelative = realtivePositon + 1

        } catch (error) {
            if(error instanceof Error){
                console.log(error)
            }  
        }

    }








}