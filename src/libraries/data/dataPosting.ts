import {downloadAsset, getFromApiSports} from './dataFetch'
import {db} from '../../services/db/knexfile'
import { DriverApiStore, RacesApiStore } from '../../model/dbTypes';
import {apiSportsFastestLapResults, apiSportsRacesRes, apiSportsResponse, apiSportsDriverRankRes, apiSportsResponseBinding} from '../../model/apiSportsResponseTypes'
import path from 'path';
import * as fs from 'node:fs/promises';
const seasonYear = 2024
const racesUrl = `https://v1.formula-1.api-sports.io/races?season=${seasonYear}`
const driverUrl = `https://v1.formula-1.api-sports.io/rankings/drivers?season=${seasonYear}`
const fastestLapURL = `https://v1.formula-1.api-sports.io/rankings/fastestlaps?race=`
const baseDir = path.join(__dirname, '..','..', 'client', 'assets')
const driverImgDir = path.join(baseDir, 'driverImages')
const circuitImgDir = path.join(baseDir, 'circuitImages')


export async function updateRacesApiStore(){
    try {
        const res = await getFromApiSports(racesUrl) as apiSportsResponseBinding
        const races = res.response as apiSportsRacesRes[]
        //updateCircuitPictures(races) 
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
        //updateDriverPictures(drivers);
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

    const files = await fs.readdir(driverImgDir)
    const filenames = [] as string[]
    for (const file of files){
        filenames.push(path.parse(file).name) 
    }

    for (let i = 0; i < driverRes.length; i++){ 
        const url = driverRes[i].driver.image
        const name = driverRes[i].driver.name
        if(!filenames.includes(name)){
            const imgPath = path.join(driverImgDir,`${name}.png`)
            setTimeout(()=>{downloadAsset(url, imgPath)},3000);    
        }
    }
}

export async function updateCircuitPictures(raceRes:apiSportsRacesRes[]){
    const files = await fs.readdir(circuitImgDir)
    const filenames = [] as string[]

    for (const file of files){
        filenames.push(path.parse(file).name)
    }
    
    for(let i = 0; i < raceRes.length; i++){
        const url = raceRes[i].circuit.image
        const name = raceRes[i].circuit.name

        if(!filenames.includes(name)){
            const imgPath = path.join(circuitImgDir, `${name}.png`)
            setTimeout(()=>{downloadAsset(url, imgPath)},3000);
        }
    }
} 




