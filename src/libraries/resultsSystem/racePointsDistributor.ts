import RaceResultsManager from './raceResultsManager'
import { TeamPointsDistributor } from './teamPointsDistributor';

export class RacePointsDistributor{
    private resultsManager = new RaceResultsManager()
    private teams:TeamPointsDistributor[] = [];
}