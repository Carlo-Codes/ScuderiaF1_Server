import { env } from 'process';
import 'dotenv/config'
import app from './server'
import 'dotenv/config'
import createDatabase, { populateTables } from './services/db/setup'
import RaceResultsManager from './libraries/resultsSystem/DataManager';
import { createFastestLapsResults, createUserLeagueRelationTable, createTeamsTable, createUsernamesTable } from './services/db/setup/dbSetup';
import { PointSystem } from './libraries/resultsSystem/pointSystem';
import { updateCircuitPictures, updateDriverPictures } from './libraries/data/dataPosting';


const port = env.PORT
console.log("hello from the server")  

app.listen(port, ()=>{
    console.log("server running on port :") 
    console.log(port) 
}) 

const pointsSystem = new PointSystem();

async function pointSystenLoop(){
    await pointsSystem.init();
    setInterval(async()=>{
        await pointsSystem.update();
    },1800000) 
}

pointSystenLoop();

//createDatabase();   
//populateTables();