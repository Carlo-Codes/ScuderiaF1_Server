import {createFastestLapsResults, createDriverTierStore, createTeamsResultsTable, createDraftTeamsTable, createUserTable, createTeamsTable, createDriverTable, createLeagesTable, createRacesApiStore, createDriverApiStore, createUserLeagueRelationTable, createRaceResults, createUsernamesTable } from './dbSetup';
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
   await createUserLeagueRelationTable()
   await createRaceResults();
   await createFastestLapsResults();
   await createUsernamesTable();
}

export async function populateTables(){
    await updateRacesApiStore();
    await updateDriversApiStore();
    await generateDriverTiers();
}