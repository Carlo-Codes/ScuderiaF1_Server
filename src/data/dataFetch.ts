import { fstat } from 'fs';
import fetch from 'node-fetch'
import * as fs from 'node:fs/promises';

const apiSportsConfig = {
    method:'get',
    headers: {
        "x-rapidapi-key":"14dbc453cdfea255add81128ba902975",
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
        const asset = await fetch(url)
        const data = await asset.buffer()
        await fs.writeFile(filename,data)
        console.log('image saved')
    } catch (err:unknown) {
        console.log(err)
    }
}
 


