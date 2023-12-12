export interface apiSportsDriver{
    id: number,
    name: string,
    abbr: string,
    number: number,
    image: string
}

export interface apiSportsTeam{
    id:number,
    name:string,
    logo:string
}

export interface apiSportsDriverRankRes{
    position:number,
    driver:apiSportsDriver,
    team:apiSportsTeam,
    points:number | null,
    wins:number | null,
    behind:number | null,
    season: number
}

export interface apiSportsResponseBinding{
    get:string,
    parameters:object,
    errors: string[],
    results:number,
    response: apiSportsDriverRankRes[] | apiSportsRacesRes[] //|| somethign else
}

export interface apiSportsResponse{
    method:string,
    options:object,
    timeout:boolean,
    cancelOnTimeout:boolean,
    bindings:apiSportsResponseBinding[]
}

export interface apiSportsLocation{
    city:string,
    country:string
}

export interface apiSportsCompetition{
    id:number,
    name:string,
    location: apiSportsLocation
}

export interface apiSportsCircuit{
    id:number,
    name:string,
    image:string
}

export interface apiSportsRacesRes{
    id:number,
    competition : apiSportsCompetition,
    circuit:apiSportsCircuit,
    season: number,
    type: string,
    laps: object,
    fastest_lap: object
}