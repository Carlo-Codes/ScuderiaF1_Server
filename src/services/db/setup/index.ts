import {createFastestLapsResults, createDriverTierStore, createTeamsResultsTable, createDraftTeamsTable, createUserTable, createTeamsTable, createDriverTable, createLeagesTable, createRacesApiStore, createDriverApiStore, createTeamLeagueRelationTable, createRaceResults } from './dbSetup';
import {updateRacesApiStore, updateDriversApiStore} from '../../../libraries/data/dataPosting'
import {generateDriverTiers} from '../../../libraries/data/generateDriverrankings'



export default async function createDatabase(){
    await createTables()
    await populateTables()
}

async function createTables(){
   await createLeagesTable();
   await createTeamsTable(); 
   await createRacesApiStore();      
   await createDriverApiStore();
   await createDriverTierStore(); 
   await createTeamLeagueRelationTable()
   await createRaceResults();
   await createFastestLapsResults();
}

export async function populateTables(){
    await updateRacesApiStore();
    await updateDriversApiStore();
    await generateDriverTiers();
}