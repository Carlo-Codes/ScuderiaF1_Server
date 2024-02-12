import { resolve } from "node:path";
import {apiSportsDriverRankRes, apiSportsRaceResult, apiSportsRacesRes, apiSportsResponseBinding, apiSportsFastestLapResults} from "../../model/apiSportsResponseTypes";
import { RacesApiStore, RaceResultsStore, DriverApiStore, IdriverTiers, FastestLapsResultsStore, DriverTierStore} from "../../model/dbTypes";
import {db} from '../../services/db/knexfile'
import { getFromApiSports } from "../data/dataFetch";



export default class DataManager{
    private date:number|undefined
    private racesPlanned:apiSportsRacesRes[] = []
    private newResults:RaceResultsStore[] = []
    private newfastestLaps:apiSportsFastestLapResults[] = [] //only the fastes laps

    private raceResultsToGet:number[] = [] //ids
    private fasteLapResultsToGet:number[] = []


    //fromDb
    private allRaceResults:RaceResultsStore[] = []
    private allFastestLapResult:FastestLapsResultsStore[] =[]
    private allDrivers:DriverApiStore|undefined
    private driverTierData:DriverTierStore|undefined
    

    private readonly getResultsUrl = 'https://v1.formula-1.api-sports.io/rankings/races?race='
    private readonly getFastetLapUrl = "https://v1.formula-1.api-sports.io/rankings/fastestlaps?race="

    async init(){
        await this.update()
    }
 
    private async getRacesPlanned(){
        try {
            const payload = await db<RacesApiStore>('RacesApiStore')
            .where('id', '=','1').returning('*')
            if(!payload[0].response.response){
                throw new Error('getting planned races failed')
            }
            this.racesPlanned = payload[0].response.response as apiSportsRacesRes[]
            

        } catch (error) {
            if (error instanceof Error){
                console.log(error)
            }
        }
    }

    private async getFastestLap(id:number){
        const url = this.getFastetLapUrl + id
        const res = await getFromApiSports(url) as apiSportsResponseBinding
        const fastestLapResults = res.response as apiSportsFastestLapResults[]
        const fastestLap = fastestLapResults.filter((result)=>{
            if(result.position === 1){
                return result
            }
        })[0]
        return fastestLap
    }

    private async getFastestLaps(){
        try {
            for(let i = 0; i < this.fasteLapResultsToGet.length; i++){
                const result = await this.getFastestLap(this.fasteLapResultsToGet[i])
                this.newfastestLaps.push(result)
            }
        } catch (error) {
            
        }

    }
    
    private apiSleep(ms:number){
        return new Promise ((resolve) => setTimeout(resolve, ms))
    }

    private async getNewResults(){
        try {
            if(this.raceResultsToGet?.length > 0){
                for(let i = 0; i < this.raceResultsToGet?.length; i++){
                    const url = this.getResultsUrl + this.raceResultsToGet[i]

                    await this.apiSleep(500)
                    const res = await getFromApiSports(url) as apiSportsResponseBinding
                    console.log(res)
                    const results = res.response as apiSportsRaceResult[]

                    this.newResults.push({
                        id:this.raceResultsToGet[i],
                        results:{results:results}
                    })
                }
            }
    
        } catch (error) {
            if (error instanceof Error){
                console.log(error)
            }
        }
    }

    private async postNewResults(){
        try {
            for(let i = 0; i < this.newResults.length; i++){
                const id = this.newResults[i].id
                const result = this.newResults[i].results
                if(!result) throw new Error("No race results")
                
                const dbRes = await db<RaceResultsStore>('RaceResultsStore').insert({
                    id:id,
                    results:result
                })
            }
        } catch (error) {
            if (error instanceof Error){
                console.log(error)
            }
        }
    }

    private async postNewFastestLapResults(){
        try {
            for(let i = 0; i < this.newfastestLaps.length; i++){
                const id = this.newfastestLaps[i].race.id
                const result = this.newfastestLaps[i]
                if(!result) throw new Error("No race results")
                
                const dbRes = await db<FastestLapsResultsStore>('FastestLapsResultsStore').insert({
                    id:id,
                    results:result
                })
            }
        } catch (error) {
            if (error instanceof Error){
                console.log(error)
            }
        }
    }

    private async getallData(){
        try {
            const raceResultsPayload = await db<RaceResultsStore>('RaceResultsStore').returning('*')
            const fastestLapResPayload = await db<FastestLapsResultsStore>('FastestLapsResultsStore').returning('*')
            const driverData = await db<DriverApiStore>('DriverApiStore').returning('*') //returns 1 row
            const driverTierData = await db<DriverTierStore>('DriverTierStore').returning('*') //returns 1 row

            this.allRaceResults = raceResultsPayload
            this.allFastestLapResult = fastestLapResPayload
            this.allDrivers = driverData[0]
            this.driverTierData = driverTierData[0]

            if(!raceResultsPayload[0]||!fastestLapResPayload[0]||!driverData[0]||!driverTierData[0]){
                throw new Error('getting some or all data failed')
            }

        } catch (error) {
            if (error instanceof Error){
                console.log(error)
            } 
        } 
    }

    private async checkIfRaceResultsExist(raceid:number){ //in the db
        try {
          const dbRes = await db<RaceResultsStore>('RaceResultsStore')
          .where('id', '=', raceid).returning('*')

          if(dbRes[0]){
            return true
          }else{
            return false
          }
        } catch (error) {
            if (error instanceof Error){
                console.log(error)
            }
        }
    }

    private async checkIfFastestLapResultExist(raceId:number){ //in the db
        try {
            const dbRes = await db<FastestLapsResultsStore>('FastestLapsResultsStore')
            .where('id', '=', raceId).returning('*')

            if(dbRes[0]){
                return true
            } else {
                return false
            }
        } catch (error) {
            
        }
    } 

    private async checkIfFastestLapResultsNeedGetting(){
        try {
            if(this.date){
                for(let i = 0; i < this.racesPlanned.length; i++){
                    const alreadyExistsCheck = await this.checkIfFastestLapResultExist(this.racesPlanned[i].id)
                    if(this.racesPlanned[i].status === "Completed" && !alreadyExistsCheck && this.racesPlanned[i].type === "Race"){
                        this.fasteLapResultsToGet.push(this.racesPlanned[i].id)
                    }
                }
            } else{
                throw new Error('no current date to comapre')
            }
        } catch (error) {
            if (error instanceof Error){
                console.log(error)
            }
        }


    }

    private async checkIfRaceResultsNeedGetting(){
        try {
            if(this.date){
                for(let i = 0; i < this.racesPlanned.length; i++){
                    const alreadyExistsCheck = await this.checkIfRaceResultsExist(this.racesPlanned[i].id)
                    if(this.racesPlanned[i].status === "Completed" && !alreadyExistsCheck && this.racesPlanned[i].type==="Race"){
                        this.raceResultsToGet.push(this.racesPlanned[i].id)
                    }
                }
            } else{
                throw new Error('no current date to comapre')
            }
        } catch (error) {
            if (error instanceof Error){
                console.log(error)
            }
        }


    }

    async update(){
        this.date = Date.now();
        await this.getRacesPlanned();

        await this.checkIfRaceResultsNeedGetting();
        await this.checkIfFastestLapResultsNeedGetting();

        await this.getNewResults();
        await this.getFastestLaps();

        await this.postNewResults();
        await this.postNewFastestLapResults();

        await this.getallData();
    }

    get RaceResults():RaceResultsStore[]{
        return this.allRaceResults
    }

    get FastestLapResults():FastestLapsResultsStore[]{
        return this.allFastestLapResult
    }

    get PlannedRaces():apiSportsRacesRes[]{
        return this.racesPlanned
    }

    get Drivers():apiSportsDriverRankRes[]{
        return this.allDrivers?.response.response as apiSportsDriverRankRes[]
    }

    get DriverTiers():IdriverTiers|undefined{
        return this.driverTierData?.tiers
    }

    getResultfromId(id:number):RaceResultsStore|undefined{
        const filteredResults = this.allRaceResults.filter((result) => {
            if(result.id == id){
                return result
            }
        })
        return filteredResults[0] 
    }

    getFastestLapfromId(id:number){
        const filteredResults = this.allFastestLapResult.filter((result) => {
            if(result.id == id){
                return result
            }
        })
        return filteredResults[0]
    }

}