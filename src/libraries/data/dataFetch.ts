import { fstat } from 'fs';
import { ServerResponse } from 'http';
import fetch from 'node-fetch'
import * as fs from 'node:fs/promises';

const apiSportsConfig = {
    method:'get',
    headers: {
        "x-rapidapi-key":"76754ff5cf3e47c29929836ff96feaf5",
        "x-rapidapi-host":"v1.formula-1.api-sports.io"
    }
}

export async function getFromApiSports(url:string):Promise<object>{
    const response = await fetch(url,apiSportsConfig)
    const data = await response.json()
    return data
}


export async function downloadAsset(url:string, filename:string){
    try {
        const res = await fetch(url)
        if(res.status != 200){
            console.log('error downloading imager, try again')
            return 
        }
        const data = await res.buffer()
        await fs.writeFile(filename,data)
        console.log('image saved')
    } catch (err:unknown) {
        console.log(err)
    }
}
 


