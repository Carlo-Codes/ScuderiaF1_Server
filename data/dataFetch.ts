import fetch from 'node-fetch'
const seasonYear = 2023

const apiSportsConfig = {
    method:'get',
    headers: {
        "x-rapidapi-key":"14dbc453cdfea255add81128ba902975",
        "x-rapidapi-host":"v1.formula-1.api-sports.io"
    }
}

export async function getRaces():Promise<void>{
    const response = await fetch(`https://v1.formula-1.api-sports.io/races?season=${seasonYear}`,apiSportsConfig)
    const data = await response.json()
    console.log(data)
}


