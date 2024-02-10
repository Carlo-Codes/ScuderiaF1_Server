import { updateRacesApiStore } from '../data/dataPosting';
import RaceResultsManager from './raceResultsManager'
import { TeamPointsDistributor } from './teamPointsDistributor';

export class RacePointsDistributor{

    private resultsManager:RaceResultsManager
    private teams:TeamPointsDistributor[] = [];

    constructor(){
        this.resultsManager = new RaceResultsManager();
    }

    async init(){
        this.resultsManager.init();
    }

    updateRacesPlanned(){
        updateRacesApiStore();
    }

    getAllTeams(){
        const racesToCaluclate = this.resultsManager.NewResults
        for(let i = 0; i < racesToCaluclate.length; i++){
            
        }
    }

    calculateAllPoints(){

    }

    postTeamsWithPoints(){

    }

}