import RaceResultsManager from './raceResultsManager'
import { TeamPointsDistributor } from './teamPointsDistributor';

export class RacePointsDistributor{
    resultsManager = new RaceResultsManager()
    teams:TeamPointsDistributor[] = [];
}