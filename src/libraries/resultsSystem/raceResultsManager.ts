import { apiSportsRaceResult, apiSportsRacesRes, apiSportsResponseBinding } from "../../model/apiSportsResponseTypes";
import { RacesApiStore, RaceResultsStore} from "../../model/dbTypes";
import {db} from '../../services/db/knexfile'
import { getFromApiSports } from "../data/dataFetch";



export default class RaceResultsManager{
    private date:number|undefined
    private racesPlanned:apiSportsRacesRes[] = []
    private newResults:RaceResultsStore[] = []
    private raceResultsToGet:number[] = [] //ids

    private readonly getResultsUrl = 'https://v1.formula-1.api-sports.io/rankings/startinggrid?race='

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

    private async getNewResults(){
        try {
            if(this.raceResultsToGet?.length > 0){
                for(let i = 0; i < this.raceResultsToGet?.length; i++){
                    const url = this.getResultsUrl + this.raceResultsToGet[i]
                    const res = await getFromApiSports(url) as apiSportsResponseBinding
                    const results = res.response as apiSportsRaceResult[]
                    this.newResults.push({
                        id:this.raceResultsToGet[i],
                        results:results
                    })
                }
            } else throw new Error('No race Results to get')
    
        } catch (error) {
            if (error instanceof Error){
                console.log(error)
            }
        }
    }

    private async postNewResults(){
        try {
            for(let i = 0; i < this.newResults.length; i++){
                const dbRes = await db<RaceResultsStore>('RaceResultsStore').insert({
                    id:this.newResults[i].id,
                    results:this.newResults[i].results
                })
            }
        } catch (error) {
            if (error instanceof Error){
                console.log(error)
            }
        }
    }

    private async checkIfResultsExist(raceid:number){
        try {
          const dbRes = await db<RaceResultsStore>('RaceResultsStore')
          .where('id', '=', raceid).returning('*')

          if(dbRes){
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

    private async checkIfResultsNeedGetting(){
        try {
            if(this.date){
                let resultsToGet:number[] = []
                for(let i = 0; i < this.racesPlanned.length; i++){
                    const alreadyExistsCheck = await this.checkIfResultsExist(this.racesPlanned[i].id)
                    if(this.racesPlanned[i].status === "Completed" && !alreadyExistsCheck){
                        resultsToGet.push(this.racesPlanned[i].id)
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
        await this.checkIfResultsNeedGetting();
        await this.getNewResults();
        await this.postNewResults();
    }


}