import { error } from "console";
import { apiSportsRaceResult, apiSportsDriver , apiSportsFastestLapResults} from "../../model/apiSportsResponseTypes";
import { Driver, FastestLapsResultsStore, IdriverTiers, RaceResultsStore } from "../../model/dbTypes";
import { IdriverNameToIdMap } from "../../model/dbTypes";
import { SelectionParameters, SelectionParamsMap } from "../../model/frontEnd";


export class TierPointsDistributor{
    private RaceResults:RaceResultsStore|undefined;
    private fastestLapResults:apiSportsFastestLapResults|undefined

    private driverSelectionResult:apiSportsRaceResult|undefined

    private positionOverall:number|undefined;
    private positionTierRelative:number|undefined;
    private readonly driverTiers : IdriverTiers|undefined
    private readonly tier : keyof SelectionParameters|undefined;
    private readonly driverSeleciton : apiSportsDriver|undefined
    private points:number = 0


    constructor(tier:keyof SelectionParameters, raceResults:RaceResultsStore, driver:apiSportsDriver, driverTiers:IdriverTiers, fastestLapResults:apiSportsFastestLapResults){
        try {

            const driverTierName = SelectionParamsMap[tier].IdriverTierName
            
            if(driverTierName){
                const driversInTier = driverTiers[driverTierName].drivers as apiSportsDriver[]
                let driverTierTest = driversInTier.find((d) => {
                    if(d.id === driver.id){
                        return d    
                }
                })
                if(!driverTierTest){
                    throw new Error('Driver Does not belong in tier') 
                } 
            }

            this.RaceResults = raceResults
            this.tier = tier
            this.driverTiers = driverTiers 
            this.driverSeleciton = driver as apiSportsDriver
            this.fastestLapResults = fastestLapResults
            

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
            const SelectionResult = this.RaceResults?.results.results.find((result) => {
                if(result.driver.id === this.driverSeleciton?.id){
                    return result
            }}) as apiSportsRaceResult
            if(!SelectionResult){
                this.points = 0
            }
            this.positionOverall = SelectionResult?.position
            this.driverSelectionResult = SelectionResult 
            //
            //relativePosition to tier
            let driversInTiersResults:apiSportsRaceResult[] = [] 
            const tierName = SelectionParamsMap[this.tier!].IdriverTierName
            if(!tierName){
                return //this is a tierless parameter
            }
            const driversInTiers = this.driverTiers![tierName!].drivers as apiSportsDriver[]
            for(let i = 0; i < driversInTiers.length; i++){
                const driverPositionResult = this.RaceResults?.results.results.find((result) => {
                    if(result.driver.id === driversInTiers[i].id){
                        return result
                }})

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
                } else if(this.positionTierRelative === 3){
                    this.points = 5
                } else{
                    this.points = 0
                }

            } else if(this.tier === 'dnf'){
                let DNFdriverTier:keyof IdriverTiers;
                const possibleDriverTiers  = Object.keys(this.driverTiers!);
                for(let i = 0; i < possibleDriverTiers.length; i++){
                    const tierName = possibleDriverTiers[i] as keyof IdriverTiers
                    const driversInTiers = this.driverTiers![tierName!].drivers! as apiSportsDriver[]
                    if(driversInTiers.includes(this.driverSeleciton!)){
                        if(tierName === 'tier1'){
                            this.points = 20
                        }else if(tierName === 'tier2'){
                            this.points = 15
                        }else if (tierName === 'tier3'){
                            this.points = 10
                        } else{
                            this.points = 0
                        }
                    }
                }
                
            } else if (this.tier === 'fastestLap'){
                    if(this.fastestLapResults!.position === 1){
                        if(this.fastestLapResults!.driver.id === this.driverSeleciton?.id){
                            this.points = 15;
                        } else {
                            this.points = 0
                        }
                    }
                }
            

        } catch (error) {
            if(error instanceof Error){
                console.log(error)
            }  
        }
    }

    get Tier():keyof SelectionParameters|undefined{
        if(this.tier){
            return this.tier
        } else {return undefined}
        
    }

    get Points():number{
        return this.points
    }

    







}