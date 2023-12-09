import fetch from 'node-fetch'


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




