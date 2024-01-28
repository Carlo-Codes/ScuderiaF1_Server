import { env } from 'process';
import 'dotenv/config'
import app from './server'
import 'dotenv/config'
import {createDriverTierStore, createTeamsResultsTable, createDraftTeamsTable, createUserTable, createTeamsTable, createDriverTable, createLeagesTable, createRacesApiStore, createDriverApiStore, createTeamLeagueRelationTable } from './services/db/dbSetup';
import {updateRacesApiStore, updateDriversApiStore} from './libraries/data/dataPosting'
import { generateDriverTiers } from './libraries/data/generateDriverrankings';
const port = env.PORT
console.log("hello from the server")  

app.listen(port,()=>{
    console.log("server running on port :") 
    console.log(port) 
}) 



//downloadAsset('https://media-4.api-sports.io/formula-1/drivers/25.png', path.join(baseDir, 'image.png'))

/* createDriverTable();
createLeagesTable();
createTeamsTable(); 
createRacesApiStore();      
createDriverApiStore();
createDriverTierStore(); 
createTeamLeagueRelationTable(); 
createTeamsResultsTable();
*/


updateRacesApiStore();
updateDriversApiStore(); 
generateDriverTiers();

