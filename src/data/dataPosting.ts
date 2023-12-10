import {getFromApiSports} from './dataFetch'
import {db} from '../main'
import { DriverApiStore, RacesApiStore } from '../model/dbTypes';

const seasonYear = 2023
const racesUrl = `https://v1.formula-1.api-sports.io/races?season=${seasonYear}`
const driverUrl = `https://v1.formula-1.api-sports.io/drivers?search=${seasonYear}`

export async function updateRacesApiStore(){
    try {
        const res = await getFromApiSports(racesUrl)
        const currentStore = await db<RacesApiStore>('RacesApiStore').where('id', '1')
        if(currentStore[0]){
            await db<RacesApiStore>('RacesApiStore').where('id', '1').update({
                response:res
            })
        }else {
            await db<RacesApiStore>('RacesApiStore').insert({
                response:res
            })
        }
    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err.message)
        }
    }
}

export async function updateDriversApiStore(){
    try {
        const res = await getFromApiSports(driverUrl)
        const currentStore = await db<DriverApiStore>('DriverApiStore').where('id', '1')
        if(currentStore[0]){
            await db<DriverApiStore>('DriverApiStore').where('id', '1').update({
                response:res
            })
        }else {
            await db<DriverApiStore>('DriverApiStore').insert({
                response:res
            })
        }
    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err.message)
        }
    }
}



