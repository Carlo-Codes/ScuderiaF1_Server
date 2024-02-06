export interface apiSportsDriver {
    id: number;
    name: string;
    abbr: string | null;
    number: number;
    image: string;
  }
  
  export interface apiSportsTeam {
    id: number;
    name: string;
    logo: string;
  }
  
  export interface apiSportsDriverRankRes {
    position: number;
    driver: apiSportsDriver;
    team: apiSportsTeam;
    points: number | null;
    wins: number | null;
    behind: number | null;
    season: number;
  }
  
  export interface apiSportsRaceResult {
    race: {
      id: number;
    };
    driver: apiSportsDriver;
    team: apiSportsTeam;
    position: number;
    time: string;
  }

  export interface apiSportsFastestLapResults {
    race: {
      id: number;
    };
    driver: apiSportsDriver;
    team: apiSportsTeam;
    position: number;
    lap: number;
    time: string;
    avg_speed: string;
  }
  
  export interface apiSportsResponseBinding {
    get: string;
    parameters: object;
    errors: string[];
    results: number;
    response: apiSportsDriverRankRes[] | apiSportsRaceResult[] | apiSportsRacesRes[] | apiSportsFastestLapResults[];
  }
  
  export interface apiSportsResponse {
    method: string;
    options: object;
    timeout: boolean;
    cancelOnTimeout: boolean;
    bindings: apiSportsResponseBinding[];
  }
  
  export interface apiSportsLocation {
    city: string;
    country: string;
  }
  
  export interface apiSportsCompetition {
    id: number;
    name: string;
    location: apiSportsLocation;
  }
  
  export interface apiSportsCircuit {
    id: number;
    name: string;
    image: string;
  }
  
  export interface apiSportsRacesRes {
    id: number;
    date: string;
    competition: apiSportsCompetition;
    circuit: apiSportsCircuit;
    season: number;
    type: string;
    laps: object;
    fastest_lap: object;
    status: string;
  }
  