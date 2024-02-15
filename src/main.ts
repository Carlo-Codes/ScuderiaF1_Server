import { env } from 'process';
import 'dotenv/config'
import app from './server'
import 'dotenv/config'
import createDatabase, { populateTables } from './services/db/setup'
import RaceResultsManager from './libraries/resultsSystem/DataManager';
import { createFastestLapsResults, createUserLeagueRelationTable, createTeamsTable, createUsernamesTable } from './services/db/setup/dbSetup';
import { PointSystem } from './libraries/resultsSystem/pointSystem';


const port = env.PORT
console.log("hello from the server")  

app.listen(port, ()=>{
    console.log("server running on port :") 
    console.log(port) 
}) 

async function test(){ 
    const pointsSystem = new PointSystem();
    await pointsSystem.init();
    await pointsSystem.update();
}


//test()

//downloadAsset('https://media-4.api-sports.io/formula-1/drivers/25.png', path.join(baseDir, 'image.png'))
//createDatabase();   
//populateTables();