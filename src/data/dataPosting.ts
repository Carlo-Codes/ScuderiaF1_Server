import {downloadAsset, getFromApiSports} from './dataFetch'
import {db} from '../main'
import { DriverApiStore, RacesApiStore } from '../model/dbTypes';
import {apiSportsDriver, apiSportsResponse, apiSportsDriverRankRes, apiSportsResponseBinding} from '../model/apiSportsResponseTypes'
import path from 'path';
const seasonYear = 2023
const racesUrl = `https://v1.formula-1.api-sports.io/races?season=${seasonYear}`
const driverUrl = `https://v1.formula-1.api-sports.io/rankings/drivers?season=${seasonYear}`

const baseDir = path.join(__dirname, '..','..', 'client', 'assets')
const driverImgDir = path.join(baseDir, 'driverImages')


export async function updateRacesApiStore(){
    try {
        const res = await getFromApiSports(racesUrl) as apiSportsResponse
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
        const res = await getFromApiSports(driverUrl) as apiSportsResponseBinding 
        const drivers = res.response as apiSportsDriverRankRes[]
        updateDriverPictures(drivers);
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

export async function updateDriverPictures(driverRes:apiSportsDriverRankRes[]) {

    for (let i = 0; i < driverRes.length; i++){ 
        const url = driverRes[i].driver.image
        const name = driverRes[i].driver.name
        const imgPath = path.join(driverImgDir,`${name}.png`)
        downloadAsset(url,imgPath)
    }
}



