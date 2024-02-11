import { DriverApiStore, DriverTierStore, IdriverTiers, Team } from '../../model/dbTypes';
import { db } from '../../services/db/knexfile';
import { updateRacesApiStore } from '../data/dataPosting';
import RaceDataManager from './raceDataManager'
import { TeamPointsDistributor } from './teamPointsDistributor';
import {apiSportsDriverRankRes} from '../../model/apiSportsResponseTypes'
 
export class PointSystem{
    private date:number
    private timeBuffer = 3600000 //length of time before teams become uneditable
    private resultsManager:RaceDataManager
    private teamPoints:TeamPointsDistributor[] = []; //for new results if any
    private teamsToCheck:Team[] = [] // for checking & setting editable status and passing into teampoints
    private uneditableTeams:Team[] = []
    private driverTiers:IdriverTiers|undefined
    private drivers : apiSportsDriverRankRes[] = []




    constructor(){
        this.resultsManager = new RaceDataManager();
        this.date = Date.now()

    }

    async init(){
        this.resultsManager.init();
        const dbTierRes = await db<DriverTierStore>('DriverTierStore').returning('*')
        const dbDriverRes = await db<DriverApiStore>('DriverApiStore').returning('*')

        this.driverTiers = dbTierRes[0].tiers
        this.drivers = dbDriverRes[0].response.response as apiSportsDriverRankRes[] 
    }

    updateRacesPlanned(){
        updateRacesApiStore();
    }

    async getAllTeamsToCheck(){
        try {
            const dbRes = await db<Team>('teams').where('points_calculated','=','false').returning('*')
            this.teamsToCheck = dbRes
        } catch (error) {
            
        }
    }

    async setTeamsforUneditable(){
        try {
            for (let i = 0; i < this.teamsToCheck.length; i++){
                const teamRaceId = this.teamsToCheck[i].competition_id
                const plannedRace = this.resultsManager.PlannedRaces.filter((race)=>{
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
            
        }

    }

    async checkTeamsForCalculatingPoints(){
        const completedRaces = this.resultsManager.PlannedRaces.filter((race)=>{
            if(race.status === "Completed"){
                return race
            }
        })

        for (let i = 0; i < completedRaces.length; i++){
            const raceTeams = this.teamsToCheck.filter((team) =>{
                if(team.id === completedRaces[i].id)
                return team
            })
            for(let i = 0; i < raceTeams.length; i++){
                const result = this.resultsManager.getResultfromId(completedRaces[i].id)
                const pointTeam = new TeamPointsDistributor(raceTeams[i],this.driverTiers,result,this.drivers,)
            }
        }

    }
    //get complteded races
    //cross check team ids
    //if points_calculatesd == false
    //pass to team points


    calculateAllPoints(){

    }

    postTeamsWithPoints(){

    }

    update(){
        //to be called outside, for updating every few minutes in conjustion with data posting functions
    }

}