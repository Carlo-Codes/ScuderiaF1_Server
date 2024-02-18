import { DriverApiStore, DriverTierStore, IdriverTiers, Team } from '../../model/dbTypes';
import { db } from '../../services/db/knexfile';
import {updateRacesApiStore } from '../data/dataPosting';
import RaceDataManager from './DataManager'
import { TeamPointsDistributor } from './teamPointsDistributor';
import {apiSportsDriverRankRes} from '../../model/apiSportsResponseTypes'
import DataManager from './DataManager';
 
export class PointSystem{
    private date:number
    private timeBuffer = 3600000 //length of time before teams become uneditable
    private data:DataManager
    private teamPoints:TeamPointsDistributor[] = []; //for new results if any
    private teamsToCheck:Team[] = [] // for checking & setting editable status and passing into teampoints

    constructor(){
        this.data = new DataManager();
        this.date = Date.now()

    }

    async init(){
        await this.data.init();


    }

    private updateRacesPlanned(){
        updateRacesApiStore();
    }

    async getAllTeamsToCheck(){
        try {
            const dbRes = await db<Team>('teams').where('points_calculated','=','false').returning('*')
            this.teamsToCheck = dbRes
        } catch (error) { 
            console.log(error)
        }
    }

    private async setTeamsforUneditable(){
        try {
            for (let i = 0; i < this.teamsToCheck.length; i++){
                const teamRaceId = this.teamsToCheck[i].competition_id
                const plannedRace = this.data.PlannedRaces.filter((race)=>{ //call stack limit problem
                    if(race.id === teamRaceId){
                        return race 
                    } 
                })[0]
    
                const raceDate = new Date(plannedRace.date).getTime()
                const editableCutoffTime = raceDate - this.timeBuffer
                if(this.date > editableCutoffTime){
                    const dbRes = db<Team>('teams').where('id', '=', teamRaceId).update({
                        editable:false
                    }).returning('*')
                }
    
            }
        } catch (error) {
            console.log(error)
        }

    }

    private async checkTeamsForCalculatingPoints(){
        try {
            const completedRaces = this.data.PlannedRaces.filter((race)=>{
                if(race.status === "Completed" && race.type ==="Race"){
                    return race
                }
            })
    
            for (let i = 0; i < completedRaces.length; i++){ 
                const raceId = completedRaces[i].id
                const raceTeams = this.teamsToCheck.filter((team) =>{
                    if(team.competition_id === raceId)
                    return team
                })
                for(let i = 0; i < raceTeams.length; i++){
                    const result = this.data.getResultfromId(raceId)
                    const fastestLapResult = this.data.getFastestLapfromId(completedRaces[i].id).results
                    if(this.data.DriverTiers && result){
                        const pointTeam = new TeamPointsDistributor(raceTeams[i],this.data.DriverTiers,result,this.data.Drivers,fastestLapResult)
                        this.teamPoints.push(pointTeam)     
                    } else throw new Error('race data is missing data')
                }
            } 
    
        } catch (error) {
            console.log(error)
        }

    }

    private async calculateAllPointsAndPost(){
        for(let i = 0; i < this.teamPoints.length; i++){
            this.teamPoints[i].calculatePoints()
            this.teamPoints[i].assignPointsToTeam();
            await this.teamPoints[i].updateTeamWithPoints()
        } 
    }

   async update(){//to be called outside, for updating every few minutes in conjustion with data posting functions
        await this.data.update();
        await this.getAllTeamsToCheck();
        await this.setTeamsforUneditable();
        await this.checkTeamsForCalculatingPoints();
        await this.calculateAllPointsAndPost()
    }

}