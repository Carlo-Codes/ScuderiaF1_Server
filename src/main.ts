import { env } from 'process';
import 'dotenv/config'
import app from './server'
import 'dotenv/config'
import createDatabase from './services/db/setup'

const port = env.PORT
console.log("hello from the server")  

app.listen(port,()=>{
    console.log("server running on port :") 
    console.log(port) 
}) 



//downloadAsset('https://media-4.api-sports.io/formula-1/drivers/25.png', path.join(baseDir, 'image.png'))
//createDatabase();   