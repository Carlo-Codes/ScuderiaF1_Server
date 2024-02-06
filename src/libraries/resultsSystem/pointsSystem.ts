import { error } from "console";
import { apiSportsRaceResult } from "../../model/apiSportsResponseTypes";
import { FastestLapsResultsStore, IdriverTiers, RaceResultsStore } from "../../model/dbTypes";
import { IdriverNameToIdMap } from "../../model/dbTypes";
import { SelectionParameters, SelectionParamsMap } from "../../model/frontEnd";


export class PointsSystemDistributor{
    RaceResults:RaceResultsStore|undefined;
    fastestLapResults:FastestLapsResultsStore|undefined

    driverSelectionResult:apiSportsRaceResult|undefined

    positionOverall:number|undefined;
    positionTierRelative:number|undefined;
    driverTiers : IdriverTiers|undefined
    tier : keyof SelectionParameters|undefined;
    driverSeleciton : IdriverNameToIdMap|undefined
    points:number = 0


    init(tier:keyof IdriverTiers, raceResults:RaceResultsStore, driver:IdriverNameToIdMap, driverTiers:IdriverTiers, fastestLapResults:FastestLapsResultsStore){
        try {

            const driversInTier = driverTiers[tier].drivers as IdriverNameToIdMap[]
            let driverTierTest = driversInTier.find((d) => {d.id === driver.id})
            if(driverTierTest){
                this.RaceResults = raceResults
                this.tier = tier
                this.driverTiers = driverTiers
                this.driverSeleciton = driver as IdriverNameToIdMap
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
            //dont need to make this calculation if its a dnf or fastest lap
            //overallPosition
            const SelectionResult = this.RaceResults?.results.find((result) => {result.driver.id === this.driverSeleciton?.id}) as apiSportsRaceResult
            if(!SelectionResult){
                throw new Error('no overall position result')
            }
            this.positionOverall = SelectionResult?.position
            this.driverSelectionResult = SelectionResult
            //
            //relativePosition to tier
            let driversInTiersResults:apiSportsRaceResult[] = []
            const tierName = SelectionParamsMap[this.tier!].IdriverTierName
            const driversInTiers = this.driverTiers![tierName!].drivers! as IdriverNameToIdMap[]
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

    calculatePoints(){
        try {
            if(this.tier === "tier1" || this.tier === "tier2" || this.tier === "tier3"){
                if(this.driverSelectionResult?.time === "DNF"){
                    this.points = -5
                } else if(this.positionTierRelative === 1){
                    this.points = 20;
                } else if(this.positionTierRelative === 2){
                    this.points = 10;
                } else if(this.points === 3){
                    this.points = 5
                }

            } else if(this.tier === 'dnf'){
                let DNFdriverTier:keyof IdriverTiers;
                const possibleDriverTiers  = Object.keys(this.driverTiers!);
                for(let i = 0; i < possibleDriverTiers.length; i++){
                    const tierName = possibleDriverTiers[i] as keyof IdriverTiers
                    const driversInTiers = this.driverTiers![tierName!].drivers! as IdriverNameToIdMap[]
                    if(driversInTiers.includes(this.driverSeleciton!)){
                        if(tierName === 'tier1'){
                            this.points = 20
                        }else if(tierName === 'tier2'){
                            this.points = 15
                        }else if (tierName === 'tier3'){
                            this.points = 10
                        }
                    }
                }
                
            } else if (this.tier === 'fastestLap'){
                const fLapsResults = this.fastestLapResults!.results
                for(let i = 0; i < fLapsResults.length; i++){
                    if(fLapsResults[i].position === 1){
                        if(fLapsResults[i].driver.id === this.driverSeleciton?.id){
                            this.points = 15;
                        }
                    }
                }
            }

        } catch (error) {
            if(error instanceof Error){
                console.log(error)
            }  
        }
    }

    







}