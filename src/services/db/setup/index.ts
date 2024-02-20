import {createFastestLapsResults, createDriverTierStore, createTeamsTable, createLeagesTable, createRacesApiStore, createDriverApiStore, createUserLeagueRelationTable, createRaceResults, createUsernamesTable } from './dbSetup';
import {updateRacesApiStore, updateDriversApiStore} from '../../../libraries/data/dataPosting'
import {generateDriverTiers} from '../../../libraries/data/generateDriverrankings'
import { db } from '../knexfile';


export default async function createDatabase(){
    await createTables() 
    await populateTables()
}

async function createTables(){

    const leagueCheck = await db.schema.hasTable('leagues')
    const teamsCheck = await db.schema.hasTable('teams')
    const raceStoreCheck = await db.schema.hasTable('RacesApiStore')
    const driverStoreCheck = await db.schema.hasTable('DriverApiStore')
    const driverTierCheck = await db.schema.hasTable('DriverTierStore')
    const UserLeagueCheck = await db.schema.hasTable('UserLeagueRelation')
    const RaceResultsCheck = await db.schema.hasTable('RaceResultsStore')
    const FastestLapsCheck = await db.schema.hasTable('FastestLapsResultsStore')
    const usernameCheck = await db.schema.hasTable('Usernames') 

    if(!leagueCheck){
        await createLeagesTable();
    }
    if(!teamsCheck){
        await createTeamsTable(); 
    }
    if(!raceStoreCheck){
        await createRacesApiStore();      
    }
    if(!driverStoreCheck){
        await createDriverApiStore();
    }
    if(!driverTierCheck){
        await createDriverTierStore(); 
    }
    if(!UserLeagueCheck){
        await createUserLeagueRelationTable()
    }
    if(!RaceResultsCheck){
        await createRaceResults();
    }
    if(!FastestLapsCheck){
        await createFastestLapsResults();
    }
    if(!usernameCheck){
        await createUsernamesTable(); 
    } 
}

export async function populateTables(){
    await updateRacesApiStore();
    await updateDriversApiStore();
    await generateDriverTiers();
}