import { apiSportsRaceResult, apiSportsRacesRes, apiSportsResponseBinding } from "../../model/apiSportsResponseTypes";
import { RacesApiStore, RaceResultsStore} from "../../model/dbTypes";
import {db} from '../../services/db/knexfile'
import { getFromApiSports } from "../data/dataFetch";



export default class RaceResultsManager{
    date:Date|undefined
    racesPlanned:apiSportsRacesRes[] = []
    newResults:RaceResultsStore[] = []
    raceResultsToGet:number[] = [] //ids

    getResultsUrl = 'https://v1.formula-1.api-sports.io/rankings/startinggrid?race='

    async getRacesPlanned(){
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

    async getNewResults(){
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

    postNewResults(){
        try {
            for(let i = 0; i < this.newResults.length; i++){
                const dbRes = db<RaceResultsStore>('RaceResultsStore').insert({
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

    checkIfResultsExist(raceid:number){
        try {
          
        } catch (error) {
            
        }
    }

    checkIfResultsNeedGetting(){

    }


}