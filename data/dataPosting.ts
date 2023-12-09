import {getFromApiSports} from './dataFetch'
import {db} from '../main'
import { RacesApiStore } from '../model/dbTypes';

const seasonYear = 2023
const racesUrl = `https://v1.formula-1.api-sports.io/races?season=${seasonYear}`
const driverUrl = `https://v1.formula-1.api-sports.io/drivers?search=${seasonYear}`

export async function updateRacesApiStore(){
    const res = await getFromApiSports(racesUrl)
    const currentStore = await db<RacesApiStore>('RacesApiStore').where('id', '1')
    if(currentStore[0]){
        const res = await getFromApiSports(racesUrl)
        await db<RacesApiStore>('RacesApiStore').where('id', '1').update({
            response:res
        })
    }else {
        await db<RacesApiStore>('RacesApiStore').insert({
            response:res
        })
    }
}

