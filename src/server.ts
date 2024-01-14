import express, { RequestHandler } from "express";
import { leagueRouter } from "./routes/league";
import { userRouter } from "./routes/user";
import { teamRouter } from "./routes/team";
import bodyParser from "body-parser";

const app = express()
app.use(express.static("../client"));

app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb'}))
app.use(express.json());

export const ping : RequestHandler = async  (req, res, next) => {
  res.send("pong");
  console.log("pong")
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*'); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  
    res.header('Content-Security-Policy', "img-src 'self'");
    next();
  });

app.get('/', function (req, res, next) {
   res.sendFile(__dirname + 'index.html');
   next() 
 }); 

app.get("/ping", ping) 

app.use("/api/user", userRouter)
app.use("/api/league", leagueRouter)
app.use("/api/team", teamRouter)




export default app